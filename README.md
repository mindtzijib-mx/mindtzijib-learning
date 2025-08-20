# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Rutas educativas añadidas

Nueva ruta: `/matematicas/regletas-cuisinaire` implementada con React + canvas.

Funcionalidades:

- Paleta de regletas (1 a 10) con colores estándar.
- Arrastrar y soltar sobre un lienzo con cuadrícula y snapping.
- Doble clic para eliminar una regleta.
- Cálculo y visualización de la suma total.
- Limpiar lienzo.

Prueba rápida:

1. `npm run dev`
2. Navega a `http://localhost:5173/matematicas/regletas-cuisinaire`

Mejoras sugeridas:

- Integrar API Gemini real (usar variable de entorno + proxy opcional).
- Persistir estado en localStorage.
- Exportar composición (imagen / JSON).
- Accesibilidad: soporte teclado y etiquetas ARIA.
- Tests de lógica (snapping, suma, eliminación).

## Deploy en GitHub Pages

Automatizado con GitHub Actions (`.github/workflows/deploy.yml`).

- `vite.config.ts` tiene `base: '/mindtzijib-learning/'`.
- Fallback SPA: `404.html` redirige a `index.html` preservando ruta.
- Para producción futura: instalar Tailwind localmente y retirar el CDN.
