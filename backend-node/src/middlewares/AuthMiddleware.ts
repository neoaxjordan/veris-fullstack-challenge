import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ code: 401, message: "Token no proporcionado", data: null });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        (req as any).user = decoded; // Guardamos el usuario en el request
        next();
    } catch (error) {
        return res.status(401).json({ code: 401, message: "Token inválido o expirado", data: null });
    }
};