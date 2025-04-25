import express from "express";
import Task from "../models/Task.js";
import Grade from "../models/Grade.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const Tasks = await Task.findAll();
        res.json(Tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const Task = await Task.findByPk(req.params.id);
        res.json(Task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        const Task = await Task.create({ name });
        res.json(Task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const Task = await Task.update({ name }, { where: { id: req.params.id } });
        res.json(Task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const Task = await Task.findByPk(req.params.id);
        if (!Task) {
            return res.status(404).json({ message: "Task not found" });
        } else {
            await Task.destroy({ where: { id: req.params.id } });
            res.json({ message: "Task deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/getAllGradesFromTask/:id", async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, {
            include: [
                {
                    model: Grade,
                    as: "grades",
                },
            ],
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task.grades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

export default router;




