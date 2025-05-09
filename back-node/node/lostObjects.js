import express from 'express';
import cors from 'cors';
import { sequelize } from "./models/index.js";
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const PORT = process.env.NODE_LOST_OBJECT_PORT || 3005;
app.use(bodyParser.json());
app.use(cors());
sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});