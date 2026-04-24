import type { AuthUser } from "../context/AuthContext";

interface LoginPayload {
    identifier: string;
    password: string;
}

interface AuthResponse {
    message: string;
    data: AuthUser;
    token: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const saveToken = (token: string) => localStorage.setItem("tm_token", token);
export const getToken = () => localStorage.getItem("tm_token");
export const clearToken = () => localStorage.removeItem("tm_token");

export const loginRequest = async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Nunca se loguea el payload — contiene la contraseña
        body: JSON.stringify(payload),
    });

    if (res.status === 400) throw new Error("Todos los campos obligatorios deben estar completos.");
    if (res.status === 401) throw new Error("El usuario o la contraseña no son válidos.");
    if (!res.ok) throw new Error("Ocurrió un error al iniciar sesión.");

    const data: AuthResponse = await res.json();

    // Verificamos que la respuesta NO incluya password antes de retornar
    if ("password" in data.data) {
        delete (data.data as Record<string, unknown>)["password"];
    }

    return data;
};

export const registerRequest = async (payload: {
    username: string;
    email: string;
    password: string;
    full_name: string;
}): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (res.status === 400) throw new Error("Todos los campos son obligatorios.");
    if (res.status === 409) throw new Error("El correo o nombre de usuario ya está registrado.");
    if (!res.ok) throw new Error("Ocurrió un error al registrar el usuario.");

    const data: AuthResponse = await res.json();

    if ("password" in data.data) {
        delete (data.data as Record<string, unknown>)["password"];
    }

    return data;
};
