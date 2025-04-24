import express from 'express';
import cors from 'cors';
import { sequelize } from "./models/index.js";
import gradeRoutes from './routes/gradeRoutes.js';
import dotenv from 'dotenv';
// Removed unused 'path' import
import bodyParser from 'body-parser';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.NODE_GRADE_PORT || 3003;
app.use(bodyParser.json());
app.use(cors());
app.use("/api/tasks", taskRoutes);   
app.use('/api/grades', gradeRoutes);
sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
app.get('/', (_, res) => {
    res.send('Hello World!');
});