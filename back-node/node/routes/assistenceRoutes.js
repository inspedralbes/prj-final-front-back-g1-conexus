import express from "express";
import Assistance from "../models/Assistence";

const router = express.Router();

router.get("/", async (req, res) => {
    const assistance = await Assistance.findAll();
    res.json(assistance);
});

router.get("/:id", async (req, res) => {
    try {
        const assistance = await Assistance.findByPk(req.params.id);
        res.json(assistance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { user_id, course_id, hour, assisted } = req.body;
        const assistance = await Assistance.create({ user_id, course_id, hour, assisted });
        res.json(assistance);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { user_id, course_id, hour, assisted } = req.body;
        const assistance = await Assistance.update({ user_id, course_id, hour, assisted }, { where: { id: req.params.id } });
        res.json(assistance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const assistance = await Assistance.findByPk(req.params.id);
    if (!assistance) {
        return res.status(404).json({ message: "Assistance not found" });
    } else {
        try {
            await Assistance.destroy();
            res.json({ message: "Assistance deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
});

export default router;

