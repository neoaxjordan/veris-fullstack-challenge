package com.springboot.test.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@Entity
@Table(name = "MGM_PACIENTES", schema = "VERIS_USER")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "paciente_seq")
    @SequenceGenerator(name = "paciente_seq", sequenceName = "MGM_SEQ_PACIENT", allocationSize = 1)
    @Column(name = "ID_PACIENTE")
    private Long id;

    @Column(name = "CODIGO_TIPO_IDENTIFICACION")
    private String codigoTipoIdentificacion;

    @Column(name = "NUMERO_IDENTIFICACION", unique = true)
    @NotBlank(message = "El número de identificación es obligatorio")
    @Size(min = 10, max = 13, message = "La identificación debe tener entre 10 y 13 caracteres")
    private String numeroIdentificacion;

    @Column(name = "PRIMER_NOMBRE")
    @NotBlank(message = "El primer nombre es obligatorio")
    private String primerNombre;

    @Column(name = "SEGUNDO_NOMBRE")
    private String segundoNombre;

    @Column(name = "PRIMER_APELLIDO")
    @NotBlank(message = "El primer apellido es obligatorio")
    private String primerApellido;

    @Column(name = "SEGUNDO_APELLIDO")
    private String segundoApellido;

    @Column(name = "NOMBRE_COMPLETO")
    private String nombreCompleto;

    @Column(name = "EMAIL")
    @Email(message = "El formato del email no es válido")
    @NotBlank(message = "El email es obligatorio")
    private String email;

    @Column(name = "ESTADO", length = 1)
    @NotBlank(message = "El estado es obligatorio")
    private String estado;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "America/Guayaquil")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "FECHA_INGRESO")
    private Date fechaIngreso;

    @Column(name = "USUARIO_INGRESO")
    private String usuarioIngreso;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "America/Guayaquil")
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "FECHA_MODIFICACION")
    private Date fechaModificacion;

    @Column(name = "USUARIO_MODIFICACION")
    private String usuarioModificacion;
}
