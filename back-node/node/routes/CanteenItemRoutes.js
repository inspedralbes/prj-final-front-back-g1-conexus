import express from "express";
import CanteenItem from "../models/CanteenItem.js";
import e from "express";

const router = express.Router();

//Get all canteen items
router.get("/", async (req, res) => {
    try {
        const canteenItems = await CanteenItem.findAll();
        res.json(canteenItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

// Get a specific canteen item by ID
router.get("/:id", async (req, res) => {
    try {
        const canteenItem = await CanteenItem.findByPk(req.params.id);
        if (!canteenItem) {
            return res.status(404).json({ message: "Canteen item not found" });
        }
        res.json(canteenItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

//Post a new canteen item
router.post("/", async (req, res) => {
    try {
        const { product_name, product_price } = req.body;
        const canteenItem = await CanteenItem.create({ product_name, product_price, product_enabled: true });
        res.status(201).json(canteenItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

// Update a canteen item
router.put("/:id", async (req, res) => {
    try {
        const { product_name, product_price, product_enabled } = req.body;
        const canteenItem = await CanteenItem.update(
            { product_name, product_price, product_enabled },
            { where: { id: req.params.id } }
        );
        if (!canteenItem) {
            return res.status(404).json({ message: "Canteen item not found" });
        }
        res.json(canteenItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

// Delete a canteen item
router.delete("/:id", async (req, res) => {
    try {
        const canteenItem = await CanteenItem.destroy({ where: { id: req.params.id } });
        if (!canteenItem) {
            return res.status(404).json({ message: "Canteen item not found" });
        }
        res.json({ message: "Canteen item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

// Get all enabled canteen items
router.get("/enabled", async (req, res) => {
    try {
        const canteenItems = await CanteenItem.findAll({ where: { product_enabled: true } });
        res.json(canteenItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

// Get all disabled canteen items
router.get("/disabled", async (req, res) => {
    try {
        const canteenItems = await CanteenItem.findAll({ where: { product_enabled: false } });
        res.json(canteenItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

export default router;
