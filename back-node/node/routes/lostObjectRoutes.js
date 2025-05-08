import express from "express";
import LostObjects from "../models/LostObjects.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import multer from "multer";
import path from "path";

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
router.get("/", async (req, res) => {
  const lostObjectsList = await LostObjects.findAll({ order: [["createdAt", "DESC"]] });
  //return the LostObjects array
  res.json(lostObjectsList);
});

// GET /lost-objects/:id - Obtenir un objecte perdut per ID
router.get("/:id", async (req, res) => {
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
router.post("/", upload.single('image'),async (req, res) => {
  try {

    const lostObjectData = JSON.parse(req.body.data);
    const { title, description, user_id, expired_at } = lostObjectData;
    const image = req.file ? req.file.path : null;

    /**
     * Crea un nou objecte perdut a la base de dades.
     *
     * @async
     * @function
     * @returns {Promise<Object>} Retorna una promesa que resol amb l'objecte perdut creat.
     * @property {string} title - El títol del post de l'objecte perdut.
     * @property {string} description - La descripció de l'objecte perdut.
     * @property {string} image - La URL de la imatge de l'objecte perdut.
     * @property {number} user_id - L'identificador de l'usuari que ha creat l'objecte perdut.
     * @property {Date} expired_at - La data de caducitat de l'objecte perdut.
     */
    const newLostObject = await LostObjects.create({
      title,
      description,
      image,
      user_id,
      expired_at,
    });
    //return the new lostObject object
    res.status(201).json(newLostObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// PUT /lost-objects/:id - Actualitzar un objecte perdut per ID
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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

export default router;
