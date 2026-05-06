-- Crear la secuencia para el ID de paciente
CREATE SEQUENCE MGM_SEQ_PACIENT 
START WITH 1 
INCREMENT BY 1;

-- Tabla de Tipos de Identificación
CREATE TABLE daf_tipos_identificacion (
    codigo_tipo_identificacion VARCHAR2(10) NOT NULL,
    nombre_tipo_identificacion VARCHAR2(100) NOT NULL,
    estado                     CHAR(1) DEFAULT 'A' NOT NULL,
    CONSTRAINT PK_DAF_TIPOS PRIMARY KEY (codigo_tipo_identificacion),
    CONSTRAINT CHK_TIPO_ESTADO CHECK (estado IN ('A', 'I'))
);

-- Tabla de Pacientes[cite: 1]
CREATE TABLE mgm_pacientes (
    id_paciente                NUMBER NOT NULL,
    codigo_tipo_identificacion VARCHAR2(10) NOT NULL,
    numero_identificacion      VARCHAR2(20) NOT NULL,
    primer_nombre              VARCHAR2(50) NOT NULL,
    segundo_nombre             VARCHAR2(50),
    primer_apellido            VARCHAR2(50) NOT NULL,
    segundo_apellido           VARCHAR2(50),
    nombre_completo            VARCHAR2(200),
    email                      VARCHAR2(100) NOT NULL,
    estado                     CHAR(1) DEFAULT 'A' NOT NULL,
    -- Campos de Auditoría[cite: 1]
    fecha_ingreso              TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    usuario_ingreso            VARCHAR2(50),
    fecha_modificacion         TIMESTAMP,
    usuario_modificacion       VARCHAR2(50),
    -- Constraints[cite: 1]
    CONSTRAINT PK_MGM_PACIENTES PRIMARY KEY (id_paciente),
    CONSTRAINT FK_PACIENTE_TIPO FOREIGN KEY (codigo_tipo_identificacion) 
        REFERENCES daf_tipos_identificacion(codigo_tipo_identificacion),
    CONSTRAINT CHK_PAC_ESTADO CHECK (estado IN ('A', 'I'))
);