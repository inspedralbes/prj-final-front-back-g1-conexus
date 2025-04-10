import express from "express";
import RoomReservation from "../models/RoomReservation";

const router = express.Router();

// Obtener todas las reservas de habitaciones
router.get("/", async (req, res) => {
    try {
        const reservations = await RoomReservation.findAll();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una nueva reserva de habitación
router.post("/", async (req, res) => {
    try {
        const { user_id, room_id, start_time, end_time } = req.body;
        const reservation = await RoomReservation.create({ user_id, room_id, start_time, end_time });
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar una reserva de habitación por ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await RoomReservation.findByPk(id);

        if (!reservation) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }

        await reservation.destroy();
        res.json({ message: "Reserva eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;