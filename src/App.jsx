import React, { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoadingPage from "./pages/LoadingPage";
import LandingPage from "./pages/LandingPage";
import CategoryIndex from "./components/project/CategoryIndex";
import Vanta from "./pages/projects/Vanta";
import Slate from "./pages/projects/Slate";
import LilCV from "./pages/projects/LilCV";
import FollowCursor from "./components/effects/FollowCursor";
import { categories } from "./data/projectIndex";

// The loader sits on top while the site mounts underneath it: `revealed`
// flips as the loader starts fading, `loaded` once it has gone.
const App = () => {
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black">
      {revealed && (
        <div className="relative w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {Object.entries(categories).map(([key, c]) => (
              <Route key={key} path={c.path} element={<CategoryIndex categoryKey={key} />} />
            ))}
            <Route path="/projects/vanta" element={<Vanta />} />
            <Route path="/projects/slate" element={<Slate />} />
            <Route path="/projects/lilcv" element={<LilCV />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {isHomePage && loaded && <FollowCursor />}
        </div>
      )}

      {!loaded && (
        <LoadingPage onReveal={() => setRevealed(true)} onDone={() => setLoaded(true)} />
      )}
    </main>
  );
};

export default App;
