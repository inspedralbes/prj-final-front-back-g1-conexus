import express from "express";
import LostObjects from "../models/LostObjects.js";

const router = express.Router();

// GET /lost-objects - Obtenir tots els objectes perduts
router.get("/", async (req, res) => {
  const LostObjects = await LostObjects.findAll();
  res.json(LostObjects);
});
// GET /lost-objects/:id - Obtenir un objecte perdut per ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const lostObject = await LostObjects.findOne({ where: { id } });
    if (!lostObject) {
      return res.status(404).json({ message: "Lost object not found" });
    }
    res.json(lostObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST /lost-objects - Crear un nou objecte perdut
router.post("/", async (req, res) => {
  try {
    const { title, description, image, user_id, expired_at } = req.body;
    /**
     * Crea un nou objecte perdut a la base de dades.
     *
     * @async
     * @function
     * @returns {Promise<Object>} Retorna una promesa que resol amb l'objecte perdut creat.
     * @property {string} title - El títol de l'objecte perdut.
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
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
