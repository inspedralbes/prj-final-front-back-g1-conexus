import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./models/index.js";
import assistenceRoutes from "./routes/assistenceRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import { verifyTokenMiddleware } from "./token.js";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.NODE_PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/assistences", assistenceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/grades", gradeRoutes);

sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});