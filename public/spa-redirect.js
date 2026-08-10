// Single Page Apps for GitHub Pages
// https://github.com/rafgraph/spa-github-pages
// Copyright (c) 2016 Rafael Pedicini, licensed under the MIT License
// ----------------------------------------------------------------------
// Restores the real URL after the 404.html redirect trick: converts a
// `/?p=/route` query back into `/route` via history.replaceState so the
// router sees the intended path.
//
// Kept as an EXTERNAL file (not inline in index.html) so the page CSP can
// enforce `script-src 'self'` with no 'unsafe-inline'. An inline copy would
// be blocked by that CSP.
// ----------------------------------------------------------------------
(function (l) {
    if (l.search[1] === '/') {
        var decoded = l.search.slice(1).split('&').map(function (s) {
            return s.replace(/~and~/g, '&');
        }).filter(function (v) {
            return v.indexOf('p=/') === 0;
        })[0];
        if (decoded !== undefined) {
            window.history.replaceState(null, null,
                l.pathname.slice(0, -1) + decoded.slice(3) + l.hash
            );
        }
    }
}(window.location));
