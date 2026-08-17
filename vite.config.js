import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import userConfig from './userConfig.js'
import {
  buildDescription,
  buildJsonLd,
  buildLlmsTxt,
  buildRobotsTxt,
  buildSitemap,
  buildStaticContent,
} from './seo.config.js'

/**
 * Build-time SEO. Substitutes the %USER_NAME% / %USER_DESCRIPTION% placeholders
 * in index.html and injects a schema.org JSON-LD graph, then emits robots.txt
 * and sitemap.xml.
 *
 * Done at build time (and in dev, via the same hook) rather than from React:
 * the metadata is then present in the raw HTML, so it works for crawlers and
 * link-preview bots that never execute JavaScript.
 */
const seo = () => ({
  name: 'seo',
  transformIndexHtml(html) {
    const jsonLd = buildJsonLd(userConfig)
      // A literal "</script>" inside JSON would close the tag early.
      .replace(/<\//g, '<\\/')
    return html
      .replaceAll('%USER_NAME%', userConfig.name || '')
      .replaceAll('%USER_DESCRIPTION%', buildDescription(userConfig))
      .replace(
        '</head>',
        `  <script type="application/ld+json">${jsonLd}</script>\n</head>`
      )
      // Pre-rendered content inside #root. React replaces it on mount, so
      // this is only ever seen by clients that don't run JavaScript.
      .replace(
        '<div id="root"></div>',
        `<div id="root">${buildStaticContent(userConfig)}</div>`
      )
  },
  generateBundle() {
    const isoDate = new Date().toISOString().slice(0, 10)
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt() })
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(isoDate) })
    // GEO: authoritative plain-text summary for language models.
    this.emitFile({
      type: 'asset',
      fileName: 'llms.txt',
      source: buildLlmsTxt({ ...userConfig, __buildDate: isoDate }),
    })
  },
  /**
   * Serve the same three files in dev.
   *
   * generateBundle is a build-only hook, so without this the dev server falls
   * through to its SPA handler and answers /robots.txt with index.html and a
   * 200 - which looks like success and hides mistakes. Registering the
   * middleware here (rather than returning a function) puts it BEFORE Vite's
   * internal middlewares, so it wins against that fallback.
   */
  configureServer(server) {
    const isoDate = new Date().toISOString().slice(0, 10)
    const generated = {
      '/robots.txt': ['text/plain', () => buildRobotsTxt()],
      '/sitemap.xml': ['application/xml', () => buildSitemap(isoDate)],
      '/llms.txt': ['text/plain', () => buildLlmsTxt({ ...userConfig, __buildDate: isoDate })],
    }
    server.middlewares.use((req, res, next) => {
      const entry = generated[(req.url || '').split('?')[0]]
      if (!entry) return next()
      const [type, render] = entry
      res.setHeader('Content-Type', `${type}; charset=utf-8`)
      res.end(render())
    })
  },
})

/**
 * SECURITY posture for this config:
 *
 *  1. `server.host: '127.0.0.1'`
 *     The dev server binds only to loopback. Anyone on the same Wi-Fi could
 *     otherwise hit our LAN IP, fetch /gitme/src/App.jsx, and grep out the
 *     inlined `VITE_GITHUB_TOKEN` / `VITE_OPENROUTER_API_KEY`. Explicitly
 *     opt in with `HOST=0.0.0.0 npm run dev` when you actually need LAN
 *     access (mobile testing), and only over a network you trust.
 *
 *  2. `server.strictPort: true`
 *     If port 3000 is in use, fail loudly instead of silently binding a
 *     different port that might not be firewalled.
 *
 *  3. `server.fs.strict: true` + `server.fs.deny`
 *     Vite already blocks `.env` / dotfiles, but we widen the deny list to
 *     also cover project docs an attacker with LAN access would use for
 *     reconnaissance (llm.txt, README, package.json, config files).
 */
export default defineConfig({
  plugins: [react(), seo()],
  // Served at the custom-domain root (akifejaz.dev/), not a project subpath.
  base: '/',
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    host: process.env.HOST || '127.0.0.1',
    watch: {
      usePolling: true,
    },
    fs: {
      strict: true,
      // Wildcards are picomatch - anywhere in the served tree.
      deny: [
        '.env',
        '.env.*',
        '**/.env',
        '**/.env.*',
        'llm.txt',
        '**/llm.txt',
        'README.md',
        '**/README.md',
        'CODE_OF_CONDUCT.md',
        '**/CODE_OF_CONDUCT.md',
        'CONTRIBUTING.md',
        '**/CONTRIBUTING.md',
        'LICENSE',
        '**/LICENSE',
        'SECURITY.md',
        '**/SECURITY.md',
        '.github/**',
        '**/.github/**',
        'package.json',
        '**/package.json',
        'package-lock.json',
        '**/package-lock.json',
        'vite.config.*',
        '**/vite.config.*',
        'tailwind.config.*',
        '**/tailwind.config.*',
        'postcss.config.*',
        '**/postcss.config.*',
        // NB: userConfig.js is NOT denied - it's an ES module the app
        // imports at runtime. In dev, it's still exposed via loopback
        // only (server.host). In production, its PII fields are baked
        // into the bundle regardless, so denying wouldn't help.
      ],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lucide': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
