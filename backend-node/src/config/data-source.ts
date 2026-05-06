import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { TipoIdentificacion } from "../entities/TipeIdentification";
import { Paciente } from "../entities/Patient";

dotenv.config(); 

export const AppDataSource = new DataSource({
    type: "oracle",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 1521,
    username: process.env.DB_USER || "SYSTEM",
    password: process.env.DB_PASS || "Test2026",
    database: process.env.DB_NAME || "XE",
    synchronize: false,
    logging: true,
    entities: [TipoIdentificacion, Paciente],
    extra: {
        // Formato => EZConnect: Host: Puerto / Servicio
        connectString: `${process.env.DB_HOST || "127.0.0.1"}:${process.env.DB_PORT || 1521}/${process.env.DB_NAME || "XE"}`
    }
});