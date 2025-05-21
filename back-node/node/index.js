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
import multer from "multer";
import chatRoutes from "./routes/chatRoutes.js";
import mongoose from 'mongoose';
import './models/Message.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname);
    },
    filename: function (req, file, cb) {
        const serviceName = req.body.name || path.parse(file.originalname).name;
        cb(null, `${serviceName}.js`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.js') {
            return callback(new Error('Només es permeten arxius JavaScript (.js)'));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024
    }
});

const app = express();
const PORT = process.env.NODE_PORT || 3000;
const MONGODB_URI = process.env.NODE_MONGODB_URI || 'mongodb://root:password@conexus-hub-mongodb:27017/chat';

console.log("Intentant connectar a MongoDB a:", MONGODB_URI);
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
}).then(() => {
    console.log("Connectat a MongoDB");
}).catch(err => {
    console.error("Error en connectar a MongoDB:", err);
});

app.use(bodyParser.json());
app.use(cors());
app.use('/api/uploads', express.static('uploads'));
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
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === 'development') {
    console.log('Iniciant serveis en mode desenvolupament amb nodemon...');
} else {
    console.log('Iniciant serveis en mode producció...');
}

startAllServices();

app.get("/api/services", verifyTokenMiddleware, (req, res) => {
    res.json(getAllServicesStatus());
});

app.get("/api/services/:serviceName", verifyTokenMiddleware, (req, res) => {
    const status = getServiceStatus(req.params.serviceName);
    if (status) {
        res.json(status);
    } else {
        res.status(404).json({ error: "Servei no trobat" });
    }
});

app.post("/api/services/start-all", verifyTokenMiddleware, (req, res) => {
    const results = startAllServices();
    res.json({ message: "Iniciant tots els serveis", results });
});

app.post("/api/services/stop-all", verifyTokenMiddleware, (req, res) => {
    const results = stopAllServices();
    res.json({ message: "Aturant tots els serveis", results });
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

app.post("/api/services", verifyTokenMiddleware, (req, res) => {
    const { name, script, description, tech, port, autoStart } = req.body;

    if (!name || !script) {
        return res.status(400).json({ success: false, message: "El nom i l'script són obligatoris" });
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

app.delete("/api/services/:serviceName", verifyTokenMiddleware, async (req, res) => {
    const serviceName = req.params.serviceName;
    try {
        const service = getServiceStatus(serviceName);
        if (service && service.state === 'running') {
            stopService(serviceName);
        }

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
            message: `Error en eliminar el servei: ${error.message}`
        });
    }
});

app.post("/api/services/upload", verifyTokenMiddleware, upload.single('file'), async (req, res) => {
    try {
        const { name, description, tech, autoStart } = req.body;

        if (!name || !req.file) {
            return res.status(400).json({
                success: false,
                message: "El nom i l'arxiu són obligatoris"
            });
        }

        const filename = req.file.filename;
        const result = addService(name, filename, {
            name: description || `Servei ${name}`,
            tech: tech || 'Node.js 18.x'
        });

        if (result.success && autoStart === 'true') {
            startService(name);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error("Error en la pujada de l'arxiu:", error);
        res.status(500).json({
            success: false,
            message: `Error en crear el servei: ${error.message}`
        });
    }
});

app.get("/api/activities", verifyTokenMiddleware, async (req, res) => {
    try {
        console.log("Obtenint activitats recents...");
        const activities = [];

        try {
            const latestUser = await getLatestUser();
            if (latestUser) {
                activities.push({
                    type: "user",
                    data: latestUser
                });
                console.log("Dades d'usuari més recent obtingudes");
            }
        } catch (error) {
            console.error("Error en obtenir usuari recent:", error.message);
        }

        try {
            const latestCourse = await getLatestCourse();
            if (latestCourse) {
                activities.push({
                    type: "course",
                    data: latestCourse
                });
                console.log("Dades de curs més recent obtingudes");
            }
        } catch (error) {
            console.error("Error en obtenir curs recent:", error.message);
        }

        try {
            const latestReport = await getLatestReport();
            if (latestReport) {
                activities.push({
                    type: "report",
                    data: latestReport
                });
                console.log("Dades d'incidència més recent obtingudes");
            }
        } catch (error) {
            console.error("Error en obtenir incidència recent:", error.message);
        }

        try {
            const latestLostObject = await getLatestLostObject();
            if (latestLostObject) {
                activities.push({
                    type: "lostObject",
                    data: latestLostObject
                });
                console.log("Dades d'objecte perdut més recent obtingudes");
            }
        } catch (error) {
            console.error("Error en obtenir objecte perdut recent:", error.message);
        }

        try {
            const latestRoomReservation = await getLatestRoomReservation();
            if (latestRoomReservation) {
                activities.push({
                    type: "roomReservation",
                    data: latestRoomReservation
                });
                console.log("Dades de reserva més recent obtingudes");
            }
        } catch (error) {
            console.error("Error en obtenir reserva recent:", error.message);
        }

        try {
            const latestTask = await getLatestTask();
            if (latestTask) {
                activities.push({
                    type: "task",
                    data: latestTask
                });
                console.log("Dades de tasca més recent obtingudes");
            }
        } catch (error) {
            console.error("Error en obtenir tasca recent:", error.message);
        }

        activities.sort((a, b) => {
            const dateA = new Date(a.data.createdAt || 0);
            const dateB = new Date(b.data.createdAt || 0);
            return dateB - dateA;
        });

        console.log(`Total d'activitats obtingudes: ${activities.length}`);
        res.json(activities);
    } catch (error) {
        console.error("Error obtenint últimes activitats:", error);
        res.status(500).json({
            message: "Error obtenint últimes activitats",
            error: error.message
        });
    }
});

sequelize.sync().then(() => {
    console.log("Base de dades sincronitzada");
    app.listen(PORT, () => {
        console.log(`Servidor principal executant-se al port ${PORT}`);
        console.log(`Per gestionar serveis, usa les rutes /api/services/`);
    });
});
