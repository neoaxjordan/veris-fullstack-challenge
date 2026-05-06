import { Router } from "express";
import { create, update, deleteLogical, getAll, getByIdentification, getByName } from "../controllers/PatientController";
import { verifyToken as authMiddleware } from "../middlewares/AuthMiddleware";
import { ValidationRule, validateFields } from "../middlewares/SchemaValidator";

const router = Router();

const patientSchema: ValidationRule[] = [
    { name: "codigoTipoIdentificacion", type: "string", maxLength: 3 },
    { name: "numeroIdentificacion", type: "numeric-string"},
    { name: "primerNombre", type: "string" },
    { name: "primerApellido", type: "string" },
    { name: "email", type: "string" },
    { name: "estado", type: "string", length: 1, required: false }
];

// Endpoint para crear paciente (Protegido + Validado)
router.post("/create", authMiddleware, validateFields(patientSchema), create);

const updateSchema: ValidationRule[] = [
    { name: "codigoTipoIdentificacion", type: "string", maxLength: 3, required: false },
    { name: "numeroIdentificacion", type: "numeric-string", required: false },
    { name: "email", type: "string", required: false },
    { name: "estado", type: "string", length: 1, required: false }
];

// Endpoint para editar  del paciente (Protegido + Validado)
router.put("/update/:id", authMiddleware, validateFields(updateSchema), update);

// Endpoint para borrado lógico del paciente (Protegido + Validado)
router.delete("/delete/:id", authMiddleware, deleteLogical);

// Endpoint para listar pacientes (Protegido)
router.get("/all", authMiddleware, getAll);

// Búsqueda exacta por identificación
router.get("/find/:identificacion", authMiddleware, getByIdentification);

// Búsqueda flexible por nombre y apellido (usando Query Params)
router.get("/search", authMiddleware, getByName);

export default router;