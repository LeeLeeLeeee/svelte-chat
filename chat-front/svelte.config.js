import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		target: '#svelte',
		files: {
			routes: 'src/pages'
		},
		vite: {
			resolve: {
				alias: {
					$components: resolve('./src/components'),
					$stores: resolve('./src/stores'),
					$animations: resolve('./src/animations'),
					$lib: resolve('./src/lib'),
				},
				extensions: ['.svelte', '.js']
			},
			server: {
				port: 3001,
				proxy: {
					'/ws': {
						target: 'ws://localhost:19123',
						ws: true,
						changeOrigin: true,
					},
					'/api': 'http://localhost:19123',
				}
			}
		}
	}
};

export default config;
