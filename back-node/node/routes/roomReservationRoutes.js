import express from "express";
import RoomReservation from "../models/RoomReservation.js";

const router = express.Router();

// GET /room-reservations - Get all room reservations
router.get("/", async (req, res) => {
    try {
        const reservations = await RoomReservation.findAll();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /room-reservations/:id - Get a room reservation by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const reservation = await RoomReservation.findOne({ where: { id } });
        if (!reservation) {
            return res.status(404).json({ message: "Room reservation not found" });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /room-reservations - Create a new room reservation
router.post("/", async (req, res) => {
    try {
        const { user_id, room_id, start_time, end_time } = req.body;

        if (!user_id || !room_id || !start_time || !end_time) {
            return res.status(400).json({ message: "user_id, room_id, start_time, and end_time are required" });
        }

        const newReservation = await RoomReservation.create({ user_id, room_id, start_time, end_time });
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /room-reservations/:id - Update a room reservation by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const reservation = await RoomReservation.findOne({ where: { id } });
        if (!reservation) {
            return res.status(404).json({ message: "Room reservation not found" });
        }
        await reservation.update(req.body);
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /room-reservations/:id - Delete a room reservation by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const reservation = await RoomReservation.findOne({ where: { id } });
        if (!reservation) {
            return res.status(404).json({ message: "Room reservation not found" });
        }
        await reservation.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
