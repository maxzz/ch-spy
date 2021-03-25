import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default ({command}) => {
    return defineConfig({
        base: command === 'build' ? '/ch-spy/' : '',
        //base: '/',
        plugins: [vue()],
        // build: {
        //     sourcemap: true
        // }
    });
};
