import { useState, useEffect, type KeyboardEvent } from "react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
    onSearch: (query: string) => void;
    onLoginClick: () => void;
    searchQuery: string;
}

const Navbar = ({ onSearch, onLoginClick, searchQuery }: NavbarProps) => {
    const { user, logout, isAuthenticated } = useAuth();
    const [inputValue, setInputValue] = useState(searchQuery);

    // Sincroniza el input cuando searchQuery se limpia desde afuera (logout)
    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(inputValue.trim());
        }
    };

    const handleClear = () => {
        setInputValue("");
        onSearch("");
    };

    return (
        <header style={{
            position: "sticky", top: 0, zIndex: 100,
            backgroundColor: "var(--bg-navbar)",
            boxShadow: "var(--shadow-navbar)",
        }}>
            <div style={{
                maxWidth: "1280px", margin: "0 auto",
                padding: "0 24px", height: "64px",
                display: "flex", alignItems: "center", gap: "24px",
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <div style={{
                        width: "32px", height: "32px", borderRadius: "8px",
                        background: "var(--brand)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "18px", color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
                        TechMatch
                    </span>
                </div>

                {/* Buscador — SCRUM-6 */}
                <div style={{ flex: 1, position: "relative", maxWidth: "480px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar productos... (Enter para buscar)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            width: "100%", height: "40px",
                            paddingLeft: "40px",
                            paddingRight: inputValue ? "40px" : "16px",
                            border: "1.5px solid var(--border)",
                            borderRadius: "var(--radius-full)",
                            fontSize: "14px", color: "var(--text-primary)",
                            background: "var(--bg-page)", outline: "none",
                            transition: "border-color 0.2s", fontFamily: "inherit",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-focus)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                    />
                    {inputValue && (
                        <button onClick={handleClear} aria-label="Limpiar búsqueda" style={{
                            position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--text-muted)", display: "flex", alignItems: "center", padding: "2px",
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Auth — SCRUM-31 */}
                <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                    {isAuthenticated ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{
                                width: "32px", height: "32px", borderRadius: "50%",
                                background: "var(--brand-light)", color: "var(--brand)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "13px", fontWeight: 600,
                            }}>
                                {user?.full_name?.charAt(0).toUpperCase() ?? "U"}
                            </div>
                            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                                {user?.full_name?.split(" ")[0]}
                            </span>
                            <button
                                onClick={logout}
                                style={{
                                    fontSize: "13px", padding: "6px 14px",
                                    border: "1.5px solid var(--border)",
                                    borderRadius: "var(--radius-full)",
                                    background: "transparent", color: "var(--text-secondary)",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "var(--text-primary)";
                                    e.currentTarget.style.color = "var(--text-primary)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border)";
                                    e.currentTarget.style.color = "var(--text-secondary)";
                                }}
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            style={{
                                fontSize: "14px", fontWeight: 500,
                                padding: "8px 20px", border: "none",
                                borderRadius: "var(--radius-full)",
                                background: "var(--brand)", color: "#fff",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--brand-dark)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--brand)"; }}
                        >
                            Iniciar sesión
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
