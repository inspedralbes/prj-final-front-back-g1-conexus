import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

router.get("/", async (req, res) => {
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
        if (!room_name || !room_hours_available || !room_description) {
            return res.status(400).json({ message: "room_name, room_hours_available i room_description són obligatoris" });
        }
        //check if the room_name already exists in the database
        const roomExists = await Room.findOne({ where: { room_name } });
        if (roomExists) {
            return res.status(400).json({ message: "Ja hi ha una sala amb aquest nom" });
        }
        //check if the room_hours_available is a number
        const room = await Room.create({ room_name, room_hours_available, room_description });
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { room_name, room_hours_available, room_description } = req.body;
        if(await Room.findOne({ where: { room_name } })) {
            return res.status(400).json({ message: "Ja hi ha una sala amb aquest nom" });
        }
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

