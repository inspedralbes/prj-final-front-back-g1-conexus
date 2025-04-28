import express from "express";
import UserCourse from "../models/UserCourse.js";
import Course from "../models/Course.js";
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
        if (!req.body.user_id || !req.body.course_id) {
            return res.status(400).json({ message: "user_id y course_id son obligatorios" });
        }
        // Verificar si la relación ya existe
        const existingUserCourse = await UserCourse.findOne({
            where: {
                user_id: req.body.user_id,
                course_id: req.body.course_id,
            },
        });
        if (existingUserCourse) {
            return res.status(400).json({ message: "La relación usuario-curso ya existe" });
        }
        // Crear la nueva relación
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

// Obtener cursos por ID de usuario
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const userCourses = await UserCourse.findAll({
            where: { user_id: userId },
        });
        const userCoursesWithNames = await Promise.all(
            userCourses.map(async (userCourse) => {
            const course = await Course.findOne({ where: { id: userCourse.course_id } });
            return { 
                ...userCourse.toJSON(), 
                course_name: course ? course.course_name : "Curso no encontrado" 
            };
            })
        );
        res.json(userCoursesWithNames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;