import express from "express";
import Reports from "../models/Reports.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET /reports - Obtenir tots els informes
router.get("/", async (req, res) => {
    try {
        const reports = await Reports.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Room,
                    attributes: ["id", "room_name"],
                }
            ],
        });
        //retornar l'array d'informes
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get /reports/user/:user_id - Obtenir informes per ID d'usuari
router.get("/user/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const reports = await Reports.findAll({ where: { user_id } });
        if (!reports) {
            return res.status(404).json({ message: "No s'han trobat informes per a aquest usuari" });
        }
        //retornar l'array d'informes
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get /reports/room/:room_id - Obtenir informes per ID d'habitació
router.get("/room/:room_id", async (req, res) => {
    const { room_id } = req.params;
    try {
        const reports = await Reports.findAll({ where: { room_id } });
        if (!reports) {
            return res.status(404).json({ message: "No s'han trobat informes per a aquesta habitació" });
        }
        //retornar l'array d'informes
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get /reports/finished - Obtenir informes acabats
router.get("/finished", async (req, res) => {
    try {
        const reports = await Reports.findAll({ where: { finished: true } });
        if (!reports) {
            return res.status(404).json({ message: "No s'han trobat informes acabats" });
        }
        //retornar l'array d'informes acabats
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get /reports/not-finished - Obtenir informes no acabats
router.get("/not-finished", async (req, res) => {
    try {
        const reports = await Reports.findAll({ where: { finished: false } });
        if (!reports) {
            return res.status(404).json({ message: "No s'han trobat informes no acabats" });
        }
        //retornar l'array d'informes no acabats
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /reports/:id - Obtenir un informe per ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const report = await Reports.findOne({ where: { id } });
        if (!report) {
            return res.status(404).json({ message: "Informe no trobat" });
        }
        //retornar l'objecte informe
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /reports - Crear un nou informe
router.post("/", upload.single('image'), async (req, res) => {
    try {
        // Parse the JSON string from the data field
        const reportData = JSON.parse(req.body.data);
        const { user_id, report, room_id } = reportData;
        const image = req.file ? req.file.path : null;

        if (!user_id || !report || !room_id) {
            return res.status(400).json({ message: "user_id, report i room_id són obligatoris" });
        }

        /**
         * Crea un nou informe a la base de dades.
         *
         * @async
         * @function
         * @param {Object} reportData - Les dades per al nou informe.
         * @param {number} reportData.user_id - L'ID de l'usuari que crea l'informe.
         * @param {string} reportData.report - El contingut de l'informe.
         * @param {string} reportData.image - L'URL o ruta de la imatge associada amb l'informe.
         * @param {number} reportData.room_id - L'ID de l'habitació associada amb l'informe.
         * @returns {Promise<Object>} L'objecte del nou informe creat.
         */
        const newReport = await Reports.create({
            user_id,
            report,
            image,
            room_id
        });

        res.status(201).json(newReport);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: error.message });
    }
});

// PUT /reports/:id - Actualitzar un informe per ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const report = await Reports.findOne({ where: { id } });
        if (!report) {
            return res.status(404).json({ message: "Informe no trobat" });
        }
        await report.update(req.body);
        //retornar l'objecte informe actualitzat
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /reports/:id - Eliminar un informe per ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const report = await Reports.findOne({ where: { id } });
        if (!report) {
            return res.status(404).json({ message: "Informe no trobat" });
        }
        await report.destroy();
        //retornar un codi d'estat 204 per indicar l'eliminació amb èxit
        //i sense contingut al cos de la resposta
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
