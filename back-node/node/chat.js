import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import http from 'http';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.NODE_CHAT_PORT || 3007;

app.use(bodyParser.json());
app.use(cors());

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

mongoose.connect(process.env.NODE_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    dbName: "chat"
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

const messageSchema = new mongoose.Schema({
    name: String,
    teachers: [Number],
    interaction: [
        {
            teacherId: String,
            message: String,
            date: Date
        }
    ]
});

mongoose.model("Message", messageSchema);

app.use("/api/chat", chatRoutes);

// Change from app.listen to server.listen to use with Socket.io
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
