import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import GitMeChat from './components/GitMeChat';
import Footer from './components/Footer';

// Idle-timeout for the in-memory GitHub PAT. After this many minutes of
// inactivity, we wipe state so /profile stops working and an attacker who
// obtains a foothold later (open laptop, XSS from a compromised dep) can't
// find the token in memory.
const IDLE_WIPE_MINUTES = 6 * 60;

const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const PageLoader = () => (
  <div className="min-h-screen bg-github-bg flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-github-text-secondary/30 border-t-github-text-secondary rounded-full animate-spin" />
  </div>
);

// Auto-login must be fast and must never hang. Bound every GitHub call so a
// slow/unreachable API aborts instead of leaving the spinner up forever.
const GITHUB_TIMEOUT_MS = 8000;

// Shared GitHub GraphQL POST. One place owns the endpoint, auth header, and
// JSON shape so the two call sites can't drift.
const githubGraphql = async (token, query, variables) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GITHUB_TIMEOUT_MS);
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    const json = await response.json().catch(() => ({}));
    return { status: response.status, json };
  } finally {
    clearTimeout(timer);
  }
};

// Lightweight identity query — this is all that gates the logged-in UI, so we
// run it first and flip to signed-in the moment it returns (sub-second).
const IDENTITY_QUERY = `
  query($login: String!) {
    user(login: $login) {
      name
      login
      bio
      avatarUrl
      url
      company
      location
      websiteUrl
      followers { totalCount }
      following { totalCount }
      contributionsCollection {
        contributionYears
      }
    }
  }
`;

// Heavier activity lists — fetched in the background after login and merged in
// when they arrive. The Overview and Contributions views render without them
// and fill in once resolved, so login latency never waits on this.
const ACTIVITY_QUERY = `
  query($login: String!) {
    user(login: $login) {
      pullRequests(last: 50, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          title url state createdAt
          repository { ...RepoMeta }
        }
      }
      issues(last: 50, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          title url state createdAt
          repository { ...RepoMeta }
        }
      }
      repositoryDiscussions(last: 50) {
        nodes {
          title url createdAt
          repository { ...RepoMeta }
        }
      }
    }
  }

  fragment RepoMeta on Repository {
    nameWithOwner
    primaryLanguage { name color }
    licenseInfo { name spdxId }
  }
`;

