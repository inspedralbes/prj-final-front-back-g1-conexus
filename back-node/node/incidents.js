import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './models/index.js';
import reportRoutes from "./routes/reportRoutes.js";
import nodemailer from 'nodemailer';

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
        console.error('Error amb el transportador de correu:', error);
    } else {
        console.log('Transportador de correu preparat');
    }
});

app.use(bodyParser.json());
app.use(cors());
app.use('/api/uploads', express.static('uploads'));
app.use("/api/reports", reportRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor executant-se al port ${PORT}`);
    });
})
