import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true,
			},
			manifest: {
				name: 'Study Timer',
				short_name: 'StudyTimer',
				description: 'Study timer with sessions and streaks',
				theme_color: '#000000',
				background_color: '#000000',
				display: 'standalone',
				start_url: '/study-tracker/',
				scope: '/study-tracker/',
			},
		}),
	],
	base: '/study-tracker/',
});
