import express from "express";
import Responses from "../models/Responses.js";

const router = express.Router();

// GET /responses - Obtenir totes les respostes
router.get("/", async (req, res) => {
    const responses = await Responses.findAll();
    res.json(responses);
});

// GET /responses/:id - Obtenir una resposta per ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Responses.findOne({ where: { id } });
        if (!response) {
            return res.status(404).json({ message: "Resposta no trobada" });
        }
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /responses - Crear una nova resposta
router.post("/", async (req, res) => {
    try {
        const { user_id, lostAndFound_id, comment } = req.body;

        if (!user_id || !lostAndFound_id || !comment) {
            return res.status(400).json({ message: "user_id, lostAndFound_id, comment són obligatoris" });
        }
        /**
         * Crea una nova resposta a la base de dades.
         * 
         * @async
         * @function
         * @param {Object} responseData - Les dades per a la nova resposta.
         * @param {number} responseData.user_id - L'ID de l'usuari que crea la resposta.
         * @param {number} responseData.lostAndFound_id - L'ID de la publicació de perduts i trobats associada amb la resposta.
         * @param {string} responseData.comment - El contingut de la resposta.
         * @returns {Promise<Object>} L'objecte de la resposta acabada de crear.
         */
        const newResponse = await Responses.create({ user_id, lostAndFound_id, comment });
        res.status(201).json(newResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /responses/:id - Actualitzar una resposta per ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Responses.findOne({ where: { id } });
        if (!response) {
            return res.status(404).json({ message: "Resposta no trobada" });
        }
        await response.update(req.body);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /responses/:id - Eliminar una resposta per ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Responses.findOne({ where: { id } });
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
