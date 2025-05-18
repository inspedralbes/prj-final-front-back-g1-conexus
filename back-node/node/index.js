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
import {
    startService,
    stopService,
    startAllServices,
    stopAllServices,
    getServiceStatus,
    getAllServicesStatus,
    addService
} from "./serviceManager.js";
import { getLatestUser } from './routes/userRoutes.js';
import { getLatestCourse } from './routes/courseRoutes.js';
import { getLatestReport } from './routes/reportRoutes.js';
import { getLatestLostObject } from './routes/lostObjectRoutes.js';
import { getLatestRoomReservation } from './routes/roomReservationRoutes.js';
import { getLatestTask } from './routes/taskRoutes.js';
import { verifyTokenMiddleware } from "./token.js";

// Importar multer para manejar la subida de archivos
import multer from "multer";
import taskRoutes from "./routes/taskRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import mongoose from 'mongoose';
import './models/Message.js';  // Import to register the Message model

// import { startService, stopService, startAllServices, stopAllServices, getServiceStatus, getAllServicesStatus } from "./serviceManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Guardar en el mismo directorio que index.js
        cb(null, __dirname);
    },
    filename: function (req, file, cb) {
        // Usar el nombre enviado o el original del archivo
        const serviceName = req.body.name || path.parse(file.originalname).name;
        cb(null, `${serviceName}.js`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        // Verificar que sea un archivo JavaScript
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.js') {
            return callback(new Error('Solo se permiten archivos JavaScript (.js)'));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 // Límite de 1MB
    }
});

const app = express();
const PORT = process.env.NODE_PORT || 3000;

// Configuración de MongoDB - URL correcta según el compose.yaml
const MONGODB_URI = process.env.NODE_MONGODB_URI || 'mongodb://root:password@conexus-hub-mongodb:27017/chat';

// Conectar a MongoDB
console.log("Intentando conectar a MongoDB en:", MONGODB_URI);
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
}).then(() => {
    console.log("Conectado a MongoDB");
}).catch(err => {
    console.error("Error al conectar a MongoDB:", err);
});

// Middleware
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

startAllServices();

// Rutas para gestionar los servicios
app.get("/api/services", verifyTokenMiddleware, (req, res) => {
    res.json(getAllServicesStatus());
});

app.get("/api/services/:serviceName", verifyTokenMiddleware, (req, res) => {
    const status = getServiceStatus(req.params.serviceName);
    if (status) {
        res.json(status);
    } else {
        res.status(404).json({ error: "Servicio no encontrado" });
    }
});

app.post("/api/services/start-all", verifyTokenMiddleware, (req, res) => {
    const results = startAllServices();
    res.json({ message: "Iniciando todos los servicios", results });
});

app.post("/api/services/stop-all",verifyTokenMiddleware, (req, res) => {
    const results = stopAllServices();
    res.json({ message: "Deteniendo todos los servicios", results });
});