const App = () => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  // Start "true" when auto-login creds are present so a deep-link / refresh to
  // a protected route waits for login instead of redirecting away on first
  // render (before the auto-login effect has even run).
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(
    () => Boolean(import.meta.env.VITE_GITHUB_USERNAME && import.meta.env.VITE_GITHUB_TOKEN)
  );
  // Message shown on the login page after a failed auto-login or an idle wipe.
  const [loginNotice, setLoginNotice] = useState(null); // { text, tone } | null

  // Bumped on logout / new login so a slow in-flight login can't resurrect
  // state after the user has signed out (or the idle timer fired).
  const loginGenRef = useRef(0);
  // Guards the one-shot auto-login against React.StrictMode's double-invoke.
  const autoLoginTriedRef = useRef(false);

  // Background fetch of the heavy activity lists, merged into `data` when it
  // returns. Non-fatal: if it fails, Overview/Contributions just stay empty.
  const loadActivity = useCallback(async (tok, user, gen) => {
    try {
      const { json } = await githubGraphql(tok, ACTIVITY_QUERY, { login: user });
      if (gen !== loginGenRef.current) return; // superseded by logout/new login
      const activity = json?.data?.user;
      if (activity) setData((prev) => (prev ? { ...prev, ...activity } : prev));
    } catch {
      // Swallow — activity data is optional context, not a login blocker.
    }
  }, []);

  const handleLogin = async (user, tok) => {
    const gen = ++loginGenRef.current;
    try {
      setUsername(user);
      setToken(tok);

      const { status, json } = await githubGraphql(tok, IDENTITY_QUERY, { login: user });
      if (gen !== loginGenRef.current) return; // superseded by logout/new login

      // A rejected token returns a REST-style body ({ message: "Bad
      // credentials" }) with no GraphQL `data`/`errors` — classify it so the
      // user sees the real reason instead of a misleading "user not found".
      if (json?.message && !json.data) {
        if (status === 401) {
          throw new Error('GitHub rejected the access token — it may be expired or revoked. Generate a new token and update it.');
        }
        if (status === 403) {
          throw new Error(`GitHub refused the request: ${json.message}`);
        }
        throw new Error(`GitHub error: ${json.message}`);
      }
      if (json?.errors?.length) throw new Error(json.errors[0]?.message || 'GitHub query failed.');

      const userData = json?.data?.user;
      if (!userData) throw new Error(`No GitHub user named "${user}" was found.`);

      // Signed in — render immediately, then backfill activity lists.
      setData(userData);
      loadActivity(tok, user, gen);
    } catch (err) {
      if (gen !== loginGenRef.current) return; // stale failure — ignore
      if (err?.name === 'AbortError') {
        throw new Error('GitHub took too long to respond. Please try again.');
      }
      // Do NOT log err here — some GitHub error responses echo request
      // metadata that includes the token. Rethrow with a scrubbed message.
      throw new Error(err?.message || 'Sign-in failed. Check your credentials and try again.');
    }
  };

  const handleLogout = useCallback((notice) => {
    loginGenRef.current++; // invalidate any in-flight login
    setData(null);
    setToken('');
    setUsername('');
    setLoginNotice(notice && notice.text ? notice : null);
  }, []);

  // --- Automatic Login ---
  useEffect(() => {
    if (autoLoginTriedRef.current) return;
    const autoUsername = import.meta.env.VITE_GITHUB_USERNAME;
    const autoToken = import.meta.env.VITE_GITHUB_TOKEN;
    if (!autoUsername || !autoToken) return;

    autoLoginTriedRef.current = true;
    setIsAutoLoggingIn(true);
    handleLogin(autoUsername, autoToken)
      .catch((err) =>
        setLoginNotice({
          text: err?.message || 'Automatic sign-in failed. Enter your credentials to continue.',
          tone: 'error',
        })
      )
      .finally(() => setIsAutoLoggingIn(false));
  }, []);

  // --- Idle-timeout token wipe -------------------------------------------
  // Reset a timer on any user interaction. If IDLE_WIPE_MINUTES elapse
  // with no interaction, clear all auth state. Keeps the token from
  // living in memory on an unattended tab.
  const idleTimerRef = useRef(null);
  useEffect(() => {
    if (!token) return;

    const reset = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(
        () => handleLogout({ text: 'Signed out after inactivity. Sign in again to continue.', tone: 'info' }),
        IDLE_WIPE_MINUTES * 60 * 1000
      );
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'visibilitychange'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [token, handleLogout]);

  // Also wipe on `beforeunload` — belt-and-braces since React state dies
  // with the tab anyway, but this covers same-origin navigations.
  useEffect(() => {
    const wipe = () => {
      setToken('');
      setUsername('');
      setData(null);
    };
    window.addEventListener('beforeunload', wipe);
    return () => window.removeEventListener('beforeunload', wipe);
  }, []);

  return (
    <BrowserRouter basename="/gitme">
      <div className="min-h-screen bg-github-bg text-github-text flex flex-col">
        {data && (
          <Navbar
            data={data}
            username={username}
            onLogout={handleLogout}
          />
        )}

        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  data ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <LoginPage
                      onLogin={handleLogin}
                      autoLoggingIn={isAutoLoggingIn}
                      notice={loginNotice}
                    />
                  )
                }
              />
              <Route
                path="/home"
                element={
                  data ? (
                    <HomePage data={data} />
                  ) : isAutoLoggingIn ? (
                    <PageLoader />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  data ? (
                    <ProfilePage data={data} />
                  ) : isAutoLoggingIn ? (
                    <PageLoader />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              {/* Catch-all: unknown paths go home instead of rendering blank. */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        {data && <Footer />}

        {/* Global Floating AI Chatbot */}
        {data && <GitMeChat data={data} />}
      </div>
    </BrowserRouter >
  );
};

export default App;
