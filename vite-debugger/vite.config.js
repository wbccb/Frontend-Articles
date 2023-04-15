import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {viteCommonjs} from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        viteCommonjs()
    ],
    define: {
        TEST_ONE: true,
        TEST_TWO: 2
    },
    experimental: {
        hmrPartialAccept: true
    }
});