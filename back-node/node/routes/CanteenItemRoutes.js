import express from "express";
import CanteenItem from "../models/CanteenItem.js";
import { verifyTokenMiddleware } from "../token.js";

const router = express.Router();

router.get("/", verifyTokenMiddleware, async (req, res) => {
    try {
        const canteenItems = await CanteenItem.findAll();
        res.json(canteenItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const canteenItem = await CanteenItem.findByPk(req.params.id);
        if (!canteenItem) {
            return res.status(404).json({ message: "Element de cantina no trobat" });
        }
        res.json(canteenItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", verifyTokenMiddleware, async (req, res) => {
    try {
        const { product_name, product_price } = req.body;
        const canteenItem = await CanteenItem.create({ product_name, product_price, product_enabled: true });
        res.status(201).json(canteenItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { product_name, product_price, product_enabled } = req.body;
        const canteenItem = await CanteenItem.update(
            { product_name, product_price, product_enabled },
            { where: { id: req.params.id } }
        );
        if (!canteenItem) {
            return res.status(404).json({ message: "Element de cantina no trobat" });
        }
        res.json(canteenItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const canteenItem = await CanteenItem.destroy({ where: { id: req.params.id } });
        if (!canteenItem) {
            return res.status(404).json({ message: "Element de cantina no trobat" });
        }
        res.json({ message: "Element de cantina eliminat correctament" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/allItems/enabled", verifyTokenMiddleware, async (req, res) => {
    try {
        const canteenItems = await CanteenItem.findAll({ where: { product_enabled: true } });
        res.json(canteenItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/allItems/disabled", verifyTokenMiddleware, async (req, res) => {
    try {
        const canteenItems = await CanteenItem.findAll({ where: { product_enabled: false } });
        res.json(canteenItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;