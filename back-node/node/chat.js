import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import http from 'http';
import chatRoutes from './routes/chatRoutes.js';
import './models/Message.js';  

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST", "DELETE"]
    }
});
const PORT = process.env.NODE_CHAT_PORT || 3007;
const MONGODB_URI = process.env.NODE_MONGODB_URI || 'mongodb://root:password@conexus-hub-mongodb:27017/chat';
const API_URL = process.env.VITE_CHAT_URL;

app.use(bodyParser.json());
app.use(cors());

const connectedUsers = new Map(); 
const userSockets = new Map(); 
const activeRooms = new Map(); 

io.on("connection", (socket) => {
    console.log("Nou client connectat:", socket.id);

    socket.on("register_user", (userData) => {
        const { userId, userName } = userData;
        console.log(`Usuari ${userName} (${userId}) s'ha registrat`);
        connectedUsers.set(userId, socket.id);
        userSockets.set(socket.id, userId);
        socket.join(`user:${userId}`);
        console.log(`Usuari ${userName} (${userId}) unit a sala personal user:${userId}`);
        socket.emit("registered", {
            success: true,
            userId,
            message: "Connectat correctament"
        });
    });

    socket.on("join_chat", (data) => {
        const { chatId, userId, userName } = data;
        console.log(`Usuari ${userName} (${userId}) s'uneix al xat ${chatId}`);
        socket.join(chatId);
        if (!activeRooms.has(chatId)) {
            activeRooms.set(chatId, new Set());
        }
        activeRooms.get(chatId).add(socket.id);
        socket.to(chatId).emit("user_joined", {
            userId,
            userName,
            chatId,
            timestamp: new Date()
        });
    });

    socket.on("send_message", async (data) => {
        const { chatId, message, userId, userName } = data;
        console.log(`Missatge de ${userName} al xat ${chatId}: ${message}`);
        try {
            const response = await fetch(`${API_URL}api/chat/${chatId}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    teacherId: userId,
                    message: message
                })
            });

            if (!response.ok) {
                throw new Error(`Error en desar missatge: ${response.statusText}`);
            }

            const savedMessage = await response.json();
            const lastInteractionIndex = savedMessage.interaction.length - 1;
            const newMessageData = lastInteractionIndex >= 0 ? savedMessage.interaction[lastInteractionIndex] : null;

            if (newMessageData) {
                io.to(chatId).emit("new_message", {
                    id: newMessageData._id,
                    chatId,
                    userId,
                    userName,
                    message,
                    timestamp: new Date()
                });
            } else {
                console.error("No s'ha pogut obtenir l'últim missatge desat");
                socket.emit("error", {
                    type: "message_error",
                    message: "Error en processar el missatge desat"
                });
            }
        } catch (error) {
            console.error("Error en desar missatge:", error);
            socket.emit("error", {
                type: "message_error",
                message: "No s'ha pogut desar el missatge"
            });
        }
    });

    socket.on("typing", (data) => {
        const { chatId, userId, userName, isTyping } = data;
        socket.to(chatId).emit("user_typing", {
            userId,
            userName,
            isTyping,
            chatId
        });
    });

    socket.on("first_message_sent", async (data) => {
        const { chatId, userId, userName, message } = data;
        console.log(`Primer missatge al xat ${chatId} de ${userName} (${userId}): ${message}`);
        try {
            const chatDataResponse = await fetch(`${API_URL}api/chat/${chatId}`);

            if (!chatDataResponse.ok) {
                throw new Error(`Error en obtenir dades del xat: ${chatDataResponse.statusText}`);
            }

            const chatData = await chatDataResponse.json();

            if (chatData && chatData.teachers && Array.isArray(chatData.teachers)) {
                chatData.teachers.forEach(teacherId => {
                    if (teacherId.toString() !== userId.toString()) {
                        io.to(`user:${teacherId}`).emit('chat_first_message', {
                            chatId,
                            userId,
                            userName,
                            message,
                            timestamp: new Date(),
                            chatData: chatData
                        });
                        console.log(`Notificació de primer missatge enviada al professor ${teacherId}`);
                    }
                });
            }

            socket.to(chatId).emit('chat_first_message', {
                chatId,
                userId,
                userName,
                message,
                timestamp: new Date(),
                chatData: chatData
            });
        } catch (error) {
            console.error("Error en processar primer missatge:", error);
            socket.emit("error", {
                type: "first_message_error",
                message: "Error en processar la notificació del primer missatge"
            });
        }
    });

    socket.on("delete_message", async (data) => {
        const { chatId, messageId, userId } = data;
        try {
            let messageContent = null;
            let messageDate = null;
            let teacherId = null;

            try {
                const chatResponse = await fetch(`${API_URL}api/chat/${chatId}`);
                if (chatResponse.ok) {
                    const chatData = await chatResponse.json();
                    if (chatData && chatData.interaction) {
                        const msgToDelete = chatData.interaction.find(msg =>
                            msg._id && msg._id.toString() === messageId
                        );
                        if (msgToDelete) {
                            messageContent = msgToDelete.message;
                            messageDate = msgToDelete.date;
                            teacherId = msgToDelete.teacherId;
                        }
                    }
                }
            } catch (fetchError) {
                console.log("Error en obtenir contingut del missatge:", fetchError);
            }

            const response = await fetch(`${API_URL}api/chat/${chatId}/message/${messageId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Error en eliminar missatge: ${response.statusText}`);
            }

            const deletedData = await response.json();

            io.to(chatId).emit("message_deleted", {
                chatId,
                messageId,
                deletedBy: userId,
                timestamp: new Date(),
                messageContent: messageContent,
                messageDate: messageDate,
                teacherId: teacherId,
                deleted: true
            });

            console.log(`Missatge ${messageId} eliminat i notificat a tots els usuaris a la sala ${chatId}`);
        } catch (error) {
            console.error("Error en eliminar missatge:", error);
            socket.emit("error", {
                type: "delete_error",
                message: "Error en eliminar el missatge"
            });
        }
    });

    socket.on("delete_chat", async (data) => {
        const { chatId, userId } = data;
        try {
            const response = await fetch(`${API_URL}api/chat/${chatId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Error en eliminar xat: ${response.statusText}`);
            }

            io.to(chatId).emit("chat_deleted", {
                chatId,
                deletedBy: userId,
                timestamp: new Date()
            });

            const socketsInRoom = await io.in(chatId).fetchSockets();
            socketsInRoom.forEach(s => s.leave(chatId));

            if (activeRooms.has(chatId)) {
                activeRooms.delete(chatId);
            }
        } catch (error) {
            console.error("Error en eliminar xat:", error);
            socket.emit("error", {
                type: "delete_error",
                message: "Error en eliminar el xat"
            });
        }
    });

    socket.on("leave_chat", (data) => {
        const { chatId, userId, userName } = data;
        handleUserLeavingChat(socket, chatId, userId, userName);
    });

    socket.on("disconnect", () => {
        const userId = userSockets.get(socket.id);
        console.log(`Client desconnectat: ${socket.id}, Usuari: ${userId || 'desconegut'}`);

        if (userId) {
            connectedUsers.delete(userId);
            userSockets.delete(socket.id);
            socket.leave(`user:${userId}`);

            for (const [chatId, socketIds] of activeRooms.entries()) {
                if (socketIds.has(socket.id)) {
                    handleUserLeavingChat(socket, chatId, userId, "Usuari");
                }
            }
        }
    });
});

function handleUserLeavingChat(socket, chatId, userId, userName) {
    console.log(`Usuari ${userName} (${userId}) surt del xat ${chatId}`);
    socket.leave(chatId);

    if (activeRooms.has(chatId)) {
        const socketIds = activeRooms.get(chatId);
        socketIds.delete(socket.id);

        if (socketIds.size === 0) {
            activeRooms.delete(chatId);
            console.log(`Sala ${chatId} destruïda - no queden usuaris`);
        } else {
            socket.to(chatId).emit("user_left", {
                userId,
                userName,
                chatId,
                timestamp: new Date()
            });
        }
    }
}

app.set('socketio', io);
app.use("/api/chat", chatRoutes);

async function createSampleChat() {
    try {
        console.log("Intentant connectar a MongoDB a:", MONGODB_URI);

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log("Connectat a MongoDB");

        const Message = mongoose.model("Message");

        console.log("Verificant col·lecció de missatges...");
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Col·leccions disponibles:", collections.map(c => c.name).join(", "));

        const sampleChat = new Message({
            name: "Xat privat d'exemple",
            teachers: [101, 202],
            interaction: [
                {
                    teacherId: "101",
                    message: "Hola, com estàs?",
                    date: new Date()
                },
                {
                    teacherId: "202",
                    message: "Molt bé, gràcies per preguntar",
                    date: new Date(Date.now() - 3600000)
                },
                {
                    teacherId: "101",
                    message: "Et ve de gust reunir-nos demà?",
                    date: new Date(Date.now() - 1800000)
                }
            ]
        });

        console.log("Intentant desar el xat de mostra...");
        const savedChat = await sampleChat.save();
        console.log("Xat de mostra creat amb èxit:");
        console.log(JSON.stringify(savedChat, null, 2));

        const allChats = await Message.find();
        console.log(`\nTotal de xats a la base de dades: ${allChats.length}`);
    } catch (err) {
        console.log("Error en crear el xat de mostra:", err);
    }
}

server.listen(PORT, () => {
    console.log(`Servidor de xat executant-se al port ${PORT}`);
    createSampleChat();
});

function getUsersInRoom(chatId) {
    if (!activeRooms.has(chatId)) {
        return [];
    }

    const userIds = [];
    const socketIds = activeRooms.get(chatId);

    for (const socketId of socketIds) {
        const userId = userSockets.get(socketId);
        if (userId) {
            userIds.push(userId);
        }
    }

    return userIds;
}
