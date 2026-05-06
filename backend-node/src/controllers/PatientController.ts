import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Paciente } from "../entities/Patient";
import { Not, Like, Raw } from "typeorm";

export const create = async (req: Request, res: Response) => {
    try {
        const patientRepo = AppDataSource.getRepository(Paciente);

        const nextIdRaw = await AppDataSource.query("SELECT MGM_SEQ_PACIENT.NEXTVAL FROM DUAL");
        const nextId = nextIdRaw[0].NEXTVAL;

        const newPatient = patientRepo.create({
            ...req.body,
            id: nextId,
            nombreCompleto: `${req.body.primerNombre} ${req.body.primerApellido}`,
            usuarioIngreso: "SISTEMA",
            fechaIngreso: new Date(),
            estado: req.body.estado || 'A' // Active
        });

        await patientRepo.save(newPatient);

        return res.status(201).json({
            code: 201,
            message: "Paciente creado exitosamente",
            data: newPatient
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Error al crear el paciente",
            data: error
        });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // El filtro de búsqueda por ID
        const paciente = await findPacienteById(id);

        const repo = AppDataSource.getRepository(Paciente);

        // Lógica de negocio (nombres, etc.)
        const primerNombre = req.body.primerNombre || paciente.primerNombre;
        const primerApellido = req.body.primerApellido || paciente.primerApellido;
        const nombreCompleto = `${primerNombre} ${primerApellido}`.trim();

        repo.merge(paciente, {
            ...req.body,
            nombreCompleto,
            usuarioModificacion: "SISTEMA",
            fechaModificacion: new Date()
        });

        await repo.save(paciente);
        return res.status(200).json({ code: 200, message: "Paciente actualizado", data: paciente });

    } catch (error: any) {
        const status = error.statusCode || 400;
        return res.status(status).json({
            code: status,
            message: error.message || "Error al actualizar el paciente",
            data: null
        });
    }
};

export const deleteLogical = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // El mismo filtro de búsqueda
        const paciente = await findPacienteById(id);

        const repo = AppDataSource.getRepository(Paciente);

        paciente.estado = 'I'; // Delete
        paciente.fechaModificacion = new Date();
        paciente.usuarioModificacion = "SISTEMA";

        await repo.save(paciente);
        return res.status(200).json({ code: 200, message: "Paciente desactivado correctamente", data: null });

    } catch (error: any) {
        const status = error.statusCode || 400;
        return res.status(status).json({
            code: status,
            message: error.message || "Error al eliminar el paciente",
            data: null
        });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(Paciente);

        // Filtramos para traer solo los registros con estado 'A' (Activo)
        const pacientes = await repo.find({
            where: {
                estado: Not('I')
            },
            order: { id: 'ASC' }
        });

        return res.status(200).json({
            code: 200,
            message: "Listado de pacientes activos obtenido con éxito",
            data: pacientes
        });
    } catch (error: any) {
        return res.status(500).json({
            code: 500,
            message: "Error al obtener la lista de pacientes",
            data: error.message || error
        });
    }
};

export const getByIdentification = async (req: Request, res: Response) => {
    try {
        const { identificacion } = req.params;
        const repo = AppDataSource.getRepository(Paciente);

        const paciente = await repo.findOne({
            where: {
                 numeroIdentificacion: String(identificacion),
                 estado: Not('I')
            }
        });

        if (!paciente) {
            return res.status(404).json({ code: 404, message: "No se encontró paciente con esa identificación", data: null });
        }

        return res.status(200).json({ code: 200, message: "Paciente encontrado", data: paciente });
    } catch (error: any) {
        return res.status(500).json({ code: 500, message: "Error en la búsqueda", data: error.message });
    }
};

export const getByNameOld = async (req: Request, res: Response) => {
    try {
        const { term } = req.query; // Ejemplo: /search?term=Bruno
        const repo = AppDataSource.getRepository(Paciente);
        const searchPattern = `%${term}%`;

        const pacientes = await repo.find({
            where: [
                { primerNombre: Like(searchPattern), estado: Not('I') },
                { primerApellido: Like(searchPattern), estado: Not('I') },
                { nombreCompleto: Like(searchPattern), estado: Not('I') }
            ],
            order: { nombreCompleto: 'ASC' }
        });

        return res.status(200).json({
            code: 200,
            message: `Se encontraron ${pacientes.length} coincidencias`,
            data: pacientes
        });
    } catch (error: any) {
        return res.status(500).json({ code: 500, message: "Error en la búsqueda", data: error.message });
    }
};

export const getByName = async (req: Request, res: Response) => {
    try {
        const { term } = req.query;
        const searchTerm = String(term).toUpperCase(); 
        const repo = AppDataSource.getRepository(Paciente);
        
        const [porNombre, porApellido] = await Promise.all([
            repo.find({ 
                where: { 
                    primerNombre: Raw(alias => `UPPER(${alias}) = :value`, { value: searchTerm }),
                    estado: Not('I') 
                } 
            }),
            repo.find({ 
                where: { 
                    primerApellido: Raw(alias => `UPPER(${alias}) = :value`, { value: searchTerm }),
                    estado: Not('I') 
                } 
            })
        ]);

        // Combinar y quitar duplicados
        const combined = [...porNombre, ...porApellido];
        const uniquePatients = Array.from(new Map(combined.map(p => [p.id, p])).values());

        return res.status(200).json({
            code: 200,
            message: `Búsqueda optimizada: ${uniquePatients.length} resultados`,
            data: uniquePatients
        });
    } catch (error: any) {
        return res.status(500).json({ code: 500, message: "Error en búsqueda" });
    }
};

/**
 * Helper para validar existencia del paciente
 */
const findPacienteById = async (id: string | number) => {
    const repo = AppDataSource.getRepository(Paciente);

    const paciente = await repo.findOne({ 
        where: {
            id: Number(id),
            estado: Not('I')
        }
    });

    if (!paciente) {
        const error: any = new Error("El ID del paciente no existe en el sistema.");
        error.statusCode = 404;
        throw error;
    }

    return paciente;
};