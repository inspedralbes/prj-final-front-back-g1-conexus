import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./models/index.js";
import assistenceRoutes from "./routes/assistenceRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import reportRoutes from "./routes/reportRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import roomReservationRoutes from "./routes/roomReservationRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import typeUserRoutes from "./routes/typeUserRoutes.js";
import userCourseRoutes from "./routes/userCourseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { startService, stopService, startAllServices, stopAllServices, getServiceStatus, getAllServicesStatus } from "./serviceManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = process.env.NODE_PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use("/api/assistences", assistenceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/room-reservations", roomReservationRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/type-users", typeUserRoutes);
app.use("/api/user-courses", userCourseRoutes);
app.use("/api/user", userRoutes);

if (process.env.NODE_ENV === 'development') {
    console.log('Iniciando servicios en modo desarrollo con nodemon...');
} else {
    console.log('Iniciando servicios en modo producción...');
}

// startAllServices();

// Rutas para gestionar los servicios
app.get("/api/services", (req, res) => {
    res.json(getAllServicesStatus());
});

app.get("/api/services/:serviceName", (req, res) => {
    const status = getServiceStatus(req.params.serviceName);
    if (status) {
        res.json(status);
    } else {
        res.status(404).json({ error: "Servicio no encontrado" });
    }
});

app.post("/api/services/start-all", (req, res) => {
    const results = startAllServices();
    res.json({ message: "Iniciando todos los servicios", results });
});

app.post("/api/services/stop-all", (req, res) => {
    const results = stopAllServices();
    res.json({ message: "Deteniendo todos los servicios", results });
});

app.post("/api/services/:serviceName/start", (req, res) => {
    const result = startService(req.params.serviceName);
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

app.post("/api/services/:serviceName/stop", (req, res) => {
    const result = stopService(req.params.serviceName);
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Servidor principal ejecutándose en el puerto ${PORT}`);
        console.log(`Para gestionar servicios, usa las rutas /api/services/`);
    });
});