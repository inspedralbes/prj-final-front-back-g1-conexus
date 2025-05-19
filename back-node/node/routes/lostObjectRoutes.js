import express from "express";
import LostObjects from "../models/LostObjects.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import Response from "../models/Response.js";
import multer from "multer";
import path from "path";
import { verifyTokenMiddleware } from "../token.js";
import { Op } from "sequelize"; // Añade esta importación al principi

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

// GET /lost-objects - Obtenir tots els objectes perduts
router.get("/", verifyTokenMiddleware, async (req, res) => {
  const lostObjectsList = await LostObjects.findAll({ order: [["createdAt", "DESC"]] });
  //return the LostObjects array
  res.json(lostObjectsList);
});

// GET /lost-objects/:id - Obtenir un objecte perdut per ID
router.get("/:id", verifyTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const lostObject = await LostObjects.findOne({ where: { id } });
    if (!lostObject) {
      return res.status(404).json({ message: "Lost object not found" });
    }
    //return the lostObject object
    res.json(lostObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST /lost-objects - Crear un nou objecte perdut
router.post("/", verifyTokenMiddleware, upload.single('image'), async (req, res) => {
  try {
    // Obtenim les dades del formulari directament del cos de la sol·licitud
    const { title, description, user_id } = req.body;
    const image = req.file ? req.file.path : null;

    // Comprovem que totes les dades necessàries existeixen
    if (!title || !description || !user_id) {
      return res.status(400).json({ message: "Falten camps obligatoris" });
    }

    // Creem l'objecte perdut a la base de dades
    const newLostObject = await LostObjects.create({
      title,
      description,
      image,
      user_id: Number(user_id) || 1,
      // Si cal, pots afegir la data aquí
      // created_at: foundDate || new Date()
    });

    // Retornem l'objecte creat
    res.status(201).json(newLostObject);
  } catch (error) {
    console.error("Error en crear objecte perdut:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /lost-objects/:id - Actualitzar un objecte perdut per ID
router.put("/:id", verifyTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const lostObject = await LostObjects.findOne({ where: { id } });
    if (!lostObject) {
      return res.status(404).json({ message: "Lost object not found" });
    }
    await lostObject.update(req.body);
    //return the updated lostObject object
    res.json(lostObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE /lost-objects/:id - Eliminar un objecte perdut per ID
router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const lostObject = await LostObjects.findOne({ where: { id } });
    if (!lostObject) {
      return res.status(404).json({ message: "Lost object not found" });
    }
    await lostObject.destroy();
    // return 204 indicating the successful deletion
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /lost-objects/:id/responses - Obtenir totes les respostes d'un objecte perdut
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

// POST /lost-objects/:id/responses - Crear una nova resposta per un objecte perdut
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

// DELETE /lost-objects/:id/responses/:responseId - Eliminar una resposta d'un objecte perdut
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

// GET /lost-objects/:id/responses - Obtenir totes les respostes d'un objecte perdut
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

// POST /lost-objects/:id/responses - Crear una nova resposta per un objecte perdut
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

// DELETE /lost-objects/:id/responses/:responseId - Eliminar una resposta d'un objecte perdut
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

// Obtener estadísticas de objetos perdidos (total i d'avui)
router.get("/stats/count", verifyTokenMiddleware, async (req, res) => {
  try {
    // Contar tots els objectes perduts
    const totalLostObjects = await LostObjects.count();
    
    // Preparar dates per avui
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    // Contar objectes perduts reportats avui
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
    console.error("Error al obtener estadísticas de objetos perdidos:", error);
    res.status(500).json({ message: error.message });
  }
});

// Añadir esta función al final del archivo, antes de export default router
export async function getLatestLostObject() {
    try {
        const latestLostObject = await LostObjects.findOne({
            order: [['createdAt', 'DESC']]
        });
        
        return latestLostObject;
    } catch (error) {
        console.error("Error al obtener objeto perdido reciente:", error);
        throw error;
    }
}

export default router;
