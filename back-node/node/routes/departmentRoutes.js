import express from "express";
import Department from "../models/Department";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        const department = await Department.create({ name });
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const department = await Department.update({ name }, { where: { id: req.params.id } });
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        } else {
            await Department.destroy({ where: { id: req.params.id } });
            res.json({ message: "Department deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;




