export interface CreatePatientDto {
    codigo_tipo_identificacion: string;
    numero_identificacion: string;
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido?: string;
    email: string;
    estado?: string;
}