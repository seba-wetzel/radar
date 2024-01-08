import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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
