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

router.get("/:id", async (req, res) => {
    try {
        const typeUser = await TypeUser.findByPk(req.params.id);
        if (!typeUser) {
            return res.status(404).json({ message: "Tipus d'usuari no trobat" });
        }
        res.json(typeUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/",verifyTokenMiddleware,async (req, res) => {
    try {
        const { name } = req.body;
        const existingTypeUser = await TypeUser.findOne({ where: { name } });
        if (existingTypeUser) {
            return res.status(400).json({ message: "El tipus d'usuari ja existeix" });
        }
        const typeUser = await TypeUser.create({ name });
        res.json(typeUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const [updated] = await TypeUser.update({ name }, { 
            where: { id: req.params.id },
            returning: true 
        });
        
        if (!updated) {
            return res.status(404).json({ message: "Tipus d'usuari no trobat" });
        }
        
        const typeUser = await TypeUser.findByPk(req.params.id);
        res.json(typeUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const typeUser = await TypeUser.findByPk(id);

        if (!typeUser) {
            return res.status(404).json({ message: "Tipus d'usuari no trobat" });
        }

        await typeUser.destroy();
        res.json({ message: "Tipus d'usuari eliminat correctament" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;