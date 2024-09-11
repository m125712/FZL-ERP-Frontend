import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

const isProduction = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@icons': path.resolve(__dirname, './src/assets/icons'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@components': path.resolve(__dirname, './src/components'),
			'@util': path.resolve(__dirname, './src/util'),
			'@lib': path.resolve(__dirname, './src/lib'),
			'@ui': path.resolve(__dirname, './src/ui'),
			'@context': path.resolve(__dirname, './src/context'),
			'@layouts': path.resolve(__dirname, './src/layouts'),
			'@routes': path.resolve(__dirname, './src/routes'),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return id
							.toString()
							.split('node_modules/')[1]
							.split('/')[0]
							.toString();
					}
				},
			},
		},
	},
	plugins: [react()],
	// plugins: [react(), eslintPlugin()],
	server: {
		// port: 3000,
		port: isProduction ? 4015 : 3000,
	},
});
