import express from 'express';
import cors from 'cors';
import { sequelize } from "./models/index.js";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import assistenceRoutes from './routes/assistenceRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.NODE_ASSISTENCE_PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/assistences", assistenceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/departments", departmentRoutes);

sequelize.sync().then(() => {
    console.log("Base de dades sincronitzada");
    app.listen(PORT, () => {
        console.log(`Servidor executant-se al port ${PORT}`);
    });
});