import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import socket from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.NODE_CHAT_PORT || 3007;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.NODE_MONGO_URI, {
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

const io = socket(app);

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

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
