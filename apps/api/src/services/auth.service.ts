import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";

export interface LoginInput {
    identifier: string;
    password: string;
}

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    full_name: string;

}
export interface LoginResult {
    user: AuthUser;
    token: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-prod";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

export const loginUser = async ({ identifier, password }: LoginInput): Promise<LoginResult | null> => {
    const result = await pool.query(
        `SELECT id, username, email, password, full_name
         FROM users
         WHERE email = $1 OR username = $1
         LIMIT 1`,
        [identifier]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, row.password);
    if (!passwordMatch) return null;

    const user: AuthUser = {
        id: row.id,
        username: row.username,
        email: row.email,
        full_name: row.full_name,
    };

    const token = jwt.sign(
        { sub: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES } as jwt.SignOptions
    );

    return { user, token };
};

export const registerUser = async (data: {
    username: string;
    email: string;
    password: string;
    full_name: string;
}): Promise<LoginResult> => {
    const hash = await bcrypt.hash(data.password, 10);

    const result = await pool.query(
        `INSERT INTO users (username, email, password, full_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, full_name`,

        [data.username, data.email, hash, data.full_name]
    );


    const user: AuthUser = result.rows[0];

    const token = jwt.sign(
        { sub: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES } as jwt.SignOptions
    );

    return { user, token };
};
