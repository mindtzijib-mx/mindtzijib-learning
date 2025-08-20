import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Para GitHub Pages, necesitamos usar el nombre del repositorio como base
export default defineConfig({
  base: "/mindtzijib-learning/",
  plugins: [react()],
});
