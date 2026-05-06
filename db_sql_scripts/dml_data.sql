-- Datos semilla para tipos de identificación[cite: 1]
INSERT INTO daf_tipos_identificacion (codigo_tipo_identificacion, nombre_tipo_identificacion, estado) 
VALUES ('CED', 'Cédula', 'A');
INSERT INTO daf_tipos_identificacion (codigo_tipo_identificacion, nombre_tipo_identificacion, estado) 
VALUES ('PAS', 'Pasaporte', 'A');
INSERT INTO daf_tipos_identificacion (codigo_tipo_identificacion, nombre_tipo_identificacion, estado) 
VALUES ('RUC', 'RUC', 'A');

-- Paciente de prueba inicial[cite: 1]
INSERT INTO mgm_pacientes (
    id_paciente, codigo_tipo_identificacion, numero_identificacion, 
    primer_nombre, primer_apellido, nombre_completo, email, estado, usuario_ingreso
) VALUES (
    MGM_SEQ_PACIENT.NEXTVAL, 'CED', '1712345678', 'Alex', 'Jordan', 'Alex Jordan', 'alex2026@example.com', 'A', 'SISTEMA'
);

INSERT INTO mgm_pacientes (
    id_paciente, codigo_tipo_identificacion, numero_identificacion, 
    primer_nombre, primer_apellido, nombre_completo, email, estado, usuario_ingreso
) VALUES (
    MGM_SEQ_PACIENT.NEXTVAL, 'CED', '0810395278', 'Juan', 'Paez', 'Juan Paez', 'juanp123@example.com', 'A', 'SISTEMA'
);

INSERT INTO mgm_pacientes (
    id_paciente, codigo_tipo_identificacion, numero_identificacion, 
    primer_nombre, primer_apellido, nombre_completo, email, estado, usuario_ingreso
) VALUES (
    MGM_SEQ_PACIENT.NEXTVAL, 'RUC', '0880391178001', 'Tomas', 'Canuto', 'Tomas Canuto', 'tcanuto26@example.com', 'A', 'SISTEMA'
);

COMMIT;