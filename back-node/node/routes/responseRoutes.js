import express from "express";
import Responses from "../models/Responses.js";

const router = express.Router();

// GET /responses - Get all responses
router.get("/", async (req, res) => {
    const responses = await Responses.findAll();
    res.json(responses);
});

// GET /responses/:id - Get a response by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Responses.findOne({ where: { id } });
        if (!response) {
            return res.status(404).json({ message: "Response not found" });
        }
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /responses - Create a new response
router.post("/", async (req, res) => {
    try {
        const { user_id, lostAndFound_id, comment } = req.body;

        if (!user_id || !lostAndFound_id || !comment) {
            return res.status(400).json({ message: "user_id, lostAndFound_id, comment are required" });
        }

        const newResponse = await Responses.create({  user_id, lostAndFound_id, comment });
        res.status(201).json(newResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /responses/:id - Update a response by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Responses.findOne({ where: { id } });
        if (!response) {
            return res.status(404).json({ message: "Response not found" });
        }
        await response.update(req.body);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /responses/:id - Delete a response by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Responses.findOne({ where: { id } });
        if (!response) {
            return res.status(404).json({ message: "Response not found" });
        }
        await response.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
