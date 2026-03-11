import React from 'react';
import GithubLogo from './GithubLogo';
import { Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-github-border bg-github-bg-secondary py-6 mt-auto">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <GithubLogo size={18} className="text-github-text-secondary opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
                        <p className="text-[12px] text-github-text-secondary/70">
                            &copy; {currentYear} <span className="text-github-text-secondary font-semibold">GitMe</span>. Engineered for impact.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-[11px] font-medium text-github-text-secondary/60">
                            <a
                                href="https://github.com/akifejaz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-github-text-link transition-colors"
                            >
                                GitHub
                            </a>
                            <a
                                href="https://linkedin.com/in/akifejaz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-github-text-link transition-colors"
                            >
                                LinkedIn
                            </a>
                            <a
                                href="mailto:akifejaz@gmail.com"
                                className="hover:text-github-text-link transition-colors"
                            >
                                Contact
                            </a>
                        </div>

                        <a
                            href="https://github.com/akifejaz/gitme"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-github-bg border border-github-border rounded-full text-[10px] text-github-text-secondary hover:border-github-text-secondary/50 hover:bg-github-border/10 transition-all cursor-pointer select-none"
                        >
                            <span>Made with</span>
                            <Heart size={10} className="text-github-status-closed fill-github-status-closed" />
                            <span>by</span>
                            <span className="text-github-text font-bold">Akif Ejaz</span>
                        </a>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-center md:justify-start gap-3 opacity-20 hover:opacity-40 transition-opacity select-none cursor-default">
                    <span className="text-[8px] text-github-text-secondary uppercase tracking-[0.25em]">Vite 7</span>
                    <span className="w-0.5 h-0.5 bg-github-text-secondary rounded-full" />
                    <span className="text-[8px] text-github-text-secondary uppercase tracking-[0.25em]">React 18</span>
                    <span className="w-0.5 h-0.5 bg-github-text-secondary rounded-full" />
                    <span className="text-[8px] text-github-text-secondary uppercase tracking-[0.25em]">OpenRouter AI</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
