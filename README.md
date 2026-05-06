# Sistema de Gestión de Pacientes - Multi-Stack API

Este proyecto presenta la implementación de una API REST para la gestión de pacientes, desarrollada bajo dos arquitecturas distintas: **Node.js (Express)** y **Java (Spring Boot 3)**. Ambos servicios están diseñados para operar con una base de datos **Oracle** y consumen un sistema de seguridad basado en **JWT (JSON Web Tokens)**.

## 🚀 Arquitectura del Proyecto

El ecosistema se divide en dos microservicios independientes que mantienen paridad de funcionalidades y lógica de negocio.

## 🗄️ Configuración de Base de Datos (Oracle)

Antes de ejecutar cualquiera de los backends, es imperatriz preparar el esquema de base de datos. Se han incluido scripts SQL optimizados para **Oracle Database**.

### Carpeta de Database Scripts: `/db_sql_scripts` 

Sigue este orden de ejecución para garantizar la integridad de los datos:

1.  **`ddl_schema.sql`**: Define el usuario y los permisos iniciales.
2.  **`ddl_creation.sql`**: Define la estructura de la tabla `PACIENTES`, incluyendo constraints de llave primaria, tipos de datos y restricciones de auditoría.
3.  **`dml_data.sql`**: Contiene los datos iniciales para poder cargar un registro de paciente.

### Conexión
Asegúrate de actualizar los datos de conexión en el archivo de configuración correspondiente de cada backend:

* **Spring Boot**: `src/main/resources/application.properties`
* **Node.js**: `.env`

```properties
# Ejemplo de configuración
spring.datasource.url=jdbc:oracle:thin:@tu_host:1521:xe
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

```.env
# Ejemplo de configuración
DB_HOST=127.0.0.1  
DB_PORT=1521
DB_USER=tu_usuario
DB_PASS=tu_password
DB_NAME=XE
```

### 1. Backend Node.js
*   **Tecnologías**: TypeScript, Express, TypeORM.
*   **Validación**: Middleware personalizado `SchemaValidator.ts` para la integridad de datos de entrada.
*   **Enfoque**: Desarrollo ágil y asíncrono.

### 2. Backend Spring Boot
*   **Tecnologías**: Java 17, Spring Data JPA, Hibernate, Spring Security.
*   **Validación**: Bean Validation con manejo global de excepciones mediante `@RestControllerAdvice`.
*   **Enfoque**: Robustez, tipado fuerte y escalabilidad empresarial.

---

## 🛠️ Endpoints de la API

Ambos backends comparten el mismo formato, seguridad e integridad.

### Seguridad
*   **POST** `/auth/login`
    *   **Propósito**: Autenticación de usuario y generación de token.
    *   **Body**: `{"username": "admin", "password": "..."}`

### Pacientes (Protegidos por Bearer Token)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/patient/all` | Lista todos los pacientes activos. |
| **GET** | `/patient/find/{cedula}` | Busca un paciente por su número de identificación. |
| **GET** | `/patient/search?term={query}` | Búsqueda optimizada por nombre o apellido. |
| **POST** | `/patient/create` | Registra un nuevo paciente con validaciones de esquema. |
| **PUT** | `/patient/update/{id}` | Actualiza la información de un paciente existente. |
| **DELETE** | `/patient/delete/{id}` | Realiza un borrado lógico (Estado 'I'). |

---

## 📦 Estructura de Datos (JSON)

Para las operaciones de **Crear** y **Actualizar**, se espera el siguiente objeto:

```json
{
  "codigoTipoIdentificacion": "CED",
  "numeroIdentificacion": "0201038765",
  "primerNombre": "Luis",
  "segundoNombre": "Andres",
  "primerApellido": "Garcia",
  "segundoApellido": "Paez",
  "email": "lucho292@example.net",
  "estado": "A"
}
```

---

## 📝 Notas Técnicas y Decisiones de Arquitectura

*   **Borrado Lógico**: El sistema no elimina registros físicamente para preservar la integridad referencial en Oracle. Se utiliza un cambio de estado a 'I' (Inactivo).
*   **Campos Calculados**: El campo `nombreCompleto` se genera automáticamente en la capa de servicio para garantizar consistencia en los reportes.
*   **Known Issues**: En el ambiente de pruebas con Oracle, ciertos registros pre-existentes cuentan con restricciones de integridad que impiden su modificación directa. Los registros creados a través de la API funcionan al 100%.

---

## 🔑 Credenciales de Acceso (Entorno de Pruebas)

Para facilitar la evaluación de los endpoints protegidos en ambos backends (**Node.js** y **Spring Boot**), se han configurado credenciales estáticas de acceso. Estas credenciales deben utilizarse en el endpoint de `/auth/login` para obtener el **Bearer Token** necesario.

*   **Usuario**: `VERIS`
*   **Contraseña**: `PRUEBAS123`

> **Nota de Seguridad**: Por fines estrictamente demostrativos para esta prueba técnica, estas credenciales se encuentran integradas en la lógica de autenticación. En un entorno productivo, se recomienda el uso de **Oracle Identity Management** o el cifrado de contraseñas mediante **BCrypt** con almacenamiento en base de datos.

---

## 🔧 Configuración de Entorno

1.  Clonar el repositorio.
2.  Configurar las credenciales de la base de datos Oracle en `application.properties` (Java) o `.env` (Node).
3.  Ejecutar el comando de inicio:
    *   **Java**: `mvn spring-boot:run`
    *   **Node**: `npm run dev`

---

**Autor**: Alex Daniel Jordan Veliz
- *Líder Técnico & Arquitecto de Soluciones & FullStack Senior*