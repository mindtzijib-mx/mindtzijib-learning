import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Usamos base '/' siempre; en producción GH Pages los assets se sirven igual al copiar dist dentro del slug.
export default defineConfig({
  base: "/",
  plugins: [react()],
});
