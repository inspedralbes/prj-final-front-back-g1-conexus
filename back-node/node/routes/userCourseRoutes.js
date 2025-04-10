import express from "express";
import UserCourse from "../models/UserCourse";

const router = express.Router();

// Obtener todas las relaciones usuario-curso
router.get("/", async (req, res) => {
    try {
        const userCourses = await UserCourse.findAll();
        res.json(userCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una nueva relación usuario-curso
router.post("/", async (req, res) => {
    try {
        const { user_id, course_id } = req.body;
        const userCourse = await UserCourse.create({ user_id, course_id });
        res.json(userCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar una relación usuario-curso por ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userCourse = await UserCourse.findByPk(id);

        if (!userCourse) {
            return res.status(404).json({ message: "Relación usuario-curso no encontrada" });
        }

        await userCourse.destroy();
        res.json({ message: "Relación usuario-curso eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;