import daisyui from 'daisyui';

const LIGHT_THEME = require('daisyui/src/theming/themes')['light'];

const WHITE = '#FFFFFF';
const PRIMARY = '#27374D';
const PRIMARY_FOREGROUND = '#f2f5f8';
const SECONDARY = '#526D82';
const SECONDARY_LIGHT = '#9DB2BF';
const BACKGROUND = '#f5f7fa';
const ACCENT = '#00ADB5';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
			},

			keyframes: {
				slideIn: {
					'0%': { opacity: 0, transform: 'translateX(100%)' },
					'100%': { opacity: 1, transform: 'translateX(0)' },
				},
			},
			animation: {
				slideIn: 'slideIn .25s ease-in-out forwards var(--delay, 0)',
			},
		},
	},

	plugins: [daisyui],
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
