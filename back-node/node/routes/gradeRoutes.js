import express from "express";
import Grade from "../models/Grade.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const grades = await Grade.findAll();
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const grade = await Grade.findByPk(req.params.id);
    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all grades from a specific task
router.get("/getAllGradesFromTask/:id", async (req, res) => {
  try {
    let grades=[];
    grades = await Grade.findAll({
      where: { task_id: req.params.id },
    });
    return res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all grades from a specific user
router.get("/getAllGradesFromUser/:id", async (req, res) => {
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
      return res.status(404).json({ message: "User not found" });
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

// Get all grades from a specific user and course
router.get("/getAllGradesFromUserAndCourse/:userId/:courseId", async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const grades = await Grade.findAll({
      where: {
        user_id: userId,
        course_id: courseId,
      },
      include: [
        {
          model: Grade,
          as: "grades",
          attributes: ["id", "grade"],
        },
      ],
    });
    if (!grades) {
      return res.status(404).json({ message: "No grades found for this user and course" });
    }
    const gradesList = grades.map((grade) => {
      return {
        id: grade.id,
        grade: grade.grade,
      };
    });
    res.json(gradesList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Create a new grade
router.post("/", async (req, res) => {
  try {
    if (req.body.grade < 0 || req.body.grade > 10) {
      return res
        .status(400)
        .json({ message: "Grade must be between 0 and 10" });
    } else {
      let grade={};
      if (await checkIfGradeAlreadyExists(req.body.user_id, req.body.task_id)) {
        console.log("Grade already exists, updating it instead.");
        grade = await Grade.update(req.body, {
          where: { user_id: req.body.user_id, task_id: req.body.task_id },
        });
      }else{
        console.log("Grade does not exist, creating a new one.");
        grade = await Grade.create(req.body);

      }
      res.json(grade);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all grades from a specific task

router.put("/:id", async (req, res) => {
  try {
    if (req.body.grade < 0 || req.body.grade > 10) {
      return res
        .status(400)
        .json({ message: "Grade must be between 0 and 10" });
    }
    const grade = await Grade.update(req.body, {
      where: { id: req.params.id },
    });
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    const updatedGrade = await Grade.findByPk(req.params.id);
    if (!updatedGrade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.json(updatedGrade);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a grade
router.delete("/:id", async (req, res) => {
  try {
    const grade = await Grade.findByPk(req.params.id);
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    } else {
      await Grade.destroy({ where: { id: req.params.id } });
      res.json({ message: "Grade deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function checkIfGradeAlreadyExists(user_id, task_id) {
  let auxGrade=await Grade.findOne({ where: { user_id: user_id, task_id: task_id } })
  console.log(auxGrade);
  if (auxGrade) {
    return true;
  } else {
    return false;
  }
}
export default router;
