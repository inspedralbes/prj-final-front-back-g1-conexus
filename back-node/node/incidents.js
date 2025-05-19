import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';

import assistenceRoutes from './routes/assistenceRoutes.js';
import reportRoutes from "./routes/reportRoutes.js";
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.NODE_INCIDENT_PORT || 3004;
const transporter = nodemailer.createTransport({
    service: 'smtp.gmail.com',
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error with email transporter:', error);
    } else {
        console.log('Email transporter is ready');
    }
});

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use("/api/reports", reportRoutes);
// app.use("/api/reports", reportRoutes);
// app.use("/incident/api/reports", reportRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
