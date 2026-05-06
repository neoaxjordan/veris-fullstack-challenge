import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, Generated } from "typeorm";
import { TipoIdentificacion } from "./TipeIdentification";

@Entity({ name: "MGM_PACIENTES" })
export class Paciente {
    @PrimaryColumn({ name: "ID_PACIENTE" })
    @Generated('increment')
    id: number;

    @Column({ name: "CODIGO_TIPO_IDENTIFICACION" })
    codigoTipoIdentificacion: string;

    @Column({ name: "NUMERO_IDENTIFICACION" })
    numeroIdentificacion: string;

    @Column({ name: "PRIMER_NOMBRE" })
    primerNombre: string;

    @Column({ name: "SEGUNDO_NOMBRE", nullable: true })
    segundoNombre: string;

    @Column({ name: "PRIMER_APELLIDO" })
    primerApellido: string;

    @Column({ name: "SEGUNDO_APELLIDO", nullable: true })
    segundoApellido: string;

    @Column({ name: "NOMBRE_COMPLETO" })
    nombreCompleto: string;

    @Column({ name: "EMAIL" })
    email: string;

    @Column({ name: "ESTADO" ,default: "A" })
    estado: string;

    // Auditoría
    @Column({ name: "FECHA_INGRESO", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    fechaIngreso: Date;

    @Column({ name: "USUARIO_INGRESO" })
    usuarioIngreso: string;

    @Column({ name: "FECHA_MODIFICACION", type: "timestamp", nullable: true })
    fechaModificacion: Date;

    @Column({ name: "USUARIO_MODIFICACION", nullable: true })
    usuarioModificacion: string;

    // Relación
    @ManyToOne(() => TipoIdentificacion, (tipo) => tipo.pacientes)
    @JoinColumn({ name: "CODIGO_TIPO_IDENTIFICACION" })
    tipoIdentificacion: TipoIdentificacion;
}