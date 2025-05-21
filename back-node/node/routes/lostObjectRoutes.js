import express from "express";
import LostObjects from "../models/LostObjects.js";
import Response from "../models/Response.js";
import multer from "multer";
import path from "path";
import { verifyTokenMiddleware } from "../token.js";
import { Op } from "sequelize";

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
  const lostObjectsList = await LostObjects.findAll({ order: [["createdAt", "DESC"]] });
  res.json(lostObjectsList);
});

router.get("/:id", verifyTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const lostObject = await LostObjects.findOne({ where: { id } });
    if (!lostObject) {
      return res.status(404).json({ message: "Objecte perdut no trobat" });
    }
    res.json(lostObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", verifyTokenMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, user_id } = req.body;
    const image = req.file ? req.file.path : null;

    if (!title || !description || !user_id) {
      return res.status(400).json({ message: "Falten camps obligatoris" });
    }

    const newLostObject = await LostObjects.create({
      title,
      description,
      image,
      user_id: Number(user_id) || 1,
    });

    res.status(201).json(newLostObject);
  } catch (error) {
    console.error("Error en crear objecte perdut:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", verifyTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const lostObject = await LostObjects.findOne({ where: { id } });
    if (!lostObject) {
      return res.status(404).json({ message: "Objecte perdut no trobat" });
    }
    await lostObject.update(req.body);
    res.json(lostObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const lostObject = await LostObjects.findOne({ where: { id } });
    if (!lostObject) {
      return res.status(404).json({ message: "Objecte perdut no trobat" });
    }
    await lostObject.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/responses", verifyTokenMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const responses = await Response.findAll({
            where: { lostAndFound_id: id },
            order: [["createdAt", "DESC"]]
        });
        res.json(responses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:id/responses", verifyTokenMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const { user_id, comment } = req.body;

        if (!user_id || !comment) {
            return res.status(400).json({ message: "user_id i comment són obligatoris" });
        }

        const newResponse = await Response.create({
            user_id,
            lostAndFound_id: id,
            comment
        });
        res.status(201).json(newResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id/responses/:responseId", verifyTokenMiddleware, async (req, res) => {
    const { id, responseId } = req.params;
    try {
        const response = await Response.findOne({
            where: {
                id: responseId,
                lostAndFound_id: id
            }
        });

        if (!response) {
            return res.status(404).json({ message: "Resposta no trobada" });
        }

        await response.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/stats/count", verifyTokenMiddleware, async (req, res) => {
  try {
    const totalLostObjects = await LostObjects.count();
    
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const todayLostObjects = await LostObjects.count({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });
    
    res.json({
      total: totalLostObjects,
      reportedToday: todayLostObjects
    });
  } catch (error) {
    console.error("Error al obtenir estadístiques d'objectes perduts:", error);
    res.status(500).json({ message: error.message });
  }
});

export async function getLatestLostObject() {
    try {
        const latestLostObject = await LostObjects.findOne({
            order: [['createdAt', 'DESC']]
        });
        
        return latestLostObject;
    } catch (error) {
        console.error("Error al obtenir objecte perdut recent:", error);
        throw error;
    }
}

export default router;