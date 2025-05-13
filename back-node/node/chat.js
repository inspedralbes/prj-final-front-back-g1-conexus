import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import http from 'http';
import chatRoutes from './routes/chatRoutes.js';
import './models/Message.js';  // Just import to register the model

// Obtener el directorio actual con ESM


dotenv.config();

const app = express();
const server = http.createServer(app);
// Configurar CORS para Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // En producción, limitar a orígenes específicos
        methods: ["GET", "POST", "DELETE"]
    }
});
const PORT = process.env.NODE_CHAT_PORT || 3007;


// Configuración de MongoDB - URL correcta según el compose.yaml
const MONGODB_URI = process.env.NODE_MONGODB_URI || 'mongodb://root:password@conexus-hub-mongodb:27017/chat';

app.use(bodyParser.json());
app.use(cors());

// Almacenar conexiones de usuarios
const connectedUsers = new Map(); // userId -> socketId
const userSockets = new Map(); // socketId -> userId
const activeRooms = new Map(); // chatId -> Set of socketIds

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    // Usuario se registra
    socket.on("register_user", (userData) => {
        const { userId, userName } = userData;
        console.log(`Usuario ${userName} (${userId}) se ha registrado`);

        // Registrar al usuario
        connectedUsers.set(userId, socket.id);
        userSockets.set(socket.id, userId);

        // Crear una sala específica para este usuario para notificaciones directas
        socket.join(`user:${userId}`);
        console.log(`Usuario ${userName} (${userId}) unido a sala personal user:${userId}`);

        socket.emit("registered", {
            success: true,
            userId,
            message: "Conectado correctamente"
        });
    });

    // Usuario se une a un chat existente
    socket.on("join_chat", (data) => {
        const { chatId, userId, userName } = data;
        console.log(`Usuario ${userName} (${userId}) se une al chat ${chatId}`);

        // Unir al usuario a la sala
        socket.join(chatId);

        // Registrar la room como activa
        if (!activeRooms.has(chatId)) {
            activeRooms.set(chatId, new Set());
        }
        activeRooms.get(chatId).add(socket.id);

        // Notificar a los demás usuarios en la sala
        socket.to(chatId).emit("user_joined", {
            userId,
            userName,
            chatId,
            timestamp: new Date()
        });
    });

    // Usuario envía un mensaje
    socket.on("send_message", async (data) => {
        const { chatId, message, userId, userName } = data;
        console.log(`Mensaje de ${userName} en chat ${chatId}: ${message}`);

        try {
            // Hacer una petición al API para guardar el mensaje
            // Esto usa las rutas existentes en lugar de duplicar la lógica
            const response = await fetch(`http://localhost:${PORT}/api/chat/${chatId}/message`, {
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
                throw new Error(`Error al guardar mensaje: ${response.statusText}`);
            }

            const savedMessage = await response.json();
            // Obtener el último mensaje añadido de forma segura
            const lastInteractionIndex = savedMessage.interaction.length - 1;
            const newMessageData = lastInteractionIndex >= 0 ? savedMessage.interaction[lastInteractionIndex] : null;

            if (newMessageData) {
                // Enviar a todos en la sala (incluido el remitente para confirmar)
                io.to(chatId).emit("new_message", {
                    id: newMessageData._id,
                    chatId,
                    userId,
                    userName,
                    message,
                    timestamp: new Date()
                });
            } else {
                console.error("No se pudo obtener el último mensaje guardado");
                socket.emit("error", {
                    type: "message_error",
                    message: "Error al procesar el mensaje guardado"
                });
            }
        } catch (error) {
            console.error("Error al guardar mensaje:", error);
            socket.emit("error", {
                type: "message_error",
                message: "No se pudo guardar el mensaje"
            });
        }
    });

    // Usuario está escribiendo
    socket.on("typing", (data) => {
        const { chatId, userId, userName, isTyping } = data;

        // Emitir a todos menos al remitente
        socket.to(chatId).emit("user_typing", {
            userId,
            userName,
            isTyping,
            chatId
        });
    });

    // Manejo del primer mensaje en un chat
    socket.on("first_message_sent", async (data) => {
        const { chatId, userId, userName, message } = data;
        console.log(`Primer mensaje en chat ${chatId} de ${userName} (${userId}): ${message}`);

        try {
            // Obtener información completa del chat
            const chatDataResponse = await fetch(`http://localhost:${PORT}/api/chat/${chatId}`);

            if (!chatDataResponse.ok) {
                throw new Error(`Error al obtener datos del chat: ${chatDataResponse.statusText}`);
            }

            const chatData = await chatDataResponse.json();

            // Notificar a todos los participantes del chat (excepto al remitente)
            if (chatData && chatData.teachers && Array.isArray(chatData.teachers)) {
                chatData.teachers.forEach(teacherId => {
                    if (teacherId.toString() !== userId.toString()) {
                        // Notificar a cada profesor mediante su sala personal
                        io.to(`user:${teacherId}`).emit('chat_first_message', {
                            chatId,
                            userId,
                            userName,
                            message,
                            timestamp: new Date(),
                            chatData: chatData
                        });
                        console.log(`Notificación de primer mensaje enviada al profesor ${teacherId}`);
                    }
                });
            }

            // También notificar a todos en la sala del chat
            socket.to(chatId).emit('chat_first_message', {
                chatId,
                userId,
                userName,
                message,
                timestamp: new Date(),
                chatData: chatData
            });
        } catch (error) {
            console.error("Error al procesar primer mensaje:", error);
            socket.emit("error", {
                type: "first_message_error",
                message: "Error al procesar la notificación del primer mensaje"
            });
        }
    });

    // Usuario elimina un mensaje
    socket.on("delete_message", async (data) => {
        const { chatId, messageId, userId } = data;

        try {
            // Hacer una petición al API para eliminar el mensaje
            const response = await fetch(`http://localhost:${PORT}/api/chat/${chatId}/message/${messageId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar mensaje: ${response.statusText}`);
            }

            // Notificar a todos en la sala
            io.to(chatId).emit("message_deleted", {
                chatId,
                messageId,
                deletedBy: userId,
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Error al eliminar mensaje:", error);
            socket.emit("error", {
                type: "delete_error",
                message: "Error al eliminar el mensaje"
            });
        }
    });

    // Usuario elimina un chat completo
    socket.on("delete_chat", async (data) => {
        const { chatId, userId } = data;

        try {
            // Hacer una petición al API para eliminar el chat
            const response = await fetch(`http://localhost:${PORT}/api/chat/${chatId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar chat: ${response.statusText}`);
            }

            // Notificar a todos en la sala
            io.to(chatId).emit("chat_deleted", {
                chatId,
                deletedBy: userId,
                timestamp: new Date()
            });

            // Cerrar la sala
            const socketsInRoom = await io.in(chatId).fetchSockets();
            socketsInRoom.forEach(s => s.leave(chatId));

            // Eliminar la sala de las salas activas
            if (activeRooms.has(chatId)) {
                activeRooms.delete(chatId);
            }
        } catch (error) {
            console.error("Error al eliminar chat:", error);
            socket.emit("error", {
                type: "delete_error",
                message: "Error al eliminar el chat"
            });
        }
    });

    // Usuario sale de un chat
    socket.on("leave_chat", (data) => {
        const { chatId, userId, userName } = data;
        handleUserLeavingChat(socket, chatId, userId, userName);
    });

    // Usuario se desconecta
    socket.on("disconnect", () => {
        const userId = userSockets.get(socket.id);
        console.log(`Cliente desconectado: ${socket.id}, Usuario: ${userId || 'desconocido'}`);

        if (userId) {
            // Limpiar registros de usuario
            connectedUsers.delete(userId);
            userSockets.delete(socket.id);

            // Salir de la sala personal
            socket.leave(`user:${userId}`);

            // Hacer que el usuario salga de todas las salas activas
            for (const [chatId, socketIds] of activeRooms.entries()) {
                if (socketIds.has(socket.id)) {
                    handleUserLeavingChat(socket, chatId, userId, "Usuario");
                }
            }
        }
    });
});

