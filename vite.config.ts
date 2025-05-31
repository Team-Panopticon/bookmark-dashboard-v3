import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      rollupOptions: {
        input: {
          newtab: './newtab.html',
          popup: './popup.html',
        },
      },
      minify: mode === 'development' ? false : true,
    },
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  };
});