app.post("/api/services/:serviceName/start", verifyTokenMiddleware, (req, res) => {
    const result = startService(req.params.serviceName);
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

app.post("/api/services/:serviceName/stop", verifyTokenMiddleware, (req, res) => {
    const result = stopService(req.params.serviceName);
    if (result.success) {
        res.json(result);
    } else {
        res.status(400).json(result);
    }
});

// Iniciar todos los servicios cuando la aplicación se inicia
if (process.env.NODE_ENV === 'development') {
    console.log('Iniciando servicios en modo desarrollo con nodemon...');
} else {
    console.log('Iniciando servicios en modo producción...');
}
app.use("/api/chat", chatRoutes);

// // startAllServices();

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

// Endpoint para crear un nuevo servicio
app.post("/api/services", verifyTokenMiddleware, (req, res) => {
    const { name, script, description, tech, port, autoStart } = req.body;

    if (!name || !script) {
        return res.status(400).json({ success: false, message: "El nombre y el script son obligatorios" });
    }

    try {
        const result = addService(name, script, {
            name: description || `Servei ${name}`,
            tech: tech || 'Node.js 18.x',
            port: port || null
        });

        if (result.success && autoStart) {
            startService(name);
        }

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint para eliminar un servicio
app.delete("/api/services/:serviceName", verifyTokenMiddleware, async (req, res) => {
    const serviceName = req.params.serviceName;
    try {
        // Asegurarse de que el servicio esté detenido primero
        const service = getServiceStatus(serviceName);
        if (service && service.state === 'running') {
            stopService(serviceName);
        }

        // Importar la función para eliminar servicios
        const { deleteService } = await import("./serviceManager.js");
        const result = deleteService(serviceName);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error al eliminar el servicio: ${error.message}`
        });
    }
});

// Nuevo endpoint para subir un archivo JavaScript como servicio
app.post("/api/services/upload", verifyTokenMiddleware, upload.single('file'), async (req, res) => {
    try {
        const { name, description, tech, autoStart } = req.body;

        if (!name || !req.file) {
            return res.status(400).json({
                success: false,
                message: "El nombre y el archivo son obligatorios"
            });
        }

        // Obtener el nombre del archivo subido
        const filename = req.file.filename;

        // Añadir el servicio utilizando la función existente
        const result = addService(name, filename, {
            name: description || `Servei ${name}`,
            tech: tech || 'Node.js 18.x'
        });

        // Si se solicita, iniciar el servicio automáticamente
        if (result.success && autoStart === 'true') {
            startService(name);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error en la subida del archivo:', error);
        res.status(500).json({
            success: false,
            message: `Error al crear el servicio: ${error.message}`
        });
    }
});

// Rutas para saber las ultimas actividades
app.get("/api/activities", verifyTokenMiddleware, async (req, res) => {
    try {
        console.log("Obteniendo actividades recientes...");

        // Array para almacenar los resultados
        const activities = [];

        // Obtener las últimas actividades directamente mediante funciones
        try {
            const latestUser = await getLatestUser();
            if (latestUser) {
                activities.push({
                    type: "user",
                    data: latestUser
                });
                console.log("Datos de usuario más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener usuario reciente:", error.message);
        }

        try {
            const latestCourse = await getLatestCourse();
            if (latestCourse) {
                activities.push({
                    type: "course",
                    data: latestCourse
                });
                console.log("Datos de curso más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener curso reciente:", error.message);
        }

        try {
            const latestReport = await getLatestReport();
            if (latestReport) {
                activities.push({
                    type: "report",
                    data: latestReport
                });
                console.log("Datos de incidencia más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener incidencia reciente:", error.message);
        }

        try {
            const latestLostObject = await getLatestLostObject();
            if (latestLostObject) {
                activities.push({
                    type: "lostObject",
                    data: latestLostObject
                });
                console.log("Datos de objeto perdido más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener objeto perdido reciente:", error.message);
        }

        try {
            const latestRoomReservation = await getLatestRoomReservation();
            if (latestRoomReservation) {
                activities.push({
                    type: "roomReservation",
                    data: latestRoomReservation
                });
                console.log("Datos de reserva más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener reserva reciente:", error.message);
        }

        try {
            const latestTask = await getLatestTask();
            if (latestTask) {
                activities.push({
                    type: "task",
                    data: latestTask
                });
                console.log("Datos de tarea más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener tarea reciente:", error.message);
        }

        // Ordenar por fecha más reciente
        activities.sort((a, b) => {
            const dateA = new Date(a.data.createdAt || 0);
            const dateB = new Date(b.data.createdAt || 0);
            return dateB - dateA;
        });

        console.log(`Total de actividades obtenidas: ${activities.length}`);
        res.json(activities);
    } catch (error) {
        console.error('Error obteniendo últimas actividades:', error);
        res.status(500).json({
            message: 'Error obteniendo últimas actividades',
            error: error.message
        });
    }
});

// Endpoint para crear un nuevo servicio
app.post("/api/services", (req, res) => {
    const { name, script, description, tech, port, autoStart } = req.body;

    if (!name || !script) {
        return res.status(400).json({ success: false, message: "El nombre y el script son obligatorios" });
    }

    try {
        const result = addService(name, script, {
            name: description || `Servei ${name}`,
            tech: tech || 'Node.js 18.x',
            port: port || null
        });

        if (result.success && autoStart) {
            startService(name);
        }

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint para eliminar un servicio
app.delete("/api/services/:serviceName", async (req, res) => {
    const serviceName = req.params.serviceName;
    try {
        // Asegurarse de que el servicio esté detenido primero
        const service = getServiceStatus(serviceName);
        if (service && service.state === 'running') {
            stopService(serviceName);
        }

        // Importar la función para eliminar servicios
        const { deleteService } = await import("./serviceManager.js");
        const result = deleteService(serviceName);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error al eliminar el servicio: ${error.message}`
        });
    }
});

// Nuevo endpoint para subir un archivo JavaScript como servicio
app.post("/api/services/upload", upload.single('file'), async (req, res) => {
    try {
        const { name, description, tech, autoStart } = req.body;

        if (!name || !req.file) {
            return res.status(400).json({
                success: false,
                message: "El nombre y el archivo son obligatorios"
            });
        }

        // Obtener el nombre del archivo subido
        const filename = req.file.filename;

        // Añadir el servicio utilizando la función existente
        const result = addService(name, filename, {
            name: description || `Servei ${name}`,
            tech: tech || 'Node.js 18.x'
        });

        // Si se solicita, iniciar el servicio automáticamente
        if (result.success && autoStart === 'true') {
            startService(name);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error en la subida del archivo:', error);
        res.status(500).json({
            success: false,
            message: `Error al crear el servicio: ${error.message}`
        });
    }
});

// Rutas para saber las ultimas actividades
app.get("/api/activities", async (req, res) => {
    try {
        console.log("Obteniendo actividades recientes...");

        // Array para almacenar los resultados
        const activities = [];

        // Obtener las últimas actividades directamente mediante funciones
        try {
            const latestUser = await getLatestUser();
            if (latestUser) {
                activities.push({
                    type: "user",
                    data: latestUser
                });
                console.log("Datos de usuario más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener usuario reciente:", error.message);
        }

        try {
            const latestCourse = await getLatestCourse();
            if (latestCourse) {
                activities.push({
                    type: "course",
                    data: latestCourse
                });
                console.log("Datos de curso más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener curso reciente:", error.message);
        }

        try {
            const latestReport = await getLatestReport();
            if (latestReport) {
                activities.push({
                    type: "report",
                    data: latestReport
                });
                console.log("Datos de incidencia más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener incidencia reciente:", error.message);
        }

        try {
            const latestLostObject = await getLatestLostObject();
            if (latestLostObject) {
                activities.push({
                    type: "lostObject",
                    data: latestLostObject
                });
                console.log("Datos de objeto perdido más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener objeto perdido reciente:", error.message);
        }

        try {
            const latestRoomReservation = await getLatestRoomReservation();
            if (latestRoomReservation) {
                activities.push({
                    type: "roomReservation",
                    data: latestRoomReservation
                });
                console.log("Datos de reserva más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener reserva reciente:", error.message);
        }

        try {
            const latestTask = await getLatestTask();
            if (latestTask) {
                activities.push({
                    type: "task",
                    data: latestTask
                });
                console.log("Datos de tarea más reciente obtenidos");
            }
        } catch (error) {
            console.error("Error al obtener tarea reciente:", error.message);
        }

        // Ordenar por fecha más reciente
        activities.sort((a, b) => {
            const dateA = new Date(a.data.createdAt || 0);
            const dateB = new Date(b.data.createdAt || 0);
            return dateB - dateA;
        });

        console.log(`Total de actividades obtenidas: ${activities.length}`);
        res.json(activities);
    } catch (error) {
        console.error('Error obteniendo últimas actividades:', error);
        res.status(500).json({
            message: 'Error obteniendo últimas actividades',
            error: error.message
        });
    }
});

app.use("/api/chat", chatRoutes);

// Iniciar servidor

// Iniciar servidor
sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Servidor principal ejecutándose en el puerto ${PORT}`);
        console.log(`Para gestionar servicios, usa las rutas /api/services/`);
    });
});

console.log("Seaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaao", PORT);
