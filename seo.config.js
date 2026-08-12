/**
 * Build-time SEO generation.
 *
 * Everything here is derived from `userConfig.js`, so the metadata, structured
 * data and sitemap can never drift from the portfolio content. Consumed by the
 * `seo()` plugin in vite.config.js and injected into index.html at build time,
 * which means crawlers (and social/link-preview bots, which mostly do NOT run
 * JavaScript) get the full picture from the raw HTML.
 */

export const SITE_URL = 'https://akifejaz.dev';

// Routes worth indexing. `/profile` is deliberately excluded: it renders live
// GitHub activity that needs an authenticated API call, so it has no stable
// crawlable content of its own.
export const INDEXABLE_ROUTES = ['/'];

const abs = (path) => new URL(path, SITE_URL).href;

/** One-line meta description: role, focus, and the affiliations people search. */
export const buildDescription = (cfg) => {
    const orgs = (cfg.experience || [])
        .slice(0, 3)
        .map((e) => e.org)
        .filter(Boolean);
    const base = `${cfg.name} — ${cfg.tagline}.`;
    const work = orgs.length ? ` Work at ${orgs.join(', ')}.` : '';
    const tail = ' RISC-V, Linux kernel, seL4 and Eclipse ThreadX firmware engineering.';
    return (base + work + tail).replace(/\s+/g, ' ').trim().slice(0, 300);
};

/** Topic keywords Google uses for entity association, from skills + tags. */
const buildKnowsAbout = (cfg) => {
    const fromStack = Object.values(cfg.stack || {}).flat();
    const fromTags = (cfg.projects || []).flatMap((p) => p.tags || []);
    const fromOrgs = (cfg.orgs || []).map((o) => (typeof o === 'string' ? o : o.name));
    return [...new Set([...fromStack, ...fromTags, ...fromOrgs])];
};

const splitAuthors = (authors) =>
    String(authors || '')
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean)
        .map((name) => ({ '@type': 'Person', name }));

/**
 * schema.org @graph: a Person entity plus every publication and article,
 * cross-linked by @id. This is what lets a search engine understand that the
 * papers, the site and the name all describe one person.
 */
export const buildJsonLd = (cfg) => {
    const personId = `${SITE_URL}/#person`;
    const person = {
        '@type': 'Person',
        '@id': personId,
        name: cfg.name,
        alternateName: cfg.handle,
        url: SITE_URL,
        image: `https://github.com/${cfg.handle}.png`,
        jobTitle: cfg.tagline,
        description: cfg.bioShort ? cfg.bioShort.replace(/\s+/g, ' ').trim() : undefined,
        knowsAbout: buildKnowsAbout(cfg),
        sameAs: [cfg.github, cfg.linkedin, cfg.profiles?.medium, cfg.profiles?.researchgate].filter(Boolean),
    };

    if (cfg.location) {
        const [locality, country] = cfg.location.split(',').map((s) => s.trim());
        person.address = { '@type': 'PostalAddress', addressLocality: locality, addressCountry: country };
    }
    const current = (cfg.experience || [])[0];
    if (current) person.worksFor = { '@type': 'Organization', name: current.org };
    const school = (cfg.education || [])[0];
    if (school) person.alumniOf = { '@type': 'CollegeOrUniversity', name: school.school };

    const publications = (cfg.publications || []).map((p) => ({
        '@type': 'ScholarlyArticle',
        headline: p.title,
        name: p.title,
        author: splitAuthors(p.authors),
        datePublished: p.date,
        url: p.link,
        isPartOf: p.publishedIn ? { '@type': 'Periodical', name: p.publishedIn } : undefined,
        publisher: p.publishedIn ? { '@type': 'Organization', name: p.publishedIn } : undefined,
        mainEntityOfPage: SITE_URL,
    }));

    const posts = (cfg.blogs || []).map((b) => ({
        '@type': 'BlogPosting',
        headline: b.title,
        name: b.title,
        abstract: b.summary,
        datePublished: b.date,
        url: b.link,
        author: { '@id': personId },
    }));

    const graph = [
        person,
        {
            '@type': 'ProfilePage',
            '@id': `${SITE_URL}/#webpage`,
            url: SITE_URL,
            name: `${cfg.name} — ${cfg.tagline}`,
            description: buildDescription(cfg),
            about: { '@id': personId },
            mainEntity: { '@id': personId },
            inLanguage: 'en',
        },
        ...publications,
        ...posts,
    ];

    return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
};

