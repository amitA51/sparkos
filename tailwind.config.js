import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./screens/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            screens: {
                'xs': '480px',
            },
            colors: {
                /** 
                 * @group Multi-Universe Variables
                 * @desc CSS variables for the core layout engine.
                 * These follow the 'Multi-Universe' theming system allowing hot-swapping schemas.
                 */
                background: 'var(--bg-app)',       // New Engine
                glass: 'var(--surface-glass)',     // New Engine
                border: 'var(--glass-border)',     // New Engine
                // ---------------------------------------

                // Map to design tokens for consistency (Legacy Support)
                primary: 'var(--text-primary)',
                secondary: 'var(--text-secondary)',
                muted: 'var(--text-muted)',
                accent: 'var(--dynamic-accent-start)',
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'bg-card': 'var(--bg-card)',

                /**
                 * @group Deep Cosmos Palette
                 * @desc Dark mode optimization using void-like colors.
                 */
                'cosmos-black': 'var(--color-cosmos-black)',
                'cosmos-void': 'var(--color-cosmos-void)',
                'cosmos-depth': 'var(--color-cosmos-depth)',
                'cosmos-surface': 'var(--color-cosmos-surface)',

                /**
                 * @group Semantic Accents
                 * @desc Dynamic accents that change based on user universe selection.
                 */
                'accent-cyan': 'var(--color-accent-cyan)',
                'accent-violet': 'var(--color-accent-violet)',
                'accent-magenta': 'var(--color-accent-magenta)',
                'accent-gold': 'var(--color-accent-gold)',

                /**
                 * @group Golden Standard Surfaces
                 * @desc Glassmorphism and tactile surface layers.
                 */
                'surface-glass': 'var(--color-surface-glass)',
                'surface-hover': 'var(--color-surface-hover)',
                'surface-pressed': 'var(--color-surface-pressed)',
                'border-subtle': 'var(--color-border-subtle)',
                'border-strong': 'var(--color-border-strong)',
            },
            fontFamily: {
                sans: ['Satoshi', 'var(--font-body)', 'sans-serif'],
                heading: ['Clash Display', 'var(--font-heading)', 'sans-serif'],
                body: ['Satoshi', 'var(--font-body)', 'sans-serif'],
                mono: ['JetBrains Mono', 'var(--font-mono)', 'monospace'],
            },
            fontSize: {
                'xs': 'var(--font-size-xs)',
                'sm': 'var(--font-size-sm)',
                'base': 'var(--font-size-base)',
                'md': 'var(--font-size-md)',
                'lg': 'var(--font-size-lg)',
                'xl': 'var(--font-size-xl)',
                '2xl': 'var(--font-size-2xl)',
                '3xl': 'var(--font-size-3xl)',
                '4xl': 'var(--font-size-4xl)',
                '5xl': 'var(--font-size-5xl)',
                '6xl': 'var(--font-size-6xl)',
            },
            spacing: {
                '1': 'var(--space-1)',
                '2': 'var(--space-2)',
                '3': 'var(--space-3)',
                '4': 'var(--space-4)',
                '5': 'var(--space-5)',
                '6': 'var(--space-6)',
                '7': 'var(--space-7)',
                '8': 'var(--space-8)',
                '9': 'var(--space-9)',
                '10': 'var(--space-10)',
                '12': 'var(--space-12)',
                '14': 'var(--space-14)',
                '16': 'var(--space-16)',
                '20': 'var(--space-20)',
                '24': 'var(--space-24)',
                '32': 'var(--space-32)',

                // Golden Standard - Semantic Spacing
                'gap-tight': 'var(--gap-tight)',
                'gap-base': 'var(--gap-base)',
                'gap-comfortable': 'var(--gap-comfortable)',
                'gap-section': 'var(--gap-section)',
                'gap-screen': 'var(--gap-screen)',
                'padding-card': 'var(--padding-card)',
            },
            borderRadius: {
                // --- MULTI-UNIVERSE ENGINE VARIABLES ---
                primary: 'var(--radius-primary)',  // New Engine
                // ---------------------------------------

                'sm': 'var(--radius-sm)',
                'md': 'var(--radius-md)',
                'lg': 'var(--radius-lg)',
                'xl': 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                '3xl': 'var(--radius-3xl)',
                'full': 'var(--radius-full)',

                // Golden Standard - Semantic Radius
                'radius-button': 'var(--radius-button)',
                'radius-card': 'var(--radius-card)',
                'radius-modal': 'var(--radius-modal)',
                'radius-pill': 'var(--radius-pill)',
            },
            // Golden Standard - Touch Targets
            minHeight: {
                'touch-min': 'var(--touch-target-min)',
                'touch-comfortable': 'var(--touch-target-comfortable)',
            },
            height: {
                'touch-min': 'var(--touch-target-min)',
                'touch-comfortable': 'var(--touch-target-comfortable)',
            },
            minWidth: {
                'touch-min': 'var(--touch-target-min)',
                'touch-comfortable': 'var(--touch-target-comfortable)',
            },
            width: {
                'touch-min': 'var(--touch-target-min)',
                'touch-comfortable': 'var(--touch-target-comfortable)',
            },
            /**
             * @group Effects
             * @desc Shadow and glow tokens for depth.
             */
            boxShadow: {
                'xs': 'var(--shadow-xs)',
                'sm': 'var(--shadow-sm)',
                'md': 'var(--shadow-md)',
                'lg': 'var(--shadow-lg)',
                'xl': 'var(--shadow-xl)',
                '2xl': 'var(--shadow-2xl)',
                '3xl': 'var(--shadow-3xl)',
                'glow-cyan': 'var(--shadow-glow-cyan)',
                'glow-cyan-strong': 'var(--shadow-glow-cyan-strong)',
                'glow-violet': 'var(--shadow-glow-violet)',
                'inner': 'var(--shadow-inner)',
                'inner-strong': 'var(--shadow-inner-strong)',
            },
            backdropBlur: {
                // --- MULTI-UNIVERSE ENGINE VARIABLES ---
                theme: 'var(--glass-blur)',        // New Engine
                // ---------------------------------------

                'sm': 'var(--blur-sm)',
                'md': 'var(--blur-md)',
                'lg': 'var(--blur-lg)',
                'xl': 'var(--blur-xl)',
                '2xl': 'var(--blur-2xl)',
                '3xl': 'var(--blur-3xl)',
            },
            transitionTimingFunction: {
                'spring': 'var(--ease-spring-soft)',
                'spring-stiff': 'var(--ease-spring-stiff)',
                'spring-soft': 'var(--ease-spring-soft)',
                'spring-gentle': 'var(--ease-spring-gentle)',
                'out-expo': 'var(--ease-out-expo)',
            },
            transitionDuration: {
                'instant': 'var(--duration-instant)',
                'fast': 'var(--duration-fast)',
                'base': 'var(--duration-base)',
                'slow': 'var(--duration-slow)',
                'slower': 'var(--duration-slower)',
                'slowest': 'var(--duration-slowest)',
            },
            keyframes: {
                // Spring-based float animation
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                        animationTimingFunction: 'var(--ease-spring-soft)'
                    },
                    '50%': {
                        transform: 'translateY(-6px)',
                        animationTimingFunction: 'var(--ease-spring-soft)'
                    },
                },
                // Premium fade in with blur
                fadeIn: {
                    '0%': { opacity: '0', filter: 'blur(10px)' },
                    '100%': { opacity: '1', filter: 'blur(0)' },
                },
                // Spring slide up
                slideUp: {
                    '0%': {
                        transform: 'translateY(20px) scale(0.95)',
                        opacity: '0',
                        filter: 'blur(5px)'
                    },
                    '100%': {
                        transform: 'translateY(0) scale(1)',
                        opacity: '1',
                        filter: 'blur(0)'
                    },
                },
                // Glow pulse
                glowPulse: {
                    '0%, 100%': {
                        boxShadow: 'var(--shadow-glow-cyan)',
                        opacity: '1'
                    },
                    '50%': {
                        boxShadow: 'var(--shadow-glow-cyan-strong)',
                        opacity: '0.9'
                    },
                },
                // Gradient flow for buttons
                gradientFlow: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                // Shimmer effect
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                'float': 'float 5s ease-in-out infinite',
                'fade-in': 'fadeIn var(--duration-slow) var(--ease-spring-soft) forwards',
                'slide-up': 'slideUp var(--duration-base) var(--ease-spring-soft) forwards',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'gradient-flow': 'gradientFlow 3s ease infinite',
                'shimmer': 'shimmer 2s infinite linear',
            },
            animationDelay: {
                '100': '100ms',
                '200': '200ms',
                '300': '300ms',
                '400': '400ms',
                '500': '500ms',
                '700': '700ms',
                '1000': '1000ms',
            }
        },
    },
    plugins: [
        animate,
        function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'animation-delay': (value) => ({
                        'animation-delay': value,
                    }),
                },
                { values: theme('animationDelay') }
            )
        },
    ],
}
