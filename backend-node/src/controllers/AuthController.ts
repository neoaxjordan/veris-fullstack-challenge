import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
    try {
        const { user, password } = req.body;

        // Validación estricta usando las variables del .env
        const isValidUser = user === process.env.STATIC_USER; 
        const isValidPass = password === process.env.STATIC_PASS;

        if (isValidUser && isValidPass) {
            const token = jwt.sign(
                { sub: user }, 
                process.env.JWT_SECRET || "secret_key_123456", 
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                code: 200,
                message: "Autenticación exitosa",
                data: {
                    token: token,
                    expiresIn: 3600
                }
            });
        }

        // Si falla cualquiera de las dos, devolvemos 401
        return res.status(401).json({
            code: 401,
            message: "Usuario o contraseña incorrectos",
            data: null
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Error interno del servidor",
            data: null
        });
    }
};
