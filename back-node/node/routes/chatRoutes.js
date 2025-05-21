import express from "express";
import Message from "../models/Message.js";
import mongoose from 'mongoose';
import { getLinkPreview } from 'link-preview-js';

const router = express.Router();

const logMongoConnectionState = () => {
    const states = {
        0: 'desconnectat',
        1: 'connectat',
        2: 'connectant',
        3: 'desconnectant',
        99: 'no inicialitzat'
    };
    console.log(`Estat de connexió MongoDB: ${states[mongoose.connection.readyState]}`);
    return mongoose.connection.readyState === 1;
};

const getIo = (req) => {
    return req.app.get('socketio');
};

const fetchLinkPreviews = async (links) => {
    const previews = [];
    const linksToProcess = links.slice(0, 3);

    for (const url of linksToProcess) {
        try {
            console.log(`Obtenint previsualització per: ${url}`);
            const preview = await getLinkPreview(url, {
                timeout: 3000,
                followRedirects: 'follow',
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                }
            });

            const formattedPreview = {
                url: url,
                title: preview.title || '',
                description: preview.description || '',
                image: preview.images && preview.images.length > 0 ? preview.images[0] : '',
                siteName: preview.siteName || ''
            };

            previews.push(formattedPreview);
            console.log(`Previsualització obtinguda per ${url}:`, formattedPreview);
        } catch (error) {
            console.error(`Error al obtenir previsualització per ${url}:`, error.message);
            previews.push({
                url: url,
                title: url,
                description: '',
                image: '',
                siteName: ''
            });
        }
    }

    return previews;
};

router.get("/", async (req, res) => {
    console.log("GET /api/chat - Sol·licitant tots els xats");
    logMongoConnectionState();

    try {
        const messages = await Message.find();
        console.log(`S'han trobat ${messages.length} xats`);
        res.json(messages);
    } catch (error) {
        console.error("Error al buscar xats:", error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/teacher/:teacherId", async (req, res) => {
    console.log(`GET /api/chat/teacher/${req.params.teacherId} - Sol·licitant xats d'un professor`);
    logMongoConnectionState();

    try {
        const teacherId = parseInt(req.params.teacherId);

        if (isNaN(teacherId)) {
            return res.status(400).json({ message: "ID de professor invàlid" });
        }

        const chats = await Message.find({ teachers: teacherId });

        if (!chats || chats.length === 0) {
            console.log(`No s'han trobat xats per al professor ${teacherId}`);
            return res.status(200).json([]);
        }

        console.log(`S'han trobat ${chats.length} xats per al professor ${teacherId}`);
        res.json(chats);
    } catch (error) {
        console.error(`Error al buscar xats del professor ${req.params.teacherId}:`, error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    console.log(`GET /api/chat/${req.params.id} - Sol·licitant un xat específic`);
    logMongoConnectionState();

    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            console.log(`Xat '${req.params.id}' no trobat`);
            return res.status(404).json({ message: "Xat no trobat" });
        }
        console.log(`Xat '${req.params.id}' trobat`);
        res.json(message);
    } catch (error) {
        console.error(`Error al buscar xat '${req.params.id}':`, error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    console.log("POST /api/chat - Creant nou xat");
    console.log("Body rebut:", JSON.stringify(req.body, null, 2));
    const isConnected = logMongoConnectionState();

    if (!isConnected) {
        console.error("Error: MongoDB no està connectat. No es pot crear el xat.");
        return res.status(500).json({ message: "Error de connexió a la base de dades" });
    }

    if (!req.body.name) {
        console.error("Error: Falta el nom del xat");
        return res.status(400).json({ message: "El nom del xat és obligatori" });
    }

    const message = new Message({
        name: req.body.name,
        teachers: req.body.teachers || [],
        interaction: req.body.interaction || []
    });

    console.log("Objecte de missatge creat:", JSON.stringify(message, null, 2));

    try {
        console.log("Intentant desar el missatge...");
        const newMessage = await message.save();
        console.log("Missatge desat amb èxit:", JSON.stringify(newMessage, null, 2));
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error al desar el missatge:", error);
        res.status(400).json({ message: error.message });
    }
});

router.post("/:id/message", async (req, res) => {
    console.log(`POST /api/chat/${req.params.id}/message - Afegint missatge`);
    logMongoConnectionState();

    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            console.log(`Xat '${req.params.id}' no trobat`);
            return res.status(404).json({ message: "Xat no trobat" });
        }

        const messageText = req.body.message;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const links = messageText.match(urlRegex) || [];
        const hasLinks = links.length > 0;

        let linkPreviews = [];
        if (hasLinks) {
            linkPreviews = await fetchLinkPreviews(links);
        }

        const newInteraction = {
            teacherId: req.body.teacherId,
            message: messageText,
            hasLinks: hasLinks,
            links: links,
            linkPreviews: linkPreviews,
            date: new Date()
        };

        message.interaction.push(newInteraction);

        console.log("Desant interacció...");
        const updatedMessage = await message.save();
        console.log("Interacció desada amb èxit");

        const io = getIo(req);
        if (io) {
            const newMessageData = {
                chatId: req.params.id,
                userId: newInteraction.teacherId,
                id: newInteraction._id,
                message: newInteraction.message,
                hasLinks: newInteraction.hasLinks,
                links: newInteraction.links,
                linkPreviews: newInteraction.linkPreviews,
                timestamp: newInteraction.date
            };

            io.to(req.params.id).emit('new_message', newMessageData);
        }

        res.json(updatedMessage);
    } catch (error) {
        console.error("Error al afegir missatge:", error);
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    console.log(`DELETE /api/chat/${req.params.id} - Eliminant xat`);
    logMongoConnectionState();

    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            console.log(`Xat '${req.params.id}' no trobat`);
            return res.status(404).json({ message: "Xat no trobat" });
        }
        console.log("Xat eliminat amb èxit");

        const io = getIo(req);
        if (io) {
            io.emit('chat_deleted', {
                chatId: req.params.id,
                timestamp: new Date()
            });
            io.to(req.params.id).emit('chat_room_closed', {
                chatId: req.params.id,
                message: "Aquest xat ha estat eliminat",
                timestamp: new Date()
            });
        }

        res.json({ message: "Xat eliminat amb èxit" });
    } catch (error) {
        console.error("Error al eliminar xat:", error);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id/message/:messageId", async (req, res) => {
    console.log(`DELETE /api/chat/${req.params.id}/message/${req.params.messageId} - Eliminant missatge`);
    logMongoConnectionState();

    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            console.log(`Xat '${req.params.id}' no trobat`);
            return res.status(404).json({ message: "Xat no trobat" });
        }

        const messageIndex = message.interaction.findIndex(
            (interaction) => interaction._id.toString() === req.params.messageId
        );

        if (messageIndex === -1) {
            console.log(`Missatge '${req.params.messageId}' no trobat al xat '${req.params.id}'`);
            return res.status(404).json({ message: "Missatge no trobat" });
        }

        const deletedMessage = message.interaction[messageIndex];
        message.interaction.splice(messageIndex, 1);

        const updatedMessage = await message.save();
        console.log("Missatge eliminat amb èxit de la base de dades");

        const io = getIo(req);
        if (io) {
            io.to(req.params.id).emit('message_deleted', {
                chatId: req.params.id,
                messageId: req.params.messageId,
                timestamp: new Date(),
                messageContent: deletedMessage.message,
                messageDate: deletedMessage.date,
                teacherId: deletedMessage.teacherId,
                deleted: true
            });
        }

        res.json(updatedMessage);
    } catch (error) {
        console.error("Error al eliminar missatge:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;