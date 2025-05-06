import express from 'express';
import cors from 'cors';
import { sequelize } from "./models/index.js";
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const PORT = process.env.NODE_CANTEEN_PORT || 3002;
app.use(bodyParser.json());
app.use(cors());
sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});