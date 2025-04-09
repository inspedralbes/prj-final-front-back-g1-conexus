import express from "express";
import Reports from "../models/Reports.js";

const router = express.Router();

// GET /reports - Get all reports
router.get("/", async (req, res) => {
    const reports = await Reports.findAll();
    res.json(reports);
});

// GET /reports/:id - Get a report by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const report = await Reports.findOne({ where: { id } });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /reports - Create a new report
router.post("/", async (req, res) => {
    try {
        const { user_id, report, status, image, room_id } = req.body;

        if (!user_id || !report || !room_id) {
            return res.status(400).json({ message: "user_id, report, and room_id are required" });
        }

        const newReport = await Reports.create({ user_id, report, status, image, room_id });
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /reports/:id - Update a report by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const report = await Reports.findOne({ where: { id } });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        await report.update(req.body);
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /reports/:id - Delete a report by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const report = await Reports.findOne({ where: { id } });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        await report.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
