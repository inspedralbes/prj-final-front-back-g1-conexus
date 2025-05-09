import express from 'express';
import cors from 'cors';
import { sequelize } from "./models/index.js";
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import roomRoutes from './routes/roomRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import RoomReservation from './routes/roomReservationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.NODE_ROOM_PORT || 3006;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/rooms", roomRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/roomReservations", RoomReservation);

sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
