import express from "express";
import Reports from "../models/Reports.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com",
  host: host,
  port: port,
  secure: false,
  auth: {
    user: user,
    pass: pass,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error with email transporter:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// GET /reports - Obtenir tots els informes
router.get("/", async (req, res) => {
  try {
    const reports = await Reports.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "AssignedUser",
          attributes: ["id", "name", "email"],
        },
        {
          model: Room,
          attributes: ["id", "room_name"],
        },
      ],
    });
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
      return res
        .status(404)
        .json({ message: "No s'han trobat informes per a aquest usuari" });
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
      return res
        .status(404)
        .json({ message: "No s'han trobat informes per a aquesta habitació" });
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
      return res
        .status(404)
        .json({ message: "No s'han trobat informes acabats" });
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
      return res
        .status(404)
        .json({ message: "No s'han trobat informes no acabats" });
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
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Parse the JSON string from the data field
    const reportData = JSON.parse(req.body.data);
    const { user_id, report, room_id } = reportData;
    const image = req.file ? req.file.path : null;

    if (!user_id || !report || !room_id) {
      return res
        .status(400)
        .json({ message: "user_id, report i room_id són obligatoris" });
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
      room_id,
    });

    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
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
    if (report.status === "revised") {
      const user = await User.findOne({ where: { id: report.user_id } });
      let note = null;
      if (report.note) {
        note = `Benvolgut/da ${user.name},\n\nEns complau informar-lo/la que l'informe amb ID ${report.id} amb descripció: ${report.report}\n\n  ha estat revisat i s'ha completat amb èxit.\n\nAtentament,\nL'equip de gestió d'informes. \n\nNota: ${report.note}`;

      } else {
        note = `Benvolgut/da ${user.name},\n\nEns complau informar-lo/la que l'informe amb ID ${report.id}amb descripció: ${report.report}\n\n ha estat revisat i s'ha completat amb èxit.\n\nAtentament,\nL'equip de gestió d'informes.`;

      }
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Informe Revisat",
        text: note,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }
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

router.put("/:id/assign", async (req, res) => {
  const { id } = req.params;
  const { user_assigned } = req.body;
  try {
    const report = await Reports.findOne({ where: { id } });
    if (!report) {
      return res.status(404).json({ message: "Informe no trobat" });
    }
    await report.update({ user_assigned });
    //retornar l'objecte informe actualitzat

    const updatedReport = await Reports.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "AssignedUser",
          attributes: ["id", "name", "email"],
        },
        {
          model: Room,
          attributes: ["id", "room_name"],
        },
      ],
    });
    if (!updatedReport) {
      return res.status(404).json({ message: "Informe no trobat" });
    }
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener estadísticas de incidencias (total i sense resoldre)
router.get("/stats/count", async (req, res) => {
  try {
    // Contar totes les incidències
    const totalReports = await Reports.count();

    // Contar incidències pendents (no resoltes)
    const pendingReports = await Reports.count({
      where: {
        status: {
          [Op.in]: ['pending', 'revising']
        }
      }
    });

    // Contar incidències resoltes
    const resolvedReports = await Reports.count({
      where: { status: 'revised' }
    });

    res.json({
      total: totalReports,
      pending: pendingReports,
      resolved: resolvedReports
    });
  } catch (error) {
    console.error("Error al obtener estadísticas de incidencias:", error);
    res.status(500).json({ message: error.message });
  }
});

export async function getLatestReport() {
  try {
    const latestReport = await Reports.findOne({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['name']
        },
        {
          model: Room,
          attributes: ['room_name']
        }
      ]
    });

    return latestReport;
  } catch (error) {
    console.error("Error al obtener incidencia reciente:", error);
    throw error;
  }
}

export default router;
