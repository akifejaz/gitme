import React from 'react';

/**
 * GitMe brand mark.
 *
 * Fill is `currentColor`, so the surrounding text colour drives it and the
 * mark stays legible in both the light and dark themes. Callers set the
 * colour with a Tailwind text-* class (e.g. `text-github-text`).
 *
 * Source of truth for the artwork: public/gitme-logo.svg - keep the two in
 * sync if the mark changes.
 */
const GitMeLogo = ({ size = 24, className = '' }) => {
    return (
        <svg
            height={size}
            width={size}
            viewBox="0 0 115 120"
            className={className}
            fill="currentColor"
            role="img"
            aria-label="GitMe"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M7,2 L8,93 L44,116 L45,77 L54,65 L65,62 L66,54 L81,66 L66,78 L65,70 L55,75 L52,116 L82,99 L106,91 L106,14 L92,17 L91,2 L48,31 Z M49,31 L60,48 L59,49 L53,49 L53,62 L46,69 L45,68 L45,50 L44,49 L39,49 L38,48 L44,39 L45,36 Z M98,21 L99,85 L79,92 L62,103 L61,101 L72,90 L91,79 L91,23 Z"
            />
        </svg>
    );
};

export default GitMeLogo;
