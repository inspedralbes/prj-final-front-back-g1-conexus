import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
    console.log(req.body);
    try {
        const { typesUsers_id, name, email, password, banner, profile, department_id, description } = req.body;
        const user = await User.create({ typesUsers_id, name, email, password, banner, profile, department_id, description });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un usuario por ID
router.put("/personalData/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password, banner, profile, department_id, description } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.update({ name, password, banner, profile, department_id, description });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un usuario por ID (actualización de rol)
router.put("/updateRole/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { typesUsers_id } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.update({ typesUsers_id });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar un usuario por ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.destroy();
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;