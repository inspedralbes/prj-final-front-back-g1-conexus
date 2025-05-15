import express from "express";
import Task from "../models/Task.js";
import Grade from "../models/Grade.js";
import Course from "../models/Course.js";

const router = express.Router();

// Obtenir totes les tasques
router.get("/", async (req, res) => {
    try {
        const Tasks = await Task.findAll();
        res.json(Tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir una tasca en concret
router.get("/:id", async (req, res) => {
    try {
        const Task = await Task.findByPk(req.params.id);
        res.json(Task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una tasca nova
router.post("/", async (req, res) => {
    try {
        const { task_name, course_id, task_description } = req.body;
        const task_ended = false; // Valor per defecte
        const newTask = await Task.create({ task_name, course_id, task_description, task_ended });
        res.json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualitzar una tasca existent
router.put("/:id", async (req, res) => {
    try {
        const { task_name, course_id, task_description, task_ended } = req.body;
        const auxTask = await Task.findByPk(req.params.id);
        if (!auxTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        auxTask.task_name = task_name;
        auxTask.course_id = course_id;
        auxTask.task_description = task_description;
        auxTask.task_ended = task_ended;
        await auxTask.save();
        res.json(auxTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar una tasca
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

// Obtenir totes les notes d'una tasca
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
//Obtenir totes les tasques d'un curs
router.get("/getAllTasksFromCourse/:id", async (req, res) => {
    try {
        const task = await Task.findAll({ where: { course_id: req.params.id } });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);
//Obtenir totes les tasques d'un alumne
router.get("/getAllTasksFromStudent/:id", async (req, res) => {
    try {
        const task = await Task.findAll({ where: { user_id: req.params.id } });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);
//Obtenir totes les tasques d'un alumne d'un curs
router.get("/getAllTasksFromStudentFromCourse/:courseId/:studentId", async (req, res) => {
    try {
        const task = await Task.findAll({ where: { course_id: req.params.courseId, user_id: req.params.studentId } });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

export async function getLatestTask() {
    try {
        const latestTask = await Task.findOne({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Course,
                    attributes: ['course_name']
                }
            ]
        });
        
        return latestTask;
    } catch (error) {
        console.error("Error al obtener tarea reciente:", error);
        throw error;
    }
}

export default router;




