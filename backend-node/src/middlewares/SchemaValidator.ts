import { Request, Response, NextFunction } from "express";

export interface ValidationRule {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'numeric-string'; // numeric-string para cédulas/RUC
    required?: boolean;
    length?: number;     // Longitud exacta (ej. 1 para estado)
    maxLength?: number;  // Longitud máxima (ej. 3 para tipo identificación)
}

export const validateFields = (rules: ValidationRule[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;
        const errors: string[] = [];

        for (const rule of rules) {
            const value = body[rule.name];

            // 1. Validar Obligatoriedad y Nulos
            if (rule.required !== false && (value === undefined || value === null)) {
                errors.push(`El campo '${rule.name}' es obligatorio.`);
                continue;
            }

            // Si el campo no es obligatorio y no viene, saltamos el resto de validaciones
            if (value === undefined || value === null) continue;

            // 2. Validar Tipo de Dato y Formato
            if (rule.type === 'numeric-string') {
                if (typeof value !== 'string' || !/^\d+$/.test(value)) {
                    errors.push(`El campo '${rule.name}' debe contener solo números.`);
                }
            } else if (typeof value !== rule.type) {
                errors.push(`El campo '${rule.name}' debe ser de tipo ${rule.type}.`);
            }

            // 3. Validar Longitud Exacta (Ej: Estado 'A' o 'I')
            if (rule.length && String(value).length !== rule.length) {
                errors.push(`El campo '${rule.name}' debe tener exactamente ${rule.length} caracteres.`);
            }

            // 4. Validar Longitud Máxima (Ej: COD_TIPO_ID 'CED')
            if (rule.maxLength && String(value).length > rule.maxLength) {
                errors.push(`El campo '${rule.name}' no puede exceder los ${rule.maxLength} caracteres.`);
            }

            // 5. Validar Vacíos
            if (typeof value === 'string' && value.trim() === '') {
                errors.push(`El campo '${rule.name}' no puede estar vacío.`);
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                code: 400,
                message: "Fallo en la validación de integridad de datos",
                data: errors
            });
        }

        next();
    };
};
