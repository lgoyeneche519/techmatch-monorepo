import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ComparatorProvider } from "./context/ComparatorContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import CatalogPage from "./pages/CatalogPage";
import ComparatorDrawer from "./components/ComparatorDrawer";
import FavoritesModal from "./components/FavoritesModal";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);

  return (
    <AuthProvider onLogout={() => setSearchQuery("")}>
      <ComparatorProvider>
        <FavoritesProvider>
          <Navbar
            onSearch={setSearchQuery}
            onLoginClick={() => setLoginOpen(true)}
            onFavoritesClick={() => setFavoritesOpen(true)}
            searchQuery={searchQuery}
          />
          <CatalogPage
            searchQuery={searchQuery}
            onViewDetail={setDetailId}
          />
          <ComparatorDrawer />
          <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
          {favoritesOpen && (
            <FavoritesModal
              onClose={() => setFavoritesOpen(false)}
              onViewDetail={(id) => {
                setFavoritesOpen(false);
                setDetailId(id);
              }}
            />
          )}
          {detailId !== null && (
            <ProductDetailPage
              productId={detailId}
              onClose={() => setDetailId(null)}
            />
          )}
        </FavoritesProvider>
      </ComparatorProvider>
    </AuthProvider>
  );
}

export default App;