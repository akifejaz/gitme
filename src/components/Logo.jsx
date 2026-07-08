import React, { useState } from 'react';

/**
 * Small square logo for experience / education entries.
 *
 * Fallback chain:
 *   1. `logo`        — explicit URL or public path (e.g. "/logos/eclipse.svg")
 *   2. `logoDomain`  — auto-fetch via Google's favicon service
 *   3. initials monogram from `name`
 *
 * Size is fixed to `size` px (square, rounded).
 */
const Logo = ({ logo, logoDomain, name = '', size = 40, className = '' }) => {
    const [errored, setErrored] = useState(false);

    const src =
        !errored && logo
            ? logo
            : !errored && logoDomain
                ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
                    logoDomain
                )}&sz=128`
                : null;

    const initials = name
        .split(/[\s\-—·/]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join('') || '·';

    if (!src) {
        return (
            <div
                aria-hidden="true"
                className={`shrink-0 rounded-md border border-github-border bg-github-bg-secondary flex items-center justify-center font-mono text-[11px] text-github-text-secondary ${className}`}
                style={{ width: size, height: size }}
                title={name}
            >
                {initials}
            </div>
        );
    }

    return (
        <div
            className={`shrink-0 rounded-md border border-github-border bg-github-bg-secondary overflow-hidden flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
            title={name}
        >
            <img
                src={src}
                alt={`${name} logo`}
                loading="lazy"
                onError={() => setErrored(true)}
                className="w-[70%] h-[70%] object-contain"
            />
        </div>
    );
};

export default Logo;
