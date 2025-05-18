import express from "express";
import Room from "../models/Room.js";
import { verifyTokenMiddleware } from "../token.js";

const router = express.Router();

router.get("/", verifyTokenMiddleware, async (req, res) => {
    try {
        const rooms = await Room.findAll();
        const processedRooms = rooms.map((room) => {
            const hoursAvailable = room.room_hours_available || {};
            const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
            const processedRoom = { ...room.toJSON() };

            days.forEach((day) => {
                if (hoursAvailable[day]) {
                    processedRoom[`room_hours_available_${day}`] = hoursAvailable[day].flatMap((range) => {
                        const [start, end] = range.split("-");
                        const startTime = new Date(`1970-01-01T${start}:00Z`);
                        const endTime = new Date(`1970-01-01T${end}:00Z`);
                        const times = [];
                        while (startTime < endTime) {
                            const nextTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour
                            times.push(
                                `${startTime.toISOString().substr(11, 5)}-${nextTime.toISOString().substr(11, 5)}`
                            );
                            startTime.setTime(nextTime.getTime());
                        }
                        return times;
                    });
                } else {
                    processedRoom[`room_hours_available_${day}`] = null;
                }
            });

            return processedRoom;
        });

        res.json(processedRooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Para POST - creación de aulas, asegúrate de incluir el campo available
router.post("/", verifyTokenMiddleware, async (req, res) => {
    try {
        const { room_name, room_hours_available, room_description, available } = req.body;
        if (!room_name || !room_hours_available || !room_description) {
            return res.status(400).json({ message: "room_name, room_hours_available i room_description són obligatoris" });
        }
        //check if the room_name already exists in the database
        const roomExists = await Room.findOne({ where: { room_name } });
        if (roomExists) {
            return res.status(400).json({ message: "Ja hi ha una sala amb aquest nom" });
        }
        const room = await Room.create({ room_name, room_hours_available, room_description, available: available !== undefined ? available : true });
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Para PUT - actualización de aulas, incluir el campo available
router.put("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { room_name, room_hours_available, room_description, available } = req.body;

        const room = await Room.update(
            { room_name, room_hours_available, room_description, available }, 
            { where: { id: req.params.id } }
        );
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    try {
        await room.destroy();
        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener estadísticas de aulas (total y disponibles/mantenimiento)
router.get("/stats/count", verifyTokenMiddleware, async (req, res) => {
    try {
        // Contar todas las aulas
        const totalRooms = await Room.count();
        
        // Contar aulas disponibles
        const availableRooms = await Room.count({
            where: { available: true }
        });
        
        // Contar aulas en mantenimiento
        const maintenanceRooms = await Room.count({
            where: { available: false }
        });
        
        res.json({
            total: totalRooms,
            available: availableRooms,
            maintenance: maintenanceRooms
        });
    } catch (error) {
        console.error("Error al obtener estadísticas de aulas:", error);
        res.status(500).json({ message: error.message });
    }
});

// Actualizar disponibilidad de un aula
router.put("/:id/availability",verifyTokenMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { available } = req.body;
        
        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json({ message: "Aula no encontrada" });
        }
        
        await room.update({ available });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