const esc = (s) =>
    String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const link = (href, text) =>
    href ? `<a href="${esc(href)}">${esc(text)}</a>` : esc(text);

/**
 * A static, semantic rendering of the portfolio, injected inside #root at
 * build time.
 *
 * React's createRoot() replaces the container's children on mount, so a
 * JavaScript visitor never sees this - they get the live app. A crawler or
 * link-preview bot that does NOT execute JavaScript sees the full content
 * instead of an empty div. The markup is generated from the same userConfig
 * the app renders, so the two cannot describe different facts.
 */
export const buildStaticContent = (cfg) => {
    const section = (title, body) =>
        body ? `<section><h2>${esc(title)}</h2>${body}</section>` : '';

    const bio = (cfg.bioLong || [])
        .map((p) => `<p>${esc(p.replace(/\s+/g, ' ').trim())}</p>`)
        .join('');

    const experience = (cfg.experience || [])
        .map(
            (e) =>
                `<article><h3>${esc(e.role)} — ${esc(e.org)}</h3>` +
                `<p><time>${esc(e.period)}</time>${e.location ? ` · ${esc(e.location)}` : ''}</p>` +
                `<ul>${(e.highlights || []).map((h) => `<li>${esc(h.replace(/\s+/g, ' ').trim())}</li>`).join('')}</ul></article>`
        )
        .join('');

    const education = (cfg.education || [])
        .map(
            (ed) =>
                `<article><h3>${esc(ed.degree)} — ${esc(ed.school)}</h3>` +
                `<p><time>${esc(ed.period)}</time>${ed.note ? ` · ${esc(ed.note)}` : ''}</p></article>`
        )
        .join('');

    const projects = (cfg.projects || [])
        .map(
            (p) =>
                `<article><h3>${link(p.link, p.name)}</h3><p>${esc(p.description)}</p>` +
                (p.tags?.length ? `<p>${p.tags.map(esc).join(', ')}</p>` : '') +
                `</article>`
        )
        .join('');

    const publications = (cfg.publications || [])
        .map(
            (p) =>
                `<article><h3>${link(p.link, p.title)}</h3>` +
                `<p>${esc(p.authors)} · ${esc(p.venue)}${p.publishedIn ? ` · ${esc(p.publishedIn)}` : ''} · <time>${esc(p.date)}</time></p></article>`
        )
        .join('');

    const blogs = (cfg.blogs || [])
        .map(
            (b) =>
                `<article><h3>${link(b.link, b.title)}</h3>` +
                (b.summary ? `<p>${esc(b.summary)}</p>` : '') +
                `<p><time>${esc(b.date)}</time></p></article>`
        )
        .join('');

    const skills = Object.entries(cfg.stack || {})
        .map(([group, items]) => `<li><strong>${esc(group)}:</strong> ${items.map(esc).join(', ')}</li>`)
        .join('');

    const orgs = (cfg.orgs || [])
        .map((o) => (typeof o === 'string' ? `<li>${esc(o)}</li>` : `<li>${link(o.url, o.name)}</li>`))
        .join('');

    const profiles = [
        [cfg.github, 'GitHub'],
        [cfg.linkedin, 'LinkedIn'],
        [cfg.profiles?.medium, 'Medium'],
        [cfg.profiles?.researchgate, 'ResearchGate'],
    ]
        .filter(([href]) => href)
        .map(([href, label]) => `<li>${link(href, label)}</li>`)
        .join('');

    return (
        `<header><h1>${esc(cfg.name)}</h1><p>${esc(cfg.tagline)}</p>` +
        `<p>${esc(cfg.location)}${cfg.availability ? ` · ${esc(cfg.availability)}` : ''}</p></header>` +
        section('About', bio) +
        section('Experience', experience) +
        section('Education', education) +
        section('Projects', projects) +
        section('Publications', publications) +
        section('Writing', blogs) +
        section('Skills', skills ? `<ul>${skills}</ul>` : '') +
        section('Organisations', orgs ? `<ul>${orgs}</ul>` : '') +
        section('Profiles', profiles ? `<ul>${profiles}</ul>` : '')
    );
};

export const buildRobotsTxt = () =>
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${abs('/sitemap.xml')}`, ''].join('\n');

export const buildSitemap = (isoDate) => {
    const urls = INDEXABLE_ROUTES.map(
        (route) =>
            `  <url>\n    <loc>${abs(route)}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`
    ).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};
