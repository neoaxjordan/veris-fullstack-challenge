import { Request, Response, NextFunction } from "express";

export const validateEmailFormat = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    
    // Regex estándar para validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            code: 400,
            message: "El formato del correo electrónico es inválido",
            data: null
        });
    }

    next(); 
};
