import express from "express";
import Grade from "../models/Grade.js";
import Task from "../models/Task.js";
import { verifyTokenMiddleware } from "../token.js";

const router = express.Router();

router.get("/", verifyTokenMiddleware, async (req, res) => {
  try {
    const grades = await Grade.findAll();
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const grade = await Grade.findByPk(req.params.id);
    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getAllGradesFromTask/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    let grades = [];
    grades = await Grade.findAll({
      where: { task_id: req.params.id },
    });
    return res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getAllGradesFromUser/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const user = await Grade.findByPk(req.params.id, {
      include: [
        {
          model: Grade,
          as: "grades",
          attributes: ["id", "grade"],
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "Usuari no trobat" });
    }
    const grades = user.grades.map((grade) => {
      return {
        id: grade.id,
        grade: grade.grade,
      };
    });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", verifyTokenMiddleware, async (req, res) => {
  try {
    if (req.body.grade < 0 || req.body.grade > 10) {
      return res
        .status(400)
        .json({ message: "La nota ha d'estar entre 0 i 10" });
    } else {
      let grade = {};
      if (await checkIfGradeAlreadyExists(req.body.user_id, req.body.task_id)) {
        grade = await Grade.update(req.body, {
          where: { user_id: req.body.user_id, task_id: req.body.task_id },
        });
      } else {
        grade = await Grade.create(req.body);
      }
      res.json(grade);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    if (req.body.grade < 0 || req.body.grade > 10) {
      return res
        .status(400)
        .json({ message: "La nota ha d'estar entre 0 i 10" });
    }
    const grade = await Grade.update(req.body, {
      where: { id: req.params.id },
    });
    if (!grade) {
      return res.status(404).json({ message: "Nota no trobada" });
    }
    const updatedGrade = await Grade.findByPk(req.params.id);
    if (!updatedGrade) {
      return res.status(404).json({ message: "Nota no trobada" });
    }
    res.json(updatedGrade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get(
  "/getAllGradesFromUserAndCourse/:userId/:courseId", verifyTokenMiddleware,
  async (req, res) => {
    try {
      const { userId, courseId } = req.params;
      let arrangedGrades = [];
      const grades = await Grade.findAll({
        where: {
          user_id: userId,
        },
      });

      await Promise.all(
        grades.map(async (grade) => {
          let auxTask = await Task.findOne({
            where: { id: grade.task_id, course_id: courseId },
          });
          if (auxTask) {
            arrangedGrades.push({
              id: grade.id,
              grade: grade.grade ?? "Sense qualificar",
              task_id: grade.task_id,
              task_name: auxTask.task_name,
            });
          }
        })
      );

      res.json(arrangedGrades);
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message });
    }
  }
);

router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const grade = await Grade.findByPk(req.params.id);
    if (!grade) {
      return res.status(404).json({ message: "Nota no trobada" });
    } else {
      await Grade.destroy({ where: { id: req.params.id } });
      res.json({ message: "Nota eliminada correctament" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function checkIfGradeAlreadyExists(user_id, task_id) {
  let auxGrade = await Grade.findOne({
    where: { user_id: user_id, task_id: task_id },
  });
  if (auxGrade) {
    return true;
  } else {
    return false;
  }
}

export default router;