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
					$stores: resolve('./src/stores')
				},
				extensions: ['.svelte', '.js']
			}
		}
	}
};

export default config;
