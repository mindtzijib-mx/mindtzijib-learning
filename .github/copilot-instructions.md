## Mindtzijib Learning – AI contributor guide

Purpose: Help AI agents ship changes fast in this React + TypeScript + Vite SPA deployed to GitHub Pages.

### Big picture

- Stack: React 19, React Router v6, TypeScript, Vite 7. SPA styling via Tailwind CDN (no PostCSS build yet).
- Layout and routing: `src/main.tsx` wires `<BrowserRouter>` with a conditional `basename`; `src/App.tsx` provides the shared shell (`<header>/<Outlet>/<footer>`). Routes live in `src/routes/*`.
- GH Pages deploy: `vite.config.ts` sets `base` to `/mindtzijib-learning/` only on build. `404.html` preserves path and redirects to `index.html` for SPA fallback. CI in `.github/workflows/deploy.yml` builds and deploys `dist/` on push to main.

### Run, build, lint

- Dev server: `npm run dev` (default port 5173). Navigate to `/` or `/matematicas/regletas-cuisenaire`.
- Build: `npm run build` (TypeScript project build + Vite). Preview: `npm run preview`.
- Lint: `npm run lint` (typescript-eslint + react-hooks + react-refresh rules). `dist/` is globally ignored by ESLint.

### Routing/base-path rules (important)

- The site is served under `/mindtzijib-learning/` on GH Pages. Two places must stay in sync:
  1. `vite.config.ts` base when `command === 'build'`.
  2. `src/main.tsx` `slug = "/mindtzijib-learning"` and conditional `basename` passed to `<BrowserRouter>`.
- If you rename the repo or move hosting path, update both and keep `404.html` logic intact.

### Files to know

- `src/main.tsx`: Router setup, base-path detection for GH Pages.
- `src/App.tsx`: App shell with `<Link>` nav and `<Outlet>`.
- `src/routes/Home.tsx`: Minimal landing view.
- `src/routes/Cuisenaire.tsx`: Canvas-based interactive activity (drag/snap/delete/rotate/fullscreen).
- `index.html`: Tailwind CDN config, app fonts, mounts `#root`.
- `vite.config.ts`: React plugin + conditional `base`.
- `.github/workflows/deploy.yml`: Node 20 build, upload artifact, deploy pages.

### Cuisenaire canvas patterns (when editing/extending)

- Canvas drawing is DPI-aware: a ResizeObserver + `devicePixelRatio` scaling. Maintain this flow when adding features.
- Grid snapping: `GRID_BASE * GRID_VISUAL_MULT` controls visible grid and snap step. Toggling grid snaps existing rods.
- Interaction: global `pointermove`/`pointerup` listeners, z-order managed by moving dragged rod to array end. Delete with Delete/Backspace, rotate with R, toggle fullscreen with F. On exiting fullscreen, state resets (intentional).
- Keep render pure in `draw` and update state via setters; avoid direct DOM mutations beyond canvas.

### Adding a new route (example)

1. Create `src/routes/MyPage.tsx` exporting a default component.
2. In `src/main.tsx`, add `<Route path="mi-seccion/mipagina" element={<MyPage />} />` inside the root route.
3. In `src/App.tsx`, add `<Link to="/mi-seccion/mipagina">Mi Página</Link>` to the nav.
4. Ensure paths are absolute from the app root; GH Pages `basename` will handle the subpath.

### Styling conventions

- Use Tailwind utility classes inline (from CDN). Fonts: Poppins (base) and Montserrat (headings) set in `index.html`.
- If you need heavy theming or purge, propose migrating to local Tailwind build (don’t introduce PostCSS config ad‑hoc without updating build/docs).

### Deploy nuances

- CI uses `npm ci` on Node 20. Artifacts are uploaded from `dist/` and served with the configured `base`.
- SPA fallback relies on `404.html`. Don’t remove it; adjust only if router strategy changes.

### Gotchas

- Don’t switch to `HashRouter`; the project intentionally supports clean URLs on GH Pages via `basename` + `404.html`.
- Keep the `slug` and Vite `base` consistent. Mismatch breaks route resolution after deploy.
- Avoid importing Tailwind into TS/TSX; keep CDN usage centralized in `index.html`.
