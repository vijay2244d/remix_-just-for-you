import { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { DivyaKuralLayout } from "./DivyaKuralLayout";
import { PlaylistLayout } from "./PlaylistLayout";
import { Dashboard } from "./pages/Dashboard";
import { LockScreen } from "./components/LockScreen";
import { useAppStore } from "./store";
import { AnimatePresence } from "framer-motion";

export default function App() {
  const { isUnlocked, setUnlocked } = useAppStore();

  // Lock screen is shown on all environments including localhost
  useEffect(() => {
    // setUnlocked(true); // Uncomment to skip lock screen during development
  }, [setUnlocked]);

  return (
    <>
      <AnimatePresence>
        {!isUnlocked && <LockScreen onUnlock={() => setUnlocked(true)} />}
      </AnimatePresence>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kural/*" element={<DivyaKuralLayout />} />
          <Route path="/playlist/*" element={<PlaylistLayout />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </HashRouter>
    </>
  );
}
