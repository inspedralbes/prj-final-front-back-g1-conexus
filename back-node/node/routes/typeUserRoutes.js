import express from "express";
import { verifyTokenMiddleware } from "../token.js";
import TypeUser from "../models/TypeUser.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const typeUsers = await TypeUser.findAll();
        res.json(typeUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get type user by ID
router.get("/:id", async (req, res) => {
    try {
        const typeUser = await TypeUser.findByPk(req.params.id);
        if (!typeUser) {
            return res.status(404).json({ message: "Tipo de usuario no encontrado" });
        }
        res.json(typeUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new type user
router.post("/",verifyTokenMiddleware,async (req, res) => {
    try {
        const { name } = req.body;
        // Check if type user already exists
        const existingTypeUser = await TypeUser.findOne({ where: { name } });
        if (existingTypeUser) {
            return res.status(400).json({ message: "El tipo de usuario ya existe" });
        }
        // Create new type user
        const typeUser = await TypeUser.create({ name });
        res.json(typeUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update type user by ID
router.put("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const [updated] = await TypeUser.update({ name }, { 
            where: { id: req.params.id },
            returning: true 
        });
        
        if (!updated) {
            return res.status(404).json({ message: "Tipo de usuario no encontrado" });
        }
        
        const typeUser = await TypeUser.findByPk(req.params.id);
        res.json(typeUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete type user by ID
router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const typeUser = await TypeUser.findByPk(id);

        if (!typeUser) {
            return res.status(404).json({ message: "Tipo de usuario no encontrado" });
        }

        await typeUser.destroy();
        res.json({ message: "Tipo de usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;