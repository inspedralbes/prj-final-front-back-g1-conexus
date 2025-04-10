import express from "express";
import RoomReservation from "../models/RoomReservation.js";

const router = express.Router();

// GET /room-reservations - Obtenir totes les reserves d'habitacions
router.get("/", async (req, res) => {
    try {
        const reservations = await RoomReservation.findAll();
        //retornar l'array de reserves d'habitacions
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /room-reservations/:id - Obtenir una reserva d'habitació per ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const reservation = await RoomReservation.findOne({ where: { id } });
        if (!reservation) {
            return res.status(404).json({ message: "Reserva d'habitació no trobada" });
        }
        //retornar l'objecte reserva d'habitació
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /room-reservations - Crear una nova reserva d'habitació
router.post("/", async (req, res) => {
    try {
        const { user_id, room_id, start_time, end_time } = req.body;

        if (!user_id || !room_id || !start_time || !end_time) {
            return res.status(400).json({ message: "user_id, room_id, start_time i end_time són obligatoris" });
        }

        const newReservation = await RoomReservation.create({ user_id, room_id, start_time, end_time });
        //retornar l'objecte de la nova reserva d'habitació
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /room-reservations/:id - Actualitzar una reserva d'habitació per ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const reservation = await RoomReservation.findOne({ where: { id } });
        if (!reservation) {
            return res.status(404).json({ message: "Reserva d'habitació no trobada" });
        }
        await reservation.update(req.body);
        //retornar l'objecte actualitzat de la reserva d'habitació
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /room-reservations/:id - Eliminar una reserva d'habitació per ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const reservation = await RoomReservation.findOne({ where: { id } });
        if (!reservation) {
            return res.status(404).json({ message: "Reserva d'habitació no trobada" });
        }
        await reservation.destroy();
        //retornar un missatge d'èxit
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
