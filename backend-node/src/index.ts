import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/AuthRoutes";
import patientRoutes from "./routes/PatientRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/patient", patientRoutes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("🚀 Conexión a Oracle establecida con éxito");
        app.listen(PORT, () => {
            console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error:any) => console.log("❌ Error en conexión a DB: ", error));


