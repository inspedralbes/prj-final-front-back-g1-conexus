import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";

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

router.put("/updateCourse/:id", async (req, res) => {
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

//assign teacher to course
router.put("/assignTeacher", async (req, res) => {
  try {
    const { course_id, teacher_id } = req.body;
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    let teacher = await User.findByPk(teacher_id);
    if(teacher==null){
      return res.status(404).json({ message: "Teacher not found" });
    }else if(teacher.typeUsers_id!=1){
      return res.status(404).json({ teacher:teacher});
    } else{
      course.course_teacher_id = teacher_id;
      await course.save();
      res.json(course);
    }

    // const teacherExists = await checkIfUserIsTeacher(teacher_id);
    // if (!teacherExists) {
    //   return res.status(404).json({ message: "Teacher not found" });
    // }
    // course.course_teacher_id = teacher_id;
    // await course.save();
    // res.json(course);
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

// Get all courses without a teacher 
router.put("/withoutTeacher", async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { course_teacher_id: null },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// desassign teacher from course
router.put("/desassignTeacher/:course_id", async (req, res) => {
  try {
    const { course_id } = req.params;
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.course_teacher_id = null;
    await course.save();
    res.json(course);
  } catch (error) {
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

