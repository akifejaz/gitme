/**
 * User Configuration - Portfolio Data
 *
 * Single source of truth for the front page (HomePage). Edit these arrays
 * to update what's rendered on `/`. The GitHub contribution data on
 * `/profile` is still fetched live via the GitHub GraphQL API.
 */

const userConfig = {
    // --- Identity ---
    name: "Akif Ejaz",
    handle: "akifejaz",
    tagline: "Sr. Systems/Firmware Engineer - RISC-V Systems",
    location: "Lahore, PK",
    availability: "open to collaborations",

    // --- Contact ---
    email: "akifejaz40@gmail.com",
    // website: "https://akifejaz.dev",
    linkedin: "https://linkedin.com/in/akifejaz",
    github: "https://github.com/akifejaz",
    // twitter: "https://twitter.com/akifejaz",
    meetingLink: "https://calendar.app.google/sy4dWwRgVtXLHfBV6",
    cvUsername: "akifejaz",

    // --- Bio (short + long) ---
    bioShort:
        "Kernel & RISC-V systems engineer. Eclipse ThreadX committer, seL4 maintainer, and builder of the \
        agentic AI that ports what's left of the stack.",
    bioLong: [
        "I work right in the sweet spot where hardware meets software. \
         I write low-level firmware, device drivers, and kernel code for RISC-V systems. \
         My work spans from bare-metal to RTOSes, microkernels, Linux kernel to OSes, and I enjoy the \
         challenge of making new hardware production-ready.",

        "Lately, I've been building agentic AI systems, named \'ATESOR\' which automates the the RISC-V software porting."
    ],

    // --- Experience ---
    // Each entry supports either `logo` (explicit URL/path like "/logos/foo.svg")
    // or `logoDomain` (e.g. "eclipse.org" - auto-fetched favicon). Omit both
    // to fall back to an initials monogram.
    experience: [
        {
            role: "Sr. Engineer",
            org: "10xEngineers",
            logoDomain: "10xengineers.ai",
            period: "Mar 2025 - Present",
            location: "Lahore, PK",
            highlights: [
                "Leading strategic collaboration with the Eclipse Foundation to architect and scale RISC-V support for the Eclipse ThreadX RTOS, by driving architectural clean-ups, feature work, and long-term maintainability for both RV64 and RV32 ports.",
                "Wrote RV32/gnu port for Eclipse ThreadX along with its QEMU-virt BSP. Later wrote BSP of BananaPi BPI-F3 (SpacemiT K1) board for ThreadX.",
                "Enabled seL4 microkernel support for SpacemiT's BananaPi BPI-F3 by implementing low-level kernel init, peripheral drivers (UART, Timer, …), and validated with the full seL4 test suite  100% pass rate.",
                "Leading maintenance and horizontal scaling of Cloud-V (RISC-V CI Services Platform)  97.6% uptime, 120+ global users across diverse CI pipelines.",
                "Benchmarked RISC-V SBCs from SiFive, SpacemiT, and StarFive with SPEC, CoreMark, and Phoronix  published 10+ comparison reports on Cloud-V to give the community data-driven board-selection insights."
            ]
        },
        {
            role: "Software Engineer II",
            org: "Xcelerium Inc.",
            // DDG returns a placeholder for xcelerium.com - pin the real SVG mark instead.
            logo: "https://xcelerium.com/wp-content/uploads/2025/09/x-favicon.svg",
            logoDomain: "xcelerium.com",
            period: "Mar 2023 - Feb 2025",
            location: "California, USA",
            highlights: [
                "Built the custom BSP for Xcelerium's RISC-V64 core in Zephyr RTOS and also enabled proprietary RISC-V instructions including the Vector Extension in it.",
                "Led the “Linux Boot” project successfully booted Linux Kernel v6.10 on Xcelerium's SW simulator (Hydra VP) and Scalar Core (Hydra Tile SU).",
                "Built a Sequence Pytest framework for verifying a RISC-V Vector processor with RVV 1.0 + Xcelerium's proprietary instructions.",
                "Contributed RVV cryptography instructions to the SW RISC-V simulator to support RVV Crypto Extension v1.0.0.",
                "Engineered a high-perf AWS verification suite integrated with FPGA + DUT memory maps; refactored data transfer from 8-bit to 64-bit widths resulting 700% load/store throughput increase."
            ]
        },

        // --- Open Source Maintainerships (concurrent with paid roles) ---
        {
            role: "Committer",
            org: "Eclipse ThreadX (Eclipse Foundation)",
            logoDomain: "eclipse.org",
            period: "Feb 2026 - Present",
            location: "Open Source",
            highlights: [
                "I'm Official committer at Eclipse ThreadX under Eclipse Foundation, responsible for maintaining, reviewing and merging \
                changes across RV64 and RV32 ports codebase.",
                "See status Here : https://projects.eclipse.org/projects/iot.threadx/CM/akifejaz"
            ]
        },
        {
            role: "Maintainer (BananaPi BPI-F3 support)",
            org: "seL4 Microkernel",
            logoDomain: "sel4.systems",
            period: "Dec 2025 - Present",
            location: "Open Source",
            highlights: [
                "Added BananaPi BPI-F3 (SpacemiT K1) board support to the seL4 microkernel.",
                "Now the official maintainer for BPI-F3 in the seL4 platform tree.",
                "Implemented kernel init, peripheral drivers (UART, Timer, …); validated with 100% seL4-test pass rate.",
                "See maintainer status: https://docs.sel4.systems/Hardware/bananapi-f3.html"
            ]
        },
        {
            role: "Contributor",
            org: "Linux Kernel",
            logoDomain: "kernel.org",
            period: "2025 - Present",
            location: "Upstream",
            highlights: [
                "Upstream patch merged in v6.20 SPI subsystem: `spi: cadence-qspi` (drivers/spi/spi-cadence-quadspi.c) and stable-backported into the 6.19.4 series.",
                "Working in the RISC-V corner of mainline alongside the 10xEngineers kernel team, StarFive pinctrl, Cadence QSPI, and board bring-up for RISC-V SBCs targeting v6.19 / v6.20.",
                "Prior: booted Linux Kernel v6.10 on Xcelerium's RISC-V SW simulator (Hydra VP) and Scalar Core (Hydra Tile SU) during my time at Xcelerium."
            ]
        }
    ],

    // --- Education ---
    education: [
        {
            school: "Information Technology University (ITU)",
            degree: "B.S. Computer Engineering (BSCE)",
            logoDomain: "itu.edu.pk",
            period: "2019 - 2023",
            location: "Lahore, PK",
            note: "CGPA 3.76 / 4.00, focus on OS/systems, embedded, and computer architecture."
        }
    ],

    // --- Certifications ---
    // Mirrored from Credly (https://www.credly.com/users/<username>). 
    certifications: [
        {
            name: "LFD114: Porting Software to RISC-V",
            issuer: "The Linux Foundation",
            issuerDomain: "linuxfoundation.org",
            date: "Apr 2026",
            credentialUrl: "https://www.credly.com/badges/c064482c-6efa-4dd0-b30e-4c2b555dfac5",
            image: "https://images.credly.com/images/da1051ef-c157-4e2b-8c94-00db3b5d696b/blob",
            skills: ["RISC-V Assembly Language", "RISC-V system integration", "RISC-V vector intrinsics"]
        },
        {
            name: "LFD123: Open Source RT-Thread RTOS on RISC-V",
            issuer: "The Linux Foundation",
            issuerDomain: "linuxfoundation.org",
            date: "Jul 2025",
            credentialUrl: "https://www.credly.com/badges/2d13b7d0-bdcc-44db-83c7-bca4c2cea201",
            image: "https://images.credly.com/images/84f4cb1a-5384-4f00-aadd-9154bae68826/blob",
            skills: ["RISC-V Architecture", "Embedded Systems Development", "Multi-Thread Programming", "RT-Thread for RISC-V"]
        },
        {
            name: "LFD103: A Beginner's Guide to Linux Kernel Development",
            issuer: "The Linux Foundation",
            issuerDomain: "linuxfoundation.org",
            date: "Jul 2025",
            credentialUrl: "https://www.credly.com/badges/2bf7a652-f8d9-491e-a223-e1b96b4d7b92",
            image: "https://images.credly.com/images/c6d2f560-62c8-4b89-a825-aa982fdafed7/blob",
            skills: ["Linux Kernel", "Git", "Commit Logs", "Contributor Covenant Code of Conduct"]
        },
        {
            name: "LFD110: Introduction to RISC-V",
            issuer: "The Linux Foundation",
            issuerDomain: "linuxfoundation.org",
            date: "Dec 2024",
            credentialUrl: "https://www.credly.com/badges/c0493ad4-6800-4c6f-89c5-9b8586b51d41",
            image: "https://images.credly.com/images/fe724d20-7a05-417e-b10a-29e458a3fc04/blob",
            skills: ["Instruction Set Architecture", "Assembly Language", "RISC-V", "Community"]
        }
    ],

    // Public Credly profile, linked from the certifications section.
    credlyProfile: "https://www.credly.com/users/akifejaz",

    // --- Projects / Works ---
    // Card link fields - all optional except `link`:
    //   link         → project home (renders on the title)
    //   srcUrl       → source repo         → footer: "source ↗"
    //   downloadUrl  → release / download   → footer: "download ↗"
    //   prsUrl       → author-filtered PRs  → footer: "my PRs ↗"
    // Each of the footer entries also takes an optional label override
    // (`srcLabel`, `downloadLabel`, `prsLabel`) - e.g. `prsLabel: "7 PRs"`.
    projects: [
        {
            name: "ATESOR",
            year: "Mar 2026",
            tags: ["Agentic AI", "RISC-V", "LangGraph", "RISC-V Porting", "RISC-V Software"],
            description:
                "Open-source multi-stage framework that ports software to RISC-V automatically. It uses LangGraph agents, Docker containers, and native RISC-V test environments.",
            link: "https://github.com/akifejaz/atesor",
            prsUrl: "https://github.com/akifejaz/atesor/pulls?q=is%3Apr+author%3Aakifejaz"
        },
        {
            name: "Eclipse ThreadX (RISC-V)",
            year: "Feb 2026",
            tags: ["RTOS", "RISC-V", "Maintainer", "Device Drivers", "BSP"],
            description:
                "Official Eclipse ThreadX committer, improving RISC-V support to make ThreadX a RISC-V-first RTOS.",
            link: "https://github.com/eclipse-threadx",
            prsUrl: "https://github.com/eclipse-threadx/threadx/pulls?q=is%3Apr+author%3Aakifejaz"
        },
        {
            name: "seL4 Microkernel· (BananaPi BPI-F3 BSP)",
            year: "Dec 2025",
            tags: ["Microkernel", "RISC-V", "Maintainer", "Device Drivers", "BSP"],
            description:
                "Added and now officially maintain BananaPi BPI-F3 board support in the seL4 microkernel: kernel init, peripheral drivers, and a 100% seL4-test pass rate.",
            link: "https://github.com/seL4/seL4",
            prsUrl: "https://github.com/seL4/seL4/pulls?q=is%3Apr+author%3Aakifejaz"
        },
        {
            name: "Cloud-V",
            year: "2024 - Present",
            tags: ["Infrastructure", "RISC-V", "CI"],
            description:
                "RISC-V CI Services Platform with 97.6% uptime, 120+ global users, and virtualized emulated hardware for CI and developer environments.",
            link: "https://cloud-v.co",
            prsUrl: "https://github.com/10x-Engineers/Cloud-V/pulls?q=is%3Apr+author%3Aakifejaz"
        },
        {
            name: "RISC-V SBC Benchmarks",
            year: "2025",
            tags: ["Benchmarking", "SPEC", "Phoronix"],
            description:
                "10+ published comparison reports benchmarking SiFive, SpacemiT, and StarFive boards with SPEC, CoreMark, and Phoronix Test Suite.",
            link: "https://cloud-v.co/risc-v-comparison",
            srcUrl: "https://github.com/akifejaz/riscv-benchmarks"
        },
        {
            name: "UpCraft AI",
            year: "2025",
            tags: ["Chrome MV3", "Upwork", "Extension", "Freelance"],
            description:
                "Chrome MV3 extension that upgrades Upwork job search with a draggable in-page panel: smart filters (post age, min spend, proposal count) and inline job enrichment (hire rate, client history, reviews, last-viewed). Runs 100% client-side, no external servers.",
            link: "https://akifejaz.github.io/docs-upcraft/",
            downloadUrl: "https://github.com/akifejaz/docs-upcraft/releases/latest"
        }
    ],

    // --- Publications (papers, thesis, conference work) ---
    // Unified schema for every publication:
    //   title           → the paper's title
    //   venue           → the TYPE ("Conference Paper", "Journal Article",
    //                     "Thesis", "Article", …)
    //   publishedIn     → the specific place ("RISC-V Summit EU '2026",
    //                     "Spectrum of Emerging Sciences", "ITU", …)
    //   publishedInUrl  → optional link on the publisher name
    //   date, authors, link → the paper itself on ResearchGate / etc.
    publications: [
        {
            title:
                "Beyond the Basics: Elevating Eclipse ThreadX to a First-Class RTOS for RISC-V",
            venue: "Conference Paper",
            publishedIn: "RISC-V Summit EU '2026",
            publishedInUrl: "https://riscv-europe.org/summit/2026/",
            date: "Apr 2026",
            authors: "Akif Ejaz",
            link: "https://www.researchgate.net/publication/408474392_Beyond_the_Basics_Elevating_Eclipse_ThreadX_to_a_First-Class_RTOS_for_RISC-V"
        },
        {
            title:
                "ATESOR: A Multi-Stage LLM-based Framework for Autonomous RISC-V Software Porting",
            venue: "Conference Paper",
            publishedIn: "RISC-V Summit EU '2026",
            publishedInUrl: "https://riscv-europe.org/summit/2026/",
            date: "Mar 2026",
            authors: "Akif Ejaz, Bilal Zafar",
            link: "https://www.researchgate.net/publication/408460757_ATESOR_A_Multi-Stage_LLM-based_Framework_for_Autonomous_RISC-V_Software_Porting"
        },
        {
            title:
                "An Efficient ML & DL Based Deep Packet Security Framework for Detection of Computing Network Faults in the IoTs",
            venue: "Journal Article",
            publishedIn: "Spectrum of Emerging Sciences",
            date: "May 2025",
            authors: "Nasir Ayub, Akif Ejaz, Bilal Hassan",
            link: "https://www.researchgate.net/publication/392136748_AN_EFFICIENT_MACHINE_LEARNING_AND_DEEP_LEARNING_BASED_DEEP_PACKET_SECURITY_FRAMEWORK_FOR_DETECTION_OF_COMPUTING_NETWORK_FAULTS_IN_THE_IOTS"
        },
        {
            title: "AI Accelerator Design for RISC-V",
            venue: "Undergraduate Thesis",
            publishedIn: "Information Technology University (ITU)",
            publishedInUrl: "https://itu.edu.pk",
            date: "Apr 2023",
            authors: "Akif Ejaz, Rehan Hafiz, Rehan Ahmad",
            link: "https://www.researchgate.net/publication/408460440_AI_Accelerator_Design_for_RISC-V"
        },
        {
            title: "IoT Security in Supply Chain",
            venue: "Article",
            publishedIn: "ResearchGate",
            publishedInUrl: "https://www.researchgate.net/publication/397138073_IoT_Security_in_Supply_Chain",
            date: "Nov 2022",
            authors: "Akif Ejaz, Naqqash Aman",
            link: "https://www.researchgate.net/publication/397138073_IoT_Security_in_Supply_Chain"
        }
    ],

    // --- Writings / Blogs ---
    // Source: https://medium.com/@akifejaz
    blogs: [
        {
            title:
                "Porting seL4 to the Banana Pi BPI-F3",
            date: "July 29, 2026",
            summary:
                "Bringing the formally verified microkernel to SpacemiT’s K1 RISC-V SoC, in four pull requests and one SoC manual that disagrees with itself.",
            link: "https://medium.com/@akifejaz/porting-sel4-to-the-banana-pi-bpi-f3-1780e677b796"
        },
        {
            title:
                "Beginner's Guide to Linux Distros: Why They Multiply, and How to Know Which You're Using",
            date: "Aug 26, 2025",
            summary:
                "Linux has more flavors than your local ice cream shop. This is a friendly tour of the distro family tree.",
            link: "https://medium.com/@akifejaz/beginners-guide-to-linux-distros-why-they-multiply-and-how-to-know-which-you-re-using-abc435ea0fce"
        },
        {
            title:
                "3 Ways to Run GPT-OSS-20B Locally (Full Commands & Setup Guide)",
            date: "Aug 7, 2025",
            summary:
                "Run OpenAI's open-source 21B-parameter reasoning model completely offline, on your own hardware.",
            link: "https://medium.com/@akifejaz/3-ways-to-run-gpt-oss-20b-locally-full-commands-setup-guide-c95d34339281"
        },
        {
            title:
                "How Simple Geometry Builds the Foundation of Machine Learning - 6 Key Insights",
            date: "Aug 2, 2025",
            summary:
                "From red-and-blue dots on graph paper to the intuition behind modern ML models.",
            link: "https://medium.com/@akifejaz/how-simple-geometry-builds-the-foundation-of-machine-learning-6-key-insights-99dcb585d335"
        },
        {
            title:
                "Mastering ChatGPT: 10 Proven Tips to Enhance Your Performance and Productivity",
            date: "Aug 16, 2023",
            summary:
                "Actionable tips to get more out of conversational AI.",
            link: "https://medium.com/@akifejaz/mastering-chatgpt-10-proven-tips-to-enhance-your-performance-and-productivity-614716fde317"
        }
    ],

    // Author profiles (surfaced in Contact / footer if you want)
    profiles: {
        medium: "https://medium.com/@akifejaz",
        researchgate: "https://www.researchgate.net/profile/Akif-Ejaz-3"
    },

    // --- Skills (grouped per CV Technical Skills section) ---
    stack: {
        languages: [
            "C", "C++", "Python", "Bash / Shell",
            "System Verilog", "Verilog", "RISC-V Assembly",
            "Linker Scripts", "Makefiles"
        ],
        "kernel & os": [
            "Linux Kernel", "seL4 Microkernel", "KVM",
            "Zephyr", "ThreadX", "FreeRTOS",
            "TinyML", "TensorFlow"
        ],
        frameworks: [
            "Pytest", "UVM", "Cocotb", "Selenium"
        ],
        tooling: [
            "Git", "CI/CD", "Vivado", "Verdi",
            "Spike", "Google Colab", "VS Code", "MATLAB"
        ],
        libraries: [
            "Pandas", "NumPy", "Matplotlib"
        ],
        "benchmarking": [
            "SPEC", "CoreMark", "Phoronix Test Suite"
        ]
    },

    // --- Orgs / Collaborations ---
    // Each entry supports `logo` (explicit URL/path) or `logoDomain`
    // (favicon fallback). `url` is the official landing page.
    // Ordered roughly by merged-PR count / significance.
    orgs: [
        // Foundations & standards bodies
        {
            name: "Cloud-V",
            url: "https://cloud-v.co",
            // DDG returns a placeholder for cloud-v.co - pin the real logo instead.
            logo: "https://cloud-v.co/cloudv_website/static/src/img/logo.png",
            logoDomain: "cloud-v.co"
        },
        {
            name: "Eclipse ThreadX",
            url: "https://github.com/eclipse-threadx",
            logoDomain: "eclipse.org"
        },
        {
            name: "Eclipse Foundation",
            url: "https://www.eclipse.org",
            logoDomain: "eclipse.org"
        },
        {
            name: "RISC-V International",
            url: "https://riscv.org",
            logoDomain: "riscv.org"
        },
        {
            name: "RISC-V Ecosystem Labs",
            url: "https://riscv.org/developers/labs/",
            logoDomain: "riscv.org"
        },
        {
            name: "Linux Foundation",
            url: "https://www.linuxfoundation.org",
            logoDomain: "linuxfoundation.org"
        },
        {
            name: "CHIPS Alliance",
            url: "https://www.chipsalliance.org",
            logoDomain: "chipsalliance.org"
        },
        // Projects & OSS repos
        {
            name: "seL4 Microkernel",
            url: "https://sel4.systems",
            logoDomain: "sel4.systems"
        },
        {
            name: "Spike (riscv-isa-sim)",
            url: "https://github.com/riscv-software-src/riscv-isa-sim",
            logoDomain: "riscv.org"
        },
        {
            name: "llama.cpp",
            url: "https://github.com/ggml-org/llama.cpp",
            logoDomain: "ggml.ai"
        },
        {
            name: "OBS Project",
            url: "https://obsproject.com",
            logoDomain: "obsproject.com"
        },
        {
            name: "SoarPackages",
            url: "https://github.com/pkgforge/soarpkgs",
            logoDomain: "pkgforge.com"
        },
        {
            name: "Flutter Pi",
            url: "https://github.com/ardera/flutter-pi",
            logoDomain: "github.com"
        }
    ]
};

export default userConfig;
