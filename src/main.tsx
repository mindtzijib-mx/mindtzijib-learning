import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Home from "./routes/Home.tsx";
import Cuisenaire from "./routes/Cuisenaire.tsx";

// Detect if served under GitHub Pages subpath
const slug = "/mindtzijib-learning";
const needsBase = window.location.pathname.startsWith(slug + "/");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={needsBase ? slug : undefined}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route
            path="matematicas/regletas-cuisinaire"
            element={<Cuisenaire />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
