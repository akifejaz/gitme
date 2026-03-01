import React, { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
    Users,
    MapPin,
    Building,
    Star,
    BookOpen,
    GitPullRequest,
    Calendar,
    Code2,
    FolderDot,
    Sparkles
} from 'lucide-react';
import ContributionChart from '../components/ContributionChart';

// --- Scrolling marquee wrapper ---
const Marquee = ({ children, speed = 30 }) => {
    // If few children, repeat them to ensure seamless overflow
    const items = Array.isArray(children) ? children : [children];
    const repeated = items.length < 10 ? [...items, ...items, ...items] : items;

    return (
        <div className="overflow-hidden relative w-full group">
            <div
                className="flex w-fit animate-marquee hover:pause-marquee"
                style={{ animationDuration: `${speed}s` }}
            >
                <div className="flex gap-4 px-2 items-center">
                    {repeated}
                </div>
                <div className="flex gap-4 px-2 items-center">
                    {repeated}
                </div>
            </div>
        </div>
    );
};

const HomePage = ({ data, username, token, contributionData }) => {
    const [readme, setReadme] = useState('');
    const [readmeLoading, setReadmeLoading] = useState(true);

    // Fetch user README from username/username repo
    useEffect(() => {
        const fetchReadme = async () => {
            setReadmeLoading(true);
            try {
                const res = await fetch(`https://api.github.com/repos/${username}/${username}/readme`, {
                    headers: { Authorization: `bearer ${token}`, Accept: 'application/vnd.github.v3.raw' },
                });
                if (res.ok) {
                    const text = await res.text();
                    setReadme(text);
                } else {
                    setReadme('');
                }
            } catch {
                setReadme('');
            } finally {
                setReadmeLoading(false);
            }
        };
        if (username && token) fetchReadme();
    }, [username, token]);

    // Extract unique organizations from contributions
    const contributionDetails = useMemo(() => {
        if (!data) return { orgs: [], repos: [] };
        const orgsSet = new Set();
        const reposSet = new Set();
        const allNodes = [
            ...(data.pullRequests?.nodes || []),
            ...(data.issues?.nodes || []),
            ...(data.repositoryDiscussions?.nodes || []),
        ];

        allNodes.forEach((n) => {
            const parts = n.repository.nameWithOwner.split('/');
            const owner = parts[0];
            if (owner.toLowerCase() !== username.toLowerCase()) {
                orgsSet.add(owner);
            }
            reposSet.add(n.repository.nameWithOwner);
        });

        return {
            orgs: Array.from(orgsSet),
            repos: Array.from(reposSet)
        };
    }, [data, username]);

    // Extract unique languages with colors
    const languages = useMemo(() => {
        if (!data) return [];
        const langMap = {};
        const allNodes = [
            ...(data.pullRequests?.nodes || []),
            ...(data.issues?.nodes || []),
            ...(data.repositoryDiscussions?.nodes || []),
        ];
        allNodes.forEach((n) => {
            const lang = n.repository.primaryLanguage;
            if (lang && !langMap[lang.name]) {
                langMap[lang.name] = lang.color || '#8b949e';
            }
        });
        return Object.entries(langMap).map(([name, color]) => ({ name, color }));
    }, [data]);

    // Stats
    const totalPRs = data?.pullRequests?.nodes?.length || 0;
    const mergedPRs = data?.pullRequests?.nodes?.filter((n) => n.state === 'MERGED').length || 0;

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-[296px_1fr] gap-8">
                {/* ─── LEFT SIDEBAR ────────────────────────────────────────────────── */}
                <aside className="flex flex-col gap-4">
                    {/* Avatar */}
                    <div className="relative group">
                        <img
                            src={data.avatarUrl}
                            alt={data.name}
                            className="w-full aspect-square rounded-full border border-github-border z-10 relative"
                        />
                        <div className="absolute right-0 bottom-6 w-10 h-10 bg-github-bg border border-github-border rounded-full flex items-center justify-center text-lg shadow-md z-20 group-hover:scale-110 transition-transform">
                            🔥
                        </div>
                    </div>

                    {/* Name / Username */}
                    <div className="py-1">
                        <h1 className="github-name font-bold text-github-text tracking-tight">
                            {data.name || username}
                        </h1>
                        <p className="github-username text-github-text-secondary leading-6">{username}</p>
                    </div>

                    {/* Bio */}
                    {data.bio && (
                        <p className="text-base text-github-text py-1 leading-snug">{data.bio}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full">
                        <button className="flex-1 h-8 flex items-center justify-center text-xs font-semibold bg-github-bg-secondary border border-github-border rounded-md hover:bg-github-border/60 transition-all text-github-text">
                            Follow
                        </button>
                        <a
                            href="https://calendar.app.google/sy4dWwRgVtXLHfBV6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 h-8 flex items-center justify-center gap-1.5 bg-brand-action text-white text-xs font-bold rounded-md hover:brightness-110 transition-all shadow-md shadow-brand-action/20"
                        >
                            <Calendar size={14} />
                            Book Meeting
                        </a>
                    </div>

                    {/* Followers / Following */}
                    <div className="flex items-center gap-1 text-sm text-github-text-secondary hover:text-github-text-link cursor-pointer pt-1">
                        <Users size={16} className="text-github-text-secondary mr-1" />
                        <span className="font-bold text-github-text">{data.followers?.totalCount ?? '0'}</span>
                        <span className="text-github-text-secondary">followers</span>
                        <span className="mx-1 text-github-text-secondary">·</span>
                        <span className="font-bold text-github-text">{data.following?.totalCount ?? '0'}</span>
                        <span className="text-github-text-secondary">following</span>
                    </div>

                    {/* Company & Socials */}
                    <div className="pt-2 mt-0.5 border-t border-github-border/40 flex flex-col gap-1.5">
                        {data.company && (
                            <div className="flex items-center gap-2 text-sm text-github-text">
                                <Building size={16} className="text-github-text-secondary shrink-0" />
                                <span className="font-medium">{data.company}</span>
                            </div>
                        )}

                        {/* Social Logos */}
                        <div className="flex items-center gap-4 py-1">
                            <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" className="w-6 h-6 invert" />
                            </a>
                            <a href="https://linkedin.com/in/akifejaz" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" className="w-6 h-6" />
                            </a>
                            <a href="mailto:akifejaz@gmail.com" className="hover:scale-110 transition-transform">
                                <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </aside>

                {/* ─── RIGHT MAIN CONTENT ──────────────────────────────────────────── */}
                <main className="flex flex-col min-w-0">


                    <div className="flex flex-col gap-8">
                        {/* README Card */}
                        <div className="rounded-lg border border-github-border overflow-hidden bg-transparent shadow-sm mb-8">
                            <div className="flex items-center justify-between px-4 py-3 bg-transparent border-b border-github-border">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-github-text">{username}</span>
                                    <span className="text-sm text-github-text-secondary">/ README.md</span>
                                </div>
                                <a
                                    href={`https://github.com/${username}/${username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-github-text-secondary hover:text-github-text-link transition-colors"
                                    title="View Source"
                                >
                                    <GitPullRequest size={14} />
                                </a>
                            </div>
                            <div className="p-6 markdown-body">
                                {readmeLoading ? (
                                    <div className="flex items-center gap-3 text-sm text-github-text-secondary py-10 justify-center">
                                        <div className="w-5 h-5 border-2 border-github-text-secondary/30 border-t-github-text-secondary rounded-full animate-spin" />
                                        Loading rich profile...
                                    </div>
                                ) : readme ? (
                                    <div className="prose prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                            {readme}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="text-sm text-github-text-secondary italic py-6 text-center">
                                        No special README found for this profile.
                                    </p>
                                )}
                            </div>
                        </div>




                        {/* ─── CIRCULAR MARQUEE SECTIONS ──────────────────────────────────── */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Organizations */}
                            {contributionDetails.orgs.length > 0 && (
                                <div className="rounded-lg border border-github-border p-4 bg-github-bg-secondary/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-github-text flex items-center gap-2">
                                            <Building size={16} className="text-github-text-secondary" />
                                            Collaborating Organizations
                                        </h3>
                                        <span className="text-[10px] font-bold text-github-text-secondary uppercase tracking-widest bg-github-bg px-2 py-0.5 rounded border border-github-border">
                                            Total : {contributionDetails.orgs.length}
                                        </span>
                                    </div>
                                    <Marquee speed={40}>
                                        {contributionDetails.orgs.map((org) => (
                                            <a
                                                key={org}
                                                href={`https://github.com/${org}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-github-bg border border-github-border rounded-full text-sm text-github-text hover:border-github-text-link transition-all shrink-0"
                                            >
                                                <img src={`https://github.com/${org}.png?size=32`} alt={org} className="w-6 h-6 rounded-sm" />
                                                <span className="font-medium">{org}</span>
                                            </a>
                                        ))}
                                    </Marquee>
                                </div>
                            )}

                            {/* Repositories & Languages */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="rounded-lg border border-github-border p-4 bg-github-bg-secondary/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-github-text flex items-center gap-2">
                                            <FolderDot size={16} className="text-github-text-secondary" />
                                            Contribution Repos
                                        </h3>
                                        <span className="text-[10px] font-bold text-github-text-secondary uppercase tracking-widest bg-github-bg px-2 py-0.5 rounded border border-github-border">
                                            Total : {contributionDetails.repos.length}
                                        </span>
                                    </div>
                                    <Marquee speed={50}>
                                        {contributionDetails.repos.map((repo) => (
                                            <span key={repo} className="px-3 py-1.5 bg-github-bg border border-github-border rounded-md text-xs font-mono text-github-text-secondary shrink-0">
                                                {repo.split('/')[1]}
                                            </span>
                                        ))}
                                    </Marquee>
                                </div>
                                <div className="rounded-lg border border-github-border p-4 bg-github-bg-secondary/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-github-text flex items-center gap-2">
                                            <Code2 size={16} className="text-github-text-secondary" />
                                            Stack & Languages
                                        </h3>
                                        <span className="text-[10px] font-bold text-github-text-secondary uppercase tracking-widest bg-github-bg px-2 py-0.5 rounded border border-github-border">
                                            Total : {languages.length}
                                        </span>
                                    </div>
                                    <Marquee speed={35}>
                                        {languages.map((lang) => (
                                            <span
                                                key={lang.name}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-github-bg border border-github-border rounded-md text-sm text-github-text shrink-0"
                                            >
                                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                                                {lang.name}
                                            </span>
                                        ))}
                                    </Marquee>
                                </div>
                            </div>
                        </div>

                        {/* Contribution Chart */}
                        {contributionData && (
                            <div className="pt-4 border-t border-github-border">
                                <h3 className="text-sm font-semibold text-github-text mb-4">Contribution Activity</h3>
                                <ContributionChart contributionData={contributionData} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
