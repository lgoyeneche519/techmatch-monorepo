import { useState, useEffect, type FormEvent } from "react";
import { loginRequest, registerRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = "login" | "register";

const inputStyle: React.CSSProperties = {
    width: "100%", height: "42px",
    padding: "0 14px",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: "14px", color: "var(--text-primary)",
    background: "var(--bg-page)", outline: "none",
    transition: "border-color 0.2s", fontFamily: "inherit",
};

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const { login } = useAuth();
    const [tab, setTab] = useState<Tab>("login");

    // Login state
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    // Register state
    const [regUsername, setRegUsername] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regFullName, setRegFullName] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regPassword2, setRegPassword2] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIdentifier(""); setPassword("");
            setRegUsername(""); setRegEmail(""); setRegFullName(""); setRegPassword(""); setRegPassword2("");
            setError(null); setSuccess(null); setLoading(false); setShowPwd(false); setTab("login");
        }
    }, [isOpen]);

    useEffect(() => {
        const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (isOpen) window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!identifier.trim() || !password.trim()) {
            setError("Todos los campos obligatorios deben estar completos.");
            return;
        }
        setLoading(true);
        try {
            const res = await loginRequest({ identifier: identifier.trim(), password });
            login(res.data, res.token);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error inesperado.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!regUsername.trim() || !regEmail.trim() || !regFullName.trim() || !regPassword.trim()) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        if (regPassword !== regPassword2) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        if (regPassword.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        setLoading(true);
        try {
            const res = await registerRequest({
                username: regUsername.trim(), email: regEmail.trim(),
                full_name: regFullName.trim(), password: regPassword,
            });
            login(res.data, res.token);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error inesperado.");
        } finally {
            setLoading(false);
        }
    };

    const EyeIcon = ({ open }: { open: boolean }) => open ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    );

    return (
        <div onClick={onClose} style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
        }}>
            <div onClick={(e) => e.stopPropagation()} style={{
                background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
                width: "100%", maxWidth: "440px",
                boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                overflow: "hidden",
            }}>
                {/* Header */}
                <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "8px",
                            background: "var(--brand-light)", display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <span style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)" }}>TechMatch</span>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", margin: "20px 28px 0", borderBottom: "1.5px solid var(--border)" }}>
                    {(["login", "register"] as Tab[]).map((t) => (
                        <button key={t} onClick={() => { setTab(t); setError(null); }} style={{
                            flex: 1, padding: "10px 0", background: "none", border: "none",
                            fontSize: "14px", fontWeight: tab === t ? 600 : 400,
                            color: tab === t ? "var(--brand)" : "var(--text-secondary)",
                            borderBottom: tab === t ? "2px solid var(--brand)" : "2px solid transparent",
                            marginBottom: "-1.5px", cursor: "pointer", transition: "color 0.2s",
                        }}>
                            {t === "login" ? "Iniciar sesión" : "Crear cuenta"}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div style={{ padding: "24px 28px 28px" }}>
                    {/* Error */}
                    {error && (
                        <div style={{
                            background: "#fef2f2", border: "1px solid #fecaca",
                            borderRadius: "var(--radius-sm)", padding: "10px 14px",
                            display: "flex", gap: "8px", alignItems: "center", marginBottom: "16px",
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            <p style={{ fontSize: "13px", color: "#dc2626" }}>{error}</p>
                        </div>
                    )}
                    {success && (
                        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: "16px" }}>
                            <p style={{ fontSize: "13px", color: "#16a34a" }}>{success}</p>
                        </div>
                    )}

                    {/* ── LOGIN FORM ── */}
                    {tab === "login" && (
                        <form onSubmit={handleLogin} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>
                                    Correo o nombre de usuario
                                </label>
                                <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="tu@correo.com" autoComplete="username" style={inputStyle}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-focus)"; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>
                                    Contraseña
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input type={showPwd ? "text" : "password"} value={password}
                                        onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                                        autoComplete="current-password"
                                        style={{ ...inputStyle, paddingRight: "42px" }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-focus)"; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                                    />
                                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex",
                                    }}>
                                        <EyeIcon open={showPwd} />
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} style={{
                                height: "44px", background: loading ? "#c4b5fd" : "var(--brand)",
                                color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
                                fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                                marginTop: "4px", transition: "background 0.2s",
                            }}
                                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--brand-dark)"; }}
                                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = loading ? "#c4b5fd" : "var(--brand)"; }}
                            >
                                {loading ? "Verificando..." : "Ingresar"}
                            </button>
                        </form>
                    )}

                    {/* ── REGISTER FORM ── */}
                    {tab === "register" && (
                        <form onSubmit={handleRegister} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {[
                                { label: "Nombre completo", value: regFullName, setter: setRegFullName, type: "text", placeholder: "María García", auto: "name" },
                                { label: "Nombre de usuario", value: regUsername, setter: setRegUsername, type: "text", placeholder: "mariagarcia", auto: "username" },
                                { label: "Correo electrónico", value: regEmail, setter: setRegEmail, type: "email", placeholder: "maria@correo.com", auto: "email" },
                            ].map(({ label, value, setter, type, placeholder, auto }) => (
                                <div key={label}>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>{label}</label>
                                    <input type={type} value={value} onChange={(e) => setter(e.target.value)}
                                        placeholder={placeholder} autoComplete={auto} style={inputStyle}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-focus)"; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                                    />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>Contraseña</label>
                                <div style={{ position: "relative" }}>
                                    <input type={showPwd ? "text" : "password"} value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        placeholder="Mínimo 8 caracteres" autoComplete="new-password"
                                        style={{ ...inputStyle, paddingRight: "42px" }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-focus)"; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                                    />
                                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex",
                                    }}>
                                        <EyeIcon open={showPwd} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>Confirmar contraseña</label>
                                <input type={showPwd ? "text" : "password"} value={regPassword2}
                                    onChange={(e) => setRegPassword2(e.target.value)}
                                    placeholder="Repite la contraseña" autoComplete="new-password" style={inputStyle}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--border-focus)"; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                                />
                            </div>
                            <button type="submit" disabled={loading} style={{
                                height: "44px", background: loading ? "#c4b5fd" : "var(--brand)",
                                color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
                                fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                                marginTop: "4px", transition: "background 0.2s",
                            }}
                                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--brand-dark)"; }}
                                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = loading ? "#c4b5fd" : "var(--brand)"; }}
                            >
                                {loading ? "Creando cuenta..." : "Crear cuenta"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
