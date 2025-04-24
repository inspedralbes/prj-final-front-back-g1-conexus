import express from "express";
import Assistence from "../models/Assistence.js";

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
        const { user_id, course_id, hour, assisted } = req.body;
        if (!user_id || !course_id || !hour || !assisted) {
            return res.status(400).json({ message: "user_id, course_id, hour i assisted són obligatoris" });
        }
        //check if the user_id and course_id exist in the database
        const user = await Assistence.findOne({ where: { user_id } });
        const course = await Assistence.findOne({ where: { course_id } });
        if (!user) {
            return res.status(404).json({ message: "user_id no trobat" });
        }
        if (!course) {
            return res.status(404).json({ message: "course_id no trobat" });
        }
        //check if the hour and user is already in the database
        const hourExists = await Assistence.findOne({ where: { hour, user_id } });
        if (hourExists) {
            Assistence.update({ assisted }, { where: {  hour, user_id } });  
        }
        
        const assistance = await Assistence.create({ user_id, course_id, hour, assisted });
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
router.get("/day/:id", async (req, res) => {
    try {
        const assistance = await Assistence.findAll({ where: { day: req.params.id } });
        res.json(assistance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;

