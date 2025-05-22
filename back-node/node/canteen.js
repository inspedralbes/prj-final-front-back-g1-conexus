import express from 'express';
import cors from 'cors';
import { sequelize } from "./models/index.js";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import CanteenItemRoute from './routes/CanteenItemRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.NODE_CANTEEN_PORT || 3002;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/canteen', CanteenItemRoute);

sequelize.sync().then(() => {
    console.log("Base de dades sincronitzada");
    app.listen(PORT, () => {
        console.log(`Servidor executant-se al port ${PORT}`);
    });
});