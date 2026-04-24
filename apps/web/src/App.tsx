import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import CatalogPage from "./pages/CatalogPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);

  // Al cerrar sesión limpiamos la búsqueda activa
  const handleLogout = () => {
    setSearchQuery("");
  };

  return (
    <AuthProvider onLogout={handleLogout}>
      <Navbar
        onSearch={setSearchQuery}
        onLoginClick={() => setLoginOpen(true)}
        searchQuery={searchQuery}
      />
      <CatalogPage searchQuery={searchQuery} />
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </AuthProvider>
  );
}

export default App;
