import express from "express";
import Grade from "../models/Grade.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const grades = await Grade.findAll();
        res.json(grades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const grade = await Grade.findByPk(req.params.id);
        res.json(grade);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const grade = await Grade.create(req.body);
        res.json(grade);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const grade = await Grade.update(req.body, { where: { id: req.params.id } });
        res.json(grade);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const grade = await Grade.findByPk(req.params.id);
        if (!grade) {
            return res.status(404).json({ message: "Grade not found" });
        } else {
            await Grade.destroy({ where: { id: req.params.id } });
            res.json({ message: "Grade deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;










