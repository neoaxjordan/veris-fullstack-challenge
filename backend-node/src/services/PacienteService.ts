import { AppDataSource } from "../config/data-source";
import { Patient } from "../entities/Patient";

export class PacienteService {
    private pacienteRepository = AppDataSource.getRepository(Patient);

    async create(data: any, usuarioLogueado: string) {
        // Lógica de concatenación requerida
        const nombreCompleto = `${data.primer_nombre} ${data.segundo_nombre || ''} ${data.primer_apellido} ${data.segundo_apellido || ''}`.replace(/\s+/g, ' ').trim();

        // Crear la instancia con los datos de auditoría
        const nuevoPaciente = this.pacienteRepository.create({
            ...data,
            nombreCompleto,
            usuarioIngreso: usuarioLogueado,
            estado: 'A' // Activo por defecto
        });

        // IMPORTANTE: TypeORM usará la secuencia configurada en la Entidad para el ID
        return await this.pacienteRepository.save(nuevoPaciente);
    }
}