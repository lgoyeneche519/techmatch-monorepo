import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ComparatorProvider } from "./context/ComparatorContext";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import CatalogPage from "./pages/CatalogPage";
import ComparatorDrawer from "./components/ComparatorDrawer";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <AuthProvider onLogout={() => setSearchQuery("")}>
      <ComparatorProvider>
        <Navbar
          onSearch={setSearchQuery}
          onLoginClick={() => setLoginOpen(true)}
          searchQuery={searchQuery}
        />
        <CatalogPage searchQuery={searchQuery} />
        <ComparatorDrawer />
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </ComparatorProvider>
    </AuthProvider>
  );
}

export default App;