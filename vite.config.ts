import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  return {
    build: {
      rollupOptions: {
        input: {
          newtab: "./newtab.html",
        },
      },
      minify: mode === "development" ? false : true,
    },
    plugins: [react(), tailwindcss()],
  };
});
