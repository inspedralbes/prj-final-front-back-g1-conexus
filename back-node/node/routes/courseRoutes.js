import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { Op } from "sequelize"; // Añade esta importación al principio

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
  console.log(req.body);
  try {
    const {
      course_name,
      course_hours_available,
      course_description,
      course_teacher_id,
      course_department_id,
    } = req.body;
    const course = await Course.create({
      course_name,
      course_hours_available,
      course_description,
      course_teacher_id,
      course_department_id,
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      course_name,
      course_hours_available,
      course_description,
      course_teacher_id,
      course_department_id,
    } = req.body;
    const course = await Course.update(
      {
        course_name,
        course_hours_available,
        course_description,
        course_teacher_id,
        course_department_id,
      },
      { where: { id: req.params.id } }
    );
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

router.post("/assingTeacher", async (req, res) => {
  try {
    const { course_id, teacher_id } = req.body;
    console.log(course_id, teacher_id);
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (checkIfUserIsTeacher(teacher_id) == false) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    course.course_teacher_id = teacher_id;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all courses from a teacher_id
router.get("/teacher/:teacher_id", async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const courses = await Course.findAll({
      where: { course_teacher_id: teacher_id },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener estadísticas de cursos (total y de este mes)
router.get("/stats/count", async (req, res) => {
  try {
    // Contar todos los cursos
    const totalCourses = await Course.count();

    // Preparar fechas para este mes
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Contar cursos creados este mes
    const thisMonthCourses = await Course.count({
      where: {
        createdAt: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    res.json({
      total: totalCourses,
      createdThisMonth: thisMonthCourses,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas de cursos:", error);
    res.status(500).json({ message: error.message });
  }
});

async function checkIfUserIsTeacher(teacher_id) {
  const user = await User.findByPk(teacher_id);
  if (!user) {
    return false;
  }
  return user.user_type == 1;
}
export default router;
