import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Para GitHub Pages, necesitamos usar el nombre del repositorio como base
// En desarrollo local usamos '/' para simplicidad
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/mindtzijib-learning/" : "/",
  plugins: [react()],
}));
