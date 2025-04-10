import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./models/index.js";
import assistenceRoutes from "./routes/assistenceRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
// import { verifyTokenMiddleware } from "./token.js";
import path from "path";

import { fileURLToPath } from "url";
import lostObjectRoutes from "./routes/lostObjectRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import roomReservationRoutes from "./routes/roomReservationRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import typeUserRoutes from "./routes/typeUserRoutes.js";
import userCourseRoutes from "./routes/userCourseRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.NODE_PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/assistences", assistenceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/grades", gradeRoutes);

app.use("/api/lost-objects", lostObjectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/room-reservations", roomReservationRoutes);

app.use("/api/rooms", roomRoutes);
app.use("/api/type-users", typeUserRoutes);
app.use("/api/user-courses", userCourseRoutes);
app.use("/api/users", userRoutes);


sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});