import express from "express";
import UserCourse from "../models/UserCourse.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { verifyTokenMiddleware } from "../token.js";
import { Op } from "sequelize";
const router = express.Router();

router.get("/", verifyTokenMiddleware, async (req, res) => {
    try {
        const userCourses = await UserCourse.findAll();
        res.json(userCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", verifyTokenMiddleware, async (req, res) => {
    try {
        const { course_id, user_id } = req.body;
        if (!course_id || !user_id) {
            return res.status(400).json({ message: "user_id i course_id són obligatoris" });
        }
        const existingUserCourse = await UserCourse.findOne({
            where: {
                user_id: user_id,
                course_id: course_id,
            },
        });
        if (existingUserCourse) {
            return res.status(400).json({ message: "La relació usuari-curs ja existeix" });
        }

        const userExists = await User.findByPk(user_id);
        if (!userExists) {
            return res.status(400).json({ message: "L'usuari no existeix" });
        }

        const courseExists = await Course.findByPk(course_id);
        if (!courseExists) {
            return res.status(400).json({ message: "El curs no existeix" });
        }

        const userCourse = await UserCourse.create({ user_id, course_id });
        res.json(userCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userCourse = await UserCourse.findByPk(id);

        if (!userCourse) {
            return res.status(404).json({ message: "Relació usuari-curs no trobada" });
        }

        await userCourse.destroy();
        res.json({ message: "Relació usuari-curs eliminada correctament" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/course/:course_id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { course_id } = req.params;
        const userCourses = await UserCourse.findAll({ where: { course_id } });

        if (!userCourses) {
            return res.status(404).json({ message: "No s'han trobat relacions per aquest curs" });
        }
        const userCoursesWithNames = await Promise.all(userCourses.map(async (userCourse) => {
            const user = await User.findByPk(userCourse.user_id, { attributes: ['name'] });
            return { user_id: userCourse.user_id, course_id: userCourse.course_id, name: user ? user.name : null };
        }));
        res.json(userCoursesWithNames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/user/:userId", verifyTokenMiddleware, async (req, res) => {
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
                    course_name: course ? course.course_name : "Curs no trobat",
                    course_description: course ? course.course_description : "Sense descripció disponible"
                };
            })
        );
        res.json(userCoursesWithNames);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/not-enrolled/:userId", verifyTokenMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const userCourses = await UserCourse.findAll({
            where: { user_id: userId },
        });
        const enrolledCourseIds = userCourses.map((userCourse) => userCourse.course_id);
        const courses = await Course.findAll({
            where: {
                id: {
                    [Op.notIn]: enrolledCourseIds,
                },
            },
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:userId/:courseId", verifyTokenMiddleware, async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const userCourse = await UserCourse.findOne({
            where: {
                user_id: userId,
                course_id: courseId,
            },
        });
        if (!userCourse) {
            return res.status(404).json({ message: "Relació usuari-curs no trobada" });
        }
        await userCourse.destroy();
        res.json({ message: "Relació usuari-curs eliminada correctament" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;