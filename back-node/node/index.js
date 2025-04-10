import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./models/index.js";
import dotenv from "dotenv";
import cors from "cors";
// import { verifyTokenMiddleware } from "./token.js";
import path from "path";

import { fileURLToPath } from "url";
import lostObjectRoutes from "./routes/lostObjectRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import roomReservationRoutes from "./routes/roomReservationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.NODE_PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

app.use("/lost-objects", lostObjectRoutes);
app.use("/reports", reportRoutes);
app.use("/responses", responseRoutes);
app.use("/room-reservations", roomReservationRoutes);
sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});