// Función para manejar cuando un usuario sale de un chat
function handleUserLeavingChat(socket, chatId, userId, userName) {
    console.log(`Usuario ${userName} (${userId}) sale del chat ${chatId}`);

    // Salir de la sala
    socket.leave(chatId);

    // Actualizar registro de salas activas
    if (activeRooms.has(chatId)) {
        const socketIds = activeRooms.get(chatId);
        socketIds.delete(socket.id);

        // Si no quedan usuarios, eliminar la sala
        if (socketIds.size === 0) {
            activeRooms.delete(chatId);
            console.log(`Room ${chatId} destruida - no quedan usuarios`);
        } else {
            // Notificar a los demás usuarios que alguien salió
            socket.to(chatId).emit("user_left", {
                userId,
                userName,
                chatId,
                timestamp: new Date()
            });
        }
    }
}

// Compartir la instancia de io con las rutas
app.set('socketio', io);
app.use("/api/chat", chatRoutes);

async function createSampleChat() {
    try {
        console.log("Intentando conectar a MongoDB en:", MONGODB_URI);

        // Incrementar el timeout y usar opciones más robustas
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Aumentar timeout a 30 segundos
            socketTimeoutMS: 45000, // Aumentar socket timeout a 45 segundos
        });
        console.log("Connected to MongoDB");

        const Message = mongoose.model("Message");

        // Verificar que la colección existe
        console.log("Verificando colección de mensajes...");
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Colecciones disponibles:", collections.map(c => c.name).join(", "));

        // Crear un chat de muestra
        const sampleChat = new Message({
            name: "Chat privado de ejemplo",
            teachers: [101, 202],
            interaction: [
                {
                    teacherId: "101",
                    message: "Hola, ¿cómo estás?",
                    date: new Date()
                },
                {
                    teacherId: "202",
                    message: "Muy bien, gracias por preguntar",
                    date: new Date(Date.now() - 3600000) // 1 hora antes
                },
                {
                    teacherId: "101",
                    message: "¿Te gustaría reunirnos mañana?",
                    date: new Date(Date.now() - 1800000) // 30 minutos antes
                }
            ]
        });

        console.log("Intentando guardar el chat de muestra...");
        const savedChat = await sampleChat.save();
        console.log("Chat de muestra creado con éxito:");
        console.log(JSON.stringify(savedChat, null, 2));

        // Verificar que se ha guardado consultando la base de datos
        const allChats = await Message.find();
        console.log(`\nTotal de chats en la base de datos: ${allChats.length}`);
    } catch (err) {
        console.log("Error al crear el chat de muestra:", err);
    }
}

// Iniciar servidor y conectar a la base de datos
server.listen(PORT, () => {
    console.log(`Servidor de chat ejecutándose en puerto ${PORT}`);
    // Iniciar la creación del chat de muestra después de que el servidor esté en marcha
    createSampleChat();
});

// Agregar una función auxiliar para obtener los usuarios en una sala
function getUsersInRoom(chatId) {
    if (!activeRooms.has(chatId)) {
        return [];
    }

    const userIds = [];
    const socketIds = activeRooms.get(chatId);

    // Convertir los socket IDs a user IDs
    for (const socketId of socketIds) {
        const userId = userSockets.get(socketId);
        if (userId) {
            userIds.push(userId);
        }
    }

    return userIds;
}
