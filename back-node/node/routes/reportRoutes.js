import express from "express";
import Reports from "../models/Reports.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { verifyTokenMiddleware } from "../token.js";
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
    console.error("Error amb el transportador de correu:", error);
  } else {
    console.log("Transportador de correu preparat");
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

router.get("/", verifyTokenMiddleware, async (req, res) => {
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

router.get("/user/:user_id", verifyTokenMiddleware, async (req, res) => {
  const { user_id } = req.params;
  try {
    const reports = await Reports.findAll({ where: { user_id } });
    if (!reports) {
      return res
        .status(404)
        .json({ message: "No s'han trobat informes per a aquest usuari" });
    }
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/room/:room_id", verifyTokenMiddleware, async (req, res) => {
  const { room_id } = req.params;
  try {
    const reports = await Reports.findAll({ where: { room_id } });
    if (!reports) {
      return res
        .status(404)
        .json({ message: "No s'han trobat informes per a aquesta habitació" });
    }
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/finished", verifyTokenMiddleware, async (req, res) => {
  try {
    const reports = await Reports.findAll({ where: { finished: true } });
    if (!reports) {
      return res
        .status(404)
        .json({ message: "No s'han trobat informes acabats" });
    }
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/not-finished", verifyTokenMiddleware, async (req, res) => {
  try {
    const reports = await Reports.findAll({ where: { finished: false } });
    if (!reports) {
      return res
        .status(404)
        .json({ message: "No s'han trobat informes no acabats" });
    }
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", verifyTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Reports.findOne({ where: { id } });
    if (!report) {
      return res.status(404).json({ message: "Informe no trobat" });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", verifyTokenMiddleware, upload.single("image"), async (req, res) => {
  try {
    const reportData = JSON.parse(req.body.data);
    const { user_id, report, room_id } = reportData;
    const image = req.file ? req.file.path : null;

    if (!user_id || !report || !room_id) {
      return res
        .status(400)
        .json({ message: "user_id, report i room_id són obligatoris" });
    }

    const newReport = await Reports.create({
      user_id,
      report,
      image,
      room_id,
    });

    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error en crear informe:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", verifyTokenMiddleware, async (req, res) => {
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
          console.error("Error en enviar correu:", error);
        } else {
          console.log("Correu enviat:", info.response);
        }
      });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Reports.findOne({ where: { id } });

    if (!report) {
      return res.status(404).json({ message: "Informe no trobat" });
    }

    if (report.image) {
      const fs = await import('fs');
      const path = await import('path');

      const imagePath = path.default.join(process.cwd(), report.image);
    
      if (fs.default.existsSync(imagePath)) {
        fs.default.unlinkSync(imagePath);
        console.log(`Imatge eliminada: ${imagePath}`);
      } else {
        console.log(`Imatge no trobada al sistema de fitxers: ${imagePath}`);
      }
    }

    await report.destroy();
    
    res.status(204).send();
  } catch (error) {
    console.error("Error en eliminar informe:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/assign", verifyTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  const { user_assigned } = req.body;
  try {
    const report = await Reports.findOne({ where: { id } });
    if (!report) {
      return res.status(404).json({ message: "Informe no trobat" });
    }
    await report.update({ user_assigned });

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

router.get("/stats/count", verifyTokenMiddleware, async (req, res) => {
  try {
    const totalReports = await Reports.count();

    const pendingReports = await Reports.count({
      where: {
        status: {
          [Op.in]: ['pending', 'revising']
        }
      }
    });

    const resolvedReports = await Reports.count({
      where: { status: 'revised' }
    });

    res.json({
      total: totalReports,
      pending: pendingReports,
      resolved: resolvedReports
    });
  } catch (error) {
    console.error("Error en obtenir estadístiques d'incidències:", error);
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
    console.error("Error en obtenir incidència recent:", error);
    throw error;
  }
}

export default router;
