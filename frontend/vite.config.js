import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import BackendURL from './src/utils/config.js';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/socket.io': {
                target: {BackendURL},
                ws: true,
            },
        },
    },
});
