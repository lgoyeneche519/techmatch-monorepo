import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "Todos los campos obligatorios deben estar completos.",
            });
        }

        const result = await loginUser({ identifier: identifier.trim(), password });

        if (!result) {
            return res.status(401).json({
                message: "El usuario o la contraseña no son válidos.",
            });
        }

        return res.status(200).json({
            message: "Inicio de sesión exitoso.",
            data: result.user,
            token: result.token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Ocurrió un error al iniciar sesión." });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, full_name } = req.body;

        if (!username?.trim() || !email?.trim() || !password?.trim() || !full_name?.trim()) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        const result = await registerUser({ username, email, password, full_name });

        return res.status(201).json({
            message: "Usuario registrado exitosamente.",
            data: result.user,
            token: result.token,
        });
    } catch (error: unknown) {
        // Violación de unicidad (email o username duplicado)
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code: string }).code === "23505"
        ) {
            return res.status(409).json({ message: "El correo o nombre de usuario ya está registrado." });
        }
        console.error("Register error:", error);
        return res.status(500).json({ message: "Ocurrió un error al registrar el usuario." });
    }
};
