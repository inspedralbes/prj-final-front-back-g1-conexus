import express from "express";
import Course from "../models/Course.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { course_name, course_hours_available, course_description, course_teacher_id, course_department_id } = req.body;
        const course = await Course.create({ course_name, course_hours_available, course_description, course_teacher_id, course_department_id });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { course_name, course_hours_available, course_description, course_teacher_id, course_department_id } = req.body;
        const course = await Course.update({ course_name, course_hours_available, course_description, course_teacher_id, course_department_id }, { where: { id: req.params.id } });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    } else {
        try {
            await Course.destroy({ where: { id: req.params.id } });
            res.json({ message: "Course deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
});

export default router;









