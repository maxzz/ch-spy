import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import builtins from 'rollup-plugin-node-builtins';

const builtinsPlugin = {
    ...builtins({ crypto: true }),
    name: 'rollup-plugin-node-builtins',
  };

// https://vitejs.dev/config/
export default ({command}) => {
    return defineConfig({
        base: command === 'build' ? '/animated-sidebar/' : '',
        //plugins: [builtinsPlugin, vue()],
        plugins: [vue()],
        // rollupOptions: {
        //     plugins: [
        //         //globalsPlugin,
        //         builtinsPlugin,
        //     ]
        // }
        
    });
};
