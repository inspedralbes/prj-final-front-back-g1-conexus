import express from "express";
import TypeUser from "../models/TypeUser.js";

const router = express.Router();

// Obtener todas las reservas de habitaciones
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
        res.json(typeUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Crear una nueva reserva de habitación
router.post("/", async (req, res) => {
    console.log(req.body);
    try {
        const { name } = req.body;
        const typeUser = await TypeUser.create({ name });
        res.json(typeUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const typeUser = await TypeUser.update({ name }, { where: { id: req.params.id } });
        res.json(typeUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar una reserva de habitación por ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const typeUsers = await TypeUser.findByPk(id);

        if (!typeUsers) {
            return res.status(404).json({ message: "Tipo de usuario no encontrado" });
        }

        await typeUsers.destroy();
        res.json({ message: "Tipo de usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;