import express from "express";
import mongoose from "mongoose";
import { Server } from 'socket.io';

const router = express.Router();

// Obtener el modelo Message
const Message = mongoose.model("Message");

// Note: Socket.io should be initialized in the main server file, not in routes
// The following code is commented out as it needs app which isn't available here
// const io = new Server(app);
// 
// io.on("connection", (socket) => {
//     console.log("New client connected");
// 
//     socket.on("disconnect", () => {
//         console.log("Client disconnected");
//     });
// });

// Obtener todos los chats
router.get("/", async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un chat específico por nombre
router.get("/:name", async (req, res) => {
    try {
        const message = await Message.findOne({ name: req.params.name });
        if (!message) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo chat
router.post("/", async (req, res) => {
    const message = new Message({
        name: req.body.name,
        teachers: req.body.teachers || [],
        interaction: req.body.interaction || []
    });

    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Añadir un mensaje a un chat existente
router.post("/:name/message", async (req, res) => {
    try {
        const message = await Message.findOne({ name: req.params.name });
        if (!message) {
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        message.interaction.push({
            teacherId: req.body.teacherId,
            message: req.body.message,
            date: new Date()
        });

        const updatedMessage = await message.save();
        res.json(updatedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;

