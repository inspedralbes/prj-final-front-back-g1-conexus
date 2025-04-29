import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { generateToken, verifyTokenMiddleware } from "../token.js";

const router = express.Router();

export async function hashPassword(contrasenya) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasenya, salt);
    return hashedPassword
}

// Obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
    console.log(req.body);
    try {
        const { typesUsers_id, name, email, password, profile, department_id, description } = req.body;
        const user = await User.create({ typesUsers_id, name, email, password, profile, department_id, description });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un usuario por ID
router.put("/personalData/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password, profile, department_id, description } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.update({ name, password, profile, department_id, description });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un usuario por ID (actualización de rol)
router.put("/updateRole/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { typesUsers_id } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.update({ typesUsers_id });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar un usuario por ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.destroy();
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login route
router.post('/loginAPI', async (req, res) => {
    const { email, name, token, profile } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            // Create new user if doesn't exist
            const hashedToken = await hashPassword(token);

            const newUser = await User.create({
                name,
                email,
                password: hashedToken,
                profile
            });

            const tokens = generateToken(newUser);
            return res.status(200).json({
                message: 'User created and logged in successfully',
                accessToken: tokens.accessToken,
                userLogin: newUser
            });
        } else {
            // Verify password for existing user
            const match = await comparePassword(token, existingUser.password);

            if (!match) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            const tokens = generateToken(existingUser);
            return res.status(200).json({
                message: 'Login successful',
                accessToken: tokens.accessToken,
                userLogin: existingUser
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

router.post('/loginDB', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });

        console.log('Existing user:', existingUser);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
            console.log('User not found');
        } else {
            console.log('User found:', existingUser);
        }

        // Verify password
        // const match = await bcrypt.compare(password, existingUser.password);

        // if (!match) {
        //     return res.status(400).json({ error: 'Invalid password' });
        //     console.log('Invalid password');
        // }

        const tokens = generateToken(existingUser);
        return res.status(200).json({
            message: 'Login successful',
            accessToken: tokens.accessToken,
            userLogin: existingUser
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

export default router;