import express from "express";
import Assistence from "../models/Assistence.js";
import User from "../models/User.js";
import UserCourse from "../models/UserCourse.js";
import Course from "../models/Course.js";
const router = express.Router();

router.get("/", async (req, res) => {
    const assistance = await Assistence.findAll();
    res.json(assistance);
});

router.get("/:id", async (req, res) => {
    try {
        const assistance = await Assistence.findByPk(req.params.id);
        res.json(assistance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log("req.body", req.body);
        console.log("user_id", req.body.user_id);
        console.log("course_id", req.body.course_id);
        console.log("hour", req.body.hour);
        console.log("assisted", req.body.assisted);
        console.log("day", req.body.day);
        let { user_id, course_id, hour, day, assisted } = req.body;
        if (!user_id || !course_id || !hour || !assisted) {
            return res.status(400).json({ message: "user_id, course_id, hour i assisted són obligatoris" });
        }
        course_id = parseInt(course_id);
        user_id = parseInt(user_id);
        //check if the user_id and course_id exist in the database
        const user = await User.findOne({ where: { id: user_id } });
        const course = await Course.findOne({ where: { id: course_id } });
        if (!user) {
            return res.status(404).json({ message: "user_id no trobat" });
        }
        if (!course) {
            return res.status(404).json({ message: "course_id no trobat" });
        }
        //check if the user is on the course
        const userCourse = await UserCourse.findOne({ where: { user_id, course_id } });
        if (!userCourse) {
            return res.status(404).json({ message: "user_id no està inscrit al course_id" });
        }
        //check if the hour and user is already in the database
        const hourExists = await Assistence.findOne({ where: { hour, user_id, day } });
        if (hourExists) {
            Assistence.update({ assisted }, { where: { hour, user_id, day } });
        }
        else {

            const assistance = await Assistence.create({ user_id, course_id, hour, assisted, day });
        }
        res.json(assistance);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { assisted } = req.body;
        const assistance = await Assistence.update({ assisted }, { where: { id: req.params.id } });
        res.json(assistance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const assistance = await Assistence.findByPk(req.params.id);
    if (!assistance) {
        return res.status(404).json({ message: "Assistance not found" });
    } else {
        try {
            await Assistence.destroy();
            res.json({ message: "Assistance deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
});

// Get all assistance from a course
router.get("/course/:id", async (req, res) => {
    try {
        const assistance = await Assistence.findAll({ where: { course_id: req.params.id } });
        res.json(assistance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all assistance from a day
router.get("/course/:courseId/day/:day", async (req, res) => {
    try {
        const { courseId, day } = req.params;
        const assistance = await Assistence.findAll({ where: { course_id: courseId, day } });
        res.json(assistance);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get all assistance from a user and a course
router.get("/user/:userId/course/:courseId", async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const assistance = await Assistence.findAll({ where: { user_id: userId, course_id: courseId } });
        let auxAssistance = [];
        assistance.forEach((assistance) => {
            if (assistance.assisted != "not selected") {
                auxAssistance.push(assistance);
            }
        });
        res.json(auxAssistance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;