import express from "express";
import Response from "../models/Response.js";
import { verifyTokenMiddleware } from "../token.js";

const router = express.Router();

router.get("/", verifyTokenMiddleware, async (req, res) => {
    const responses = await Response.findAll();
    res.json(responses);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Response.findOne({ where: { id } });
        if (!response) {
            return res.status(404).json({ message: "Resposta no trobada" });
        }
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", verifyTokenMiddleware, async (req, res) => {
    try {
        const { user_id, lostAndFound_id, comment } = req.body;

        if (!user_id || !lostAndFound_id || !comment) {
            return res.status(400).json({ message: "user_id, lostAndFound_id, comment són obligatoris" });
        }
        const newResponse = await Response.create({ user_id, lostAndFound_id, comment });
        res.status(201).json(newResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", verifyTokenMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Response.findOne({ where: { id } });
        if (!response) {
            return res.status(404).json({ message: "Resposta no trobada" });
        }
        await response.update(req.body);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Response.findOne({ where: { id } });
        if (!response) {
            return res.status(404).json({ message: "Resposta no trobada" });
        }
        await response.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
