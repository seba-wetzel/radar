import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    base: './',
    build: {
        outDir: 'build',
        sourcemap: false,
        modulePreload: {
            resolveDependencies: (url, deps, context) => {
                return [];
            },
        },
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                sourcemap: false,
                manualChunks: {
                    router: ['react-router-dom'],
                    rmapgl: ['react-map-gl'],
                    mapgl: ['maplibre-gl'],
                    bootstrap: ['react-bootstrap']
                },
            },
        },
    },
})
