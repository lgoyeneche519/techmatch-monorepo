import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getToken, clearToken, saveToken } from "../api/auth";

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    full_name: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    login: (user: AuthUser, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
    children: ReactNode;
    onLogout?: () => void;
}

export const AuthProvider = ({ children, onLogout }: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = getToken();
        if (savedToken) {
            try {
                const payload = JSON.parse(atob(savedToken.split(".")[1]));
                const isExpired = payload.exp && Date.now() / 1000 > payload.exp;

                if (!isExpired) {
                    setToken(savedToken);
                    const savedUser = localStorage.getItem("tm_user");
                    if (savedUser) setUser(JSON.parse(savedUser));
                } else {
                    clearToken();
                    localStorage.removeItem("tm_user");
                }
            } catch {
                clearToken();
                localStorage.removeItem("tm_user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (u: AuthUser, t: string) => {
        setUser(u);
        setToken(t);
        saveToken(t);
        // Solo guardamos datos que NO son sensibles — nunca la contraseña
        localStorage.setItem("tm_user", JSON.stringify({
            id: u.id,
            username: u.username,
            email: u.email,
            full_name: u.full_name,
        }));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        clearToken();
        localStorage.removeItem("tm_user");
        onLogout?.();
    };

    return (
        <AuthContext.Provider value={{
            user, token, login, logout,
            isAuthenticated: !!user,
            isLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
};
