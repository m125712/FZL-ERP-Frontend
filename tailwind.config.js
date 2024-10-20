import daisyui from 'daisyui';

import { colors } from './src/config/tailwind';

const LIGHT_THEME = require('daisyui/src/theming/themes')['light'];

const WHITE = '#FFFFFF';
const PRIMARY = '#27374D';
const PRIMARY_FOREGROUND = '#f2f5f8';
const SECONDARY = '#526D82';
const SECONDARY_LIGHT = '#9DB2BF';
const BACKGROUND = '#f5f7fa';
const ACCENT = '#00ADB5';

export default {
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},

			borderRadius: {
				lg: '8px',
				md: '6px',
				sm: '4px',
			},
			colors: {
				background: colors.BACKGROUND,
				foreground: colors.FOREGROUND,

				card: {
					DEFAULT: colors.CARD,
					foreground: colors.CARD_FOREGROUND,
				},
				popover: {
					DEFAULT: colors.POPOVER,
					foreground: colors.POPOVER_FOREGROUND,
				},
				primary: {
					DEFAULT: colors.PRIMARY,
					foreground: colors.PRIMARY_FOREGROUND,
				},
				secondary: {
					DEFAULT: colors.SECONDARY,
					foreground: colors.SECONDARY_FOREGROUND,
					light: colors.SECONDARY_LIGHT,
				},
				muted: {
					DEFAULT: colors.MUTED,
					foreground: colors.MUTED_FOREGROUND,
				},
				accent: {
					DEFAULT: colors.ACCENT,
					foreground: colors.ACCENT_FOREGROUND,
				},
				destructive: {
					DEFAULT: colors.DESTRUCTIVE,
					foreground: colors.DESTRUCTIVE_FOREGROUND,
				},
				success: {
					DEFAULT: colors.SUCCESS,
					foreground: colors.SUCCESS_FOREGROUND,
				},
				warning: {
					DEFAULT: colors.WARNING,
					foreground: colors.WARNING_FOREGROUND,
				},
				base: {
					DEFAULT: colors.BASE_100,
					150: colors.BASE_150,
					200: colors.BASE_200,
					300: colors.BASE_300,
					content: colors.BASE_CONTENT,
				},

				border: colors.BORDER,
				input: colors.INPUT,
				ring: colors.RING,
				chart: {
					1: colors.CHART_1,
					2: colors.CHART_2,
					3: colors.CHART_3,
					4: colors.CHART_4,
					5: colors.CHART_5,
				},
			},

			keyframes: {
				shine: {
					from: { backgroundPosition: '200% 0' },
					to: { backgroundPosition: '-200% 0' },
				},
			},
			animation: {
				shine: 'shine 8s ease-in-out infinite',
			},
		},
	},

	plugins: [daisyui, require('tailwindcss-animate')],
	daisyui: {
		themes: [
			{
				light: {
					...LIGHT_THEME,

					background: BACKGROUND,
					primary: PRIMARY,
					'primary-content': PRIMARY_FOREGROUND,

					secondary: SECONDARY,
					'secondary-light': SECONDARY_LIGHT,
					'secondary-content': PRIMARY_FOREGROUND,

					accent: ACCENT,
					'accent-content': WHITE,

					neutral: '#2a2e37',
					'neutral-content': WHITE,

					'base-100': BACKGROUND,
					'base-200': '#dfe7ec',
					'base-300': '#9fb7c6',
					'base-content': PRIMARY,

					info: ACCENT,
					'info-content': WHITE,

					success: '#17c964',
					'success-content': WHITE,

					warning: '#f5a524',
					'warning-content': WHITE,

					error: '#f31260',
					'error-content': WHITE,

					'--rounded-btn': '0.3rem',
					'--animation-btn': '0s',
					'--btn-text-case': 'uppercase',
					'--btn-focus-scale': '1.05',
					'--border-btn': '0.1rem',
				},
			},
		],
		darkTheme: 'light',
		rtl: false,
		prefix: '',
		logs: false,
		themeRoot: ':root',
	},
};
