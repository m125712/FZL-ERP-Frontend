import eslintReact from '@eslint-react/eslint-plugin';
import eslintJs from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
	{
		files: ['./src/**/*.{js,jsx,ts,tsx}'],
		settings: {
			'react-x': {
				version: '19.0.0',
			},
		},

		extends: [
			eslintJs.configs.recommended,
			eslintReact.configs.recommended,
		],

		plugins: {
			'@tanstack/query': pluginQuery,
		},

		// Configure language/parsing options
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true, // Enable JSX syntax support
				},
			},
		},

		// Custom rule overrides (modify rule levels or disable rules)
		rules: {
			'@eslint-react/no-missing-key': 'warn',
			// ...pluginQuery.configs.recommended.rules,
			'@tanstack/query/exhaustive-deps': 'error',
			// '@tanstack/query/no-deprecated-options': 'error',
			// '@tanstack/query/prefer-query-object-syntax': 'error',
			// '@tanstack/query/stable-query-client': 'error',
		},
	},
]);
