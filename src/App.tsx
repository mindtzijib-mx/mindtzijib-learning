import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", margin: 0 }}>Mindtzijib Learning</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Inicio</Link>
          <Link to="/matematicas/regletas-cuisinaire">Regletas Cuisenaire</Link>
          <Link to="/lenguaje/prodai">PRODAI</Link>
        </nav>
      </header>
      <main style={{ marginTop: 32 }}>
        <Outlet />
      </main>
      <footer style={{ marginTop: 64, fontSize: 12, opacity: 0.6 }}>
        © {new Date().getFullYear()} Mindtzijib
      </footer>
    </div>
  );
}
