import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import {sequelize} from "./models/index.js";
import lostObjectRoutes from "./routes/lostObjectRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.NODE_LOST_OBJECT_PORT || 3005;

app.use(bodyParser.json());
app.use(cors());
app.use('/api/uploads', express.static('uploads'));
app.use("/api/lost-objects", lostObjectRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor executant-se al port ${PORT}`);
    });
}).catch((error) => {
    console.error("No s'ha pogut connectar a la base de dades:", error);
});