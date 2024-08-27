// import { nextui } from '@nextui-org/react';

// /** @type {import('tailwindcss').Config} */
// export default {
// 	content: [
// 		'./index.html',
// 		'./src/**/*.{js,ts,jsx,tsx}',
// 		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
// 	],
// 	theme: {
// 		extend: {
// 			fontFamily: {
// 				poppins: ['Poppins', 'sans-serif'],
// 			},
// 		},
// 	},
// 	darkMode: 'class',
// 	plugins: [
// 		nextui({
// 			defaultTheme: 'light',
// 			themes: {
// 				light: {
// 					extend: 'light',
// 				},
// 			},
// 		}),
// 	],
// };

import { nextui } from '@nextui-org/react';
import daisyui from 'daisyui';

const LIGHT_THEME = require('daisyui/src/theming/themes')['light'];

// const WHITE = '#FFFFFF';
// const BLACK = '#000000';
// const PRIMARY = '#4F496F';
// const SECONDARY = '#ADB7D6';

const WHITE = '#FFFFFF';
const PRIMARY = '#27374D';
const PRIMARY_FOREGROUND = '#f2f5f8';
const SECONDARY = '#526D82';
const SECONDARY_LIGHT = '#9DB2BF';
const BACKGROUND = '#f5f7fa';
const ACCENT = '#00ADB5';

// const WHITE = '#FFFFFF';
// const PRIMARY = '#222831';
// const PRIMARY_FOREGROUND = '#EEEEEE';
// const SECONDARY = '#393E46';
// const SECONDARY_LIGHT = '#9DB2BF';
// const BACKGROUND = '#EEEEEE';
// const ACCENT = '#FFD369';

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
					'--animation-btn': '.15s',
					'--btn-text-case': 'uppercase',
					'--btn-focus-scale': '1.1',
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
