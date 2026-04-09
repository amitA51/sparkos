/**
 * ============================================================================
 * SPARKOS - TAILWIND CONFIG
 * Clean, minimal Tailwind configuration mapped to CSS variables
 * ============================================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      /* =================================================================
         COLORS - Maps to CSS Variables
         ================================================================= */
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        
        /* Primary */
        primary: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        
        /* Semantic */
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
        
        /* Grays */
        gray: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },
        
        /* Background */
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          card: 'var(--bg-card)',
        },
        
        /* Text */
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        
        /* Border */
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
        },
        
        /* Surface */
        surface: {
          hover: 'var(--surface-hover)',
          pressed: 'var(--surface-pressed)',
          glass: 'var(--surface-glass)',
        },

        /* =================================================================
           SPARK ACCENT SYSTEM
           ================================================================= */
        spark: {
          accent: {
            DEFAULT: 'var(--spark-accent)',
            hover: 'var(--spark-accent-hover)',
          },
          'accent-secondary': {
            DEFAULT: 'var(--spark-accent-secondary)',
            hover: 'var(--spark-accent-secondary-hover)',
          },
          gold: 'var(--spark-gold)',
          cyan: 'var(--spark-cyan)',
          violet: 'var(--spark-violet)',
          magenta: 'var(--spark-magenta)',
          rose: 'var(--spark-rose)',
        },

        /* =================================================================
           FITNESS DATA COLORS
           ================================================================= */
        fitness: {
          hot: 'var(--spark-fitness-hot)',
          warm: 'var(--spark-fitness-warm)',
          good: 'var(--spark-fitness-good)',
          cool: 'var(--spark-fitness-cool)',
          moderate: 'var(--spark-fitness-moderate)',
          inactive: 'var(--spark-inactive)',
          pr: 'var(--spark-fitness-pr)',
          streak: 'var(--spark-fitness-streak)',
        },

        /* =================================================================
           ACHIEVEMENT / GAMIFICATION
           ================================================================= */
        achievement: {
          gold: 'var(--spark-gold)',
          cyan: 'var(--spark-cyan)',
          violet: 'var(--spark-violet)',
          magenta: 'var(--spark-magenta)',
          rose: 'var(--spark-rose)',
        },
      },

      /* =================================================================
         FONT FAMILY
         ================================================================= */
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },

      /* =================================================================
         FONT SIZE
         ================================================================= */
      fontSize: {
        micro: ['0.6875rem', { lineHeight: 'var(--leading-normal)' }], // 11px
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--leading-tight)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
      },

      /* =================================================================
         FONT WEIGHT
         ================================================================= */
      fontWeight: {
        normal: 'var(--weight-normal)',
        medium: 'var(--weight-medium)',
        semibold: 'var(--weight-semibold)',
        bold: 'var(--weight-bold)',
      },

      /* =================================================================
         LINE HEIGHT
         ================================================================= */
      lineHeight: {
        none: 'var(--leading-none)',
        tight: 'var(--leading-tight)',
        normal: 'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)',
      },

      /* =================================================================
         LETTER SPACING
         ================================================================= */
      letterSpacing: {
        tight: 'var(--tracking-tight)',
        normal: 'var(--tracking-normal)',
        wide: 'var(--tracking-wide)',
      },

      /* =================================================================
         SPACING
         ================================================================= */
      spacing: {
        '0': 'var(--space-0)',
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
        'micro': 'var(--space-1)',  // 4px - micro spacing
        'tiny': 'var(--space-2)',    // 8px - tiny spacing
      },

      /* =================================================================
         BORDER RADIUS
         ================================================================= */
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },

      /* =================================================================
         BOX SHADOW
         ================================================================= */
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        /* Glow effects */
        'glow-accent': 'var(--glow-accent)',
        'glow-accent-strong': 'var(--glow-accent-strong)',
        'glow-secondary': 'var(--glow-secondary)',
        'glow-gold': 'var(--glow-gold)',
        'glow-success': 'var(--glow-success)',
        'glow-cyan': 'var(--glow-cyan)',
        'glow-warning': 'var(--glow-warning)',
      },

      /* =================================================================
         TRANSITION
         ================================================================= */
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        spring: 'var(--ease-spring)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },

      /* =================================================================
         Z-INDEX
         ================================================================= */
      zIndex: {
        base: 'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        modal: 'var(--z-modal)',
        tooltip: 'var(--z-tooltip)',
      },

      /* =================================================================
         ANIMATION (Basic)
         ================================================================= */
      animation: {
        'fade-in': 'fadeIn var(--duration-base) var(--ease-out) forwards',
        'fade-out': 'fadeOut var(--duration-fast) var(--ease-out) forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: 'var(--glow-accent)' },
          '50%': { boxShadow: 'var(--glow-accent-strong)' },
        },
      },
    },
  },
  plugins: [],
}
