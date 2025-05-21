import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import { verifyTokenMiddleware } from "../token.js";

const router = express.Router();

router.get("/", verifyTokenMiddleware, async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", verifyTokenMiddleware, async (req, res) => {
  try {
    const {
      course_name,
      course_hours_available,
      course_description,
      course_department_id,
      course_teacher_id
    } = req.body;

    if (!course_name || !course_hours_available || !course_description) {
      return res.status(400).json({ message: "Falten camps obligatoris" });
    }

    const courseExists = await Course.findOne({ where: { course_name } });
    if (courseExists) {
      return res.status(400).json({ message: "Ja existeix un curs amb aquest nom" });
    }

    if (course_teacher_id) {
      const isTeacher = await checkIfUserIsTeacher(course_teacher_id);
      if (!isTeacher) {
        return res.status(400).json({ message: "L'usuari"+course_teacher_id +"no és un professor" });
      }
    }

    const course = await Course.create({
      course_name,
      course_hours_available,
      course_description,
      course_department_id,
      course_teacher_id
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const {
      course_name,
      course_hours_available,
      course_description,
      course_department_id,
      course_teacher_id
    } = req.body;

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Curs no trobat" });
    }

    if (course_teacher_id && course_teacher_id !== course.course_teacher_id) {
      const isTeacher = await checkIfUserIsTeacher(course_teacher_id);
      if (!isTeacher) {
        return res.status(400).json({ message: "L'usuari no és un professor" });
      }
    }

    await course.update({
      course_name,
      course_hours_available,
      course_description,
      course_department_id,
      course_teacher_id
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Curs no trobat" });
    }
    await course.destroy();
    res.json({ message: "Curs eliminat correctament" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats/count", verifyTokenMiddleware, async (req, res) => {
  try {
    const totalCourses = await Course.count();
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
    console.error("Error al obtenir estadístiques de cursos:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/teacher/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { course_teacher_id: req.params.id },
    });
    if (!courses) {
      return res.status(404).json({ message: "No s'han trobat cursos" });
    }
    res.json(courses);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/assignTeacher", verifyTokenMiddleware, async (req, res) => {
  try {
    const { course_id, teacher_id } = req.body;
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" + course_id + course});
    }
    let teacher = await User.findByPk(teacher_id);
    if(teacher==null){
      return res.status(404).json({ message: "Teacher not found" + teacher_id });
    }else if(teacher.typeUsers_id!=1){
      return res.status(404).json({ teacher:teacher});
    } else{
      course.course_teacher_id = teacher_id;
      await course.save();
      res.json(course);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export async function getLatestCourse() {
  try {
    const latestCourse = await Course.findOne({
      order: [['createdAt', 'DESC']]
    });

    return latestCourse;
  } catch (error) {
    console.error("Error al obtenir curs recent:", error);
    throw error;
  }
}

async function checkIfUserIsTeacher(teacher_id) {
  const user = await User.findOne({ where: { id: teacher_id } });
  if (!user) {
    return false;
  }
  return user.typeUsers_id == 1;
}

export default router;