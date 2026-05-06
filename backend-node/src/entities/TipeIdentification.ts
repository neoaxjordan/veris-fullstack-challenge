import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Paciente } from "./Patient";

@Entity({ name: "DAF_TIPOS_IDENTIFICACION" })
export class TipoIdentificacion {
    @PrimaryColumn({ name: "CODIGO_TIPO_IDENTIFICACION" })
    codigo: string;

    @Column({ name: "NOMBRE_TIPO_IDENTIFICACION" })
    nombre: string;

    @Column({ name: "ESTADO", default: "A" })
    estado: string;

    @OneToMany(() => Paciente, (paciente) => paciente.tipoIdentificacion)
    pacientes: Paciente[];
}