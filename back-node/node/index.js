import express from "express";
import bodyParser from "body-parser";
import { sequelize } from "./models/index.js";
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

sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});