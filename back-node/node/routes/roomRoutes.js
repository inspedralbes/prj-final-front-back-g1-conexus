import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
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

router.post("/", async (req, res) => {
    try {
        const { room_name, room_hours_available, room_description } = req.body;
        const room = await Room.create({ room_name, room_hours_available, room_description });
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { room_name, room_hours_available, room_description } = req.body;
        const room = await Room.update({ room_name, room_hours_available, room_description }, { where: { id: req.params.id } });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
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

export default router;

