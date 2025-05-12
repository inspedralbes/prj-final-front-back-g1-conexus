import express from "express";
import Message from "../models/Message.js";
import mongoose from 'mongoose';

const router = express.Router();

// Log connection state for debugging
const logMongoConnectionState = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized'
    };
    console.log(`MongoDB connection state: ${states[mongoose.connection.readyState]}`);
    return mongoose.connection.readyState === 1; // return true if connected
};

// Función para obtener la instancia de Socket.io
const getIo = (req) => {
    return req.app.get('socketio');
};

/**
 * Obtener todos los chats
 * @route GET /api/chat
 * @returns {array} 200 - Array de chats
 * @returns {object} 500 - Error del servidor
 */
router.get("/", async (req, res) => {
    console.log("GET /api/chat - Solicitando todos los chats");
    logMongoConnectionState();

    try {
        const messages = await Message.find();
        console.log(`Encontrados ${messages.length} chats`);
        res.json(messages);
    } catch (error) {
        console.error("Error al obtener chats:", error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * Obtener todos los chats donde participa un profesor específico
 * @route GET /api/chat/user/:teacherId
 * @param {string} teacherId.path.required - ID del profesor
 * @returns {array} 200 - Array de chats donde participa el profesor
 * @returns {object} 404 - Profesor no encontrado o no tiene chats
 * @returns {object} 500 - Error del servidor
 */
router.get("/user/:teacherId", async (req, res) => {
    console.log(`GET /api/chat/user/${req.params.teacherId} - Buscando chats de profesor`);
    logMongoConnectionState();

    try {
        // Convertir el ID a número ya que es un campo numérico
        const teacherId = parseInt(req.params.teacherId);

        if (isNaN(teacherId)) {
            return res.status(400).json({ message: "ID de profesor inválido" });
        }

        // Buscar todos los chats donde el profesor participa
        const chats = await Message.find({ teachers: teacherId });

        if (!chats || chats.length === 0) {
            console.log(`No se encontraron chats para el profesor ${teacherId}`);
            return res.status(200).json([]); // Devolver array vacío
        }

        console.log(`Se encontraron ${chats.length} chats para el profesor ${teacherId}`);
        res.json(chats);
    } catch (error) {
        console.error(`Error al buscar chats del profesor ${req.params.teacherId}:`, error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * Obtener un chat por nombre
 * @route GET /api/chat/name/:name
 * @param {string} name.path.required - Nombre del chat
 * @returns {object} 200 - Chat encontrado
 * @returns {object} 404 - Chat no encontrado
 * @returns {object} 500 - Error del servidor
 */
router.get("/name/:name", async (req, res) => {
    console.log(`GET /api/chat/name/${req.params.name} - Buscando chat por nombre`);
    logMongoConnectionState();

    try {
        const message = await Message.findOne({ name: req.params.name });
        if (!message) {
            console.log(`Chat '${req.params.name}' no encontrado`);
            return res.status(404).json({ message: "Chat no encontrado" });
        }
        console.log("Chat encontrado:", message.name);
        res.json(message);
    } catch (error) {
        console.error(`Error al buscar chat '${req.params.name}':`, error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * Obtener un chat por ID
 * @route GET /api/chat/:id
 * @param {string} id.path.required - ID del chat
 * @returns {object} 200 - Chat encontrado
 * @returns {object} 404 - Chat no encontrado
 * @returns {object} 500 - Error del servidor
 */
router.get("/:id", async (req, res) => {
    console.log(`GET /api/chat/${req.params.id} - Buscando chat específico`);
    logMongoConnectionState();

    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            console.log(`Chat '${req.params.id}' no encontrado`);
            return res.status(404).json({ message: "Chat no encontrado" });
        }
        console.log("Chat encontrado:", message.name);
        res.json(message);
    } catch (error) {
        console.error(`Error al buscar chat '${req.params.id}':`, error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * Crear un nuevo chat
 * @route POST /api/chat
 * @param {object} body.body.required - Datos del chat
 * @param {string} body.body.name.required - Nombre del chat
 * @param {array} body.body.teachers - Lista de IDs de profesores
 * @param {array} body.body.interaction - Lista de mensajes
 * @returns {object} 201 - Chat creado
 * @returns {object} 400 - Datos inválidos
 * @returns {object} 500 - Error del servidor
 */
router.post("/", async (req, res) => {
    console.log("POST /api/chat - Creando nuevo chat");
    console.log("Body recibido:", JSON.stringify(req.body, null, 2));
    const isConnected = logMongoConnectionState();

    if (!isConnected) {
        console.error("Error: MongoDB no está conectado. No se puede crear el chat.");
        return res.status(500).json({ message: "Error de conexión a la base de datos" });
    }

    // Verificar que tenemos los datos mínimos necesarios
    if (!req.body.name) {
        console.error("Error: Falta el nombre del chat");
        return res.status(400).json({ message: "El nombre del chat es obligatorio" });
    }

    const message = new Message({
        name: req.body.name,
        teachers: req.body.teachers || [],
        interaction: req.body.interaction || []
    });

    console.log("Objeto de mensaje creado:", JSON.stringify(message, null, 2));

    try {
        console.log("Intentando guardar el mensaje...");
        const newMessage = await message.save();
        console.log("Mensaje guardado con éxito:", JSON.stringify(newMessage, null, 2));

        // Notificar a través de Socket.io que se ha creado un nuevo chat
        const io = getIo(req);
        if (io) {
            io.emit('new_chat_created', {
                chatId: newMessage._id,
                name: newMessage.name,
                timestamp: new Date()
            });
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        res.status(400).json({ message: error.message });
    }
});

/**
 * Añadir un mensaje a un chat existente por ID
 * @route POST /api/chat/:id/message
 * @param {string} id.path.required - ID del chat
 * @param {object} body.body.required - Datos del mensaje
 * @param {string} body.body.teacherId.required - ID del profesor
 * @param {string} body.body.message.required - Contenido del mensaje
 * @returns {object} 200 - Chat actualizado
 * @returns {object} 404 - Chat no encontrado
 * @returns {object} 400 - Datos inválidos
 */
router.post("/:id/message", async (req, res) => {
    console.log(`POST /api/chat/${req.params.id}/message - Añadiendo mensaje`);
    logMongoConnectionState();

    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            console.log(`Chat '${req.params.id}' no encontrado`);
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        const newInteraction = {
            teacherId: req.body.teacherId,
            message: req.body.message,
            date: new Date()
        };

        message.interaction.push(newInteraction);

        console.log("Guardando interacción...");
        const updatedMessage = await message.save();
        console.log("Interacción guardada con éxito");

        // Notificar a través de Socket.io que se ha añadido un mensaje
        const io = getIo(req);
        if (io) {
            // Asegurarse de que la información del mensaje esté completa
            const newMessageData = {
                chatId: req.params.id,
                userId: newInteraction.teacherId,
                id: newInteraction._id,
                message: newInteraction.message,
                timestamp: newInteraction.date
            };

            io.to(req.params.id).emit('new_message', newMessageData);
        }

        res.json(updatedMessage);
    } catch (error) {
        console.error("Error al añadir mensaje:", error);
        res.status(400).json({ message: error.message });
    }
});

/**
 * Eliminar un chat por ID
 * @route DELETE /api/chat/:id
 * @param {string} id.path.required - ID del chat
 * @returns {object} 200 - Mensaje de éxito
 * @returns {object} 404 - Chat no encontrado
 * @returns {object} 500 - Error del servidor
 */
router.delete("/:id", async (req, res) => {
    console.log(`DELETE /api/chat/${req.params.id} - Eliminando chat`);
    logMongoConnectionState();

    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            console.log(`Chat '${req.params.id}' no encontrado`);
            return res.status(404).json({ message: "Chat no encontrado" });
        }
        console.log("Chat eliminado con éxito");

        // Notificar a través de Socket.io que se ha eliminado un chat
        const io = getIo(req);
        if (io) {
            io.emit('chat_deleted', {
                chatId: req.params.id,
                timestamp: new Date()
            });
            // Notificar a todos los usuarios en la sala que el chat ha sido eliminado
            io.to(req.params.id).emit('chat_room_closed', {
                chatId: req.params.id,
                message: "Este chat ha sido eliminado",
                timestamp: new Date()
            });
        }

        res.json({ message: "Chat eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar chat:", error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * Eliminar un mensaje específico de un chat
 * @route DELETE /api/chat/:id/message/:messageId
 * @param {string} id.path.required - ID del chat
 * @param {string} messageId.path.required - ID del mensaje
 * @returns {object} 200 - Chat actualizado
 * @returns {object} 404 - Chat o mensaje no encontrado
 * @returns {object} 500 - Error del servidor
 */
router.delete("/:id/message/:messageId", async (req, res) => {
    console.log(`DELETE /api/chat/${req.params.id}/message/${req.params.messageId} - Eliminando mensaje`);
    logMongoConnectionState();

    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            console.log(`Chat '${req.params.id}' no encontrado`);
            return res.status(404).json({ message: "Chat no encontrado" });
        }

        const messageIndex = message.interaction.findIndex(
            (interaction) => interaction._id.toString() === req.params.messageId
        );

        if (messageIndex === -1) {
            console.log(`Mensaje '${req.params.messageId}' no encontrado en el chat '${req.params.id}'`);
            return res.status(404).json({ message: "Mensaje no encontrado" });
        }

        message.interaction.splice(messageIndex, 1);
        const updatedMessage = await message.save();
        console.log("Mensaje eliminado con éxito");

        // Notificar a través de Socket.io que se ha eliminado un mensaje
        const io = getIo(req);
        if (io) {
            io.to(req.params.id).emit('message_deleted', {
                chatId: req.params.id,
                messageId: req.params.messageId,
                timestamp: new Date()
            });
        }

        res.json(updatedMessage);
    } catch (error) {
        console.error("Error al eliminar mensaje:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;

