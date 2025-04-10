import express from "express";
import Reports from "../models/Reports.js";

const router = express.Router();

// GET /reports - Obtenir tots els informes
router.get("/", async (req, res) => {
    const reports = await Reports.findAll();
    //retornar l'array d'informes
    res.json(reports);
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
router.post("/", async (req, res) => {
    try {
        const { user_id, report,  image, room_id } = req.body;

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
        const newReport = await Reports.create({ user_id, report, image, room_id });
        //retornar l'objecte del nou informe
        res.status(201).json(newReport);
    } catch (error) {
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
