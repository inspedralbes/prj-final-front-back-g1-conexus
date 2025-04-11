import express from "express";
import User from "../models/User.js";
import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { generateToken, verifyTokenMiddleware, deleteToken } from "../token.js";
import { hashPassword, comparePassword } from "./routes/userRoutes.js";
import { createTokens } from "./token.js";

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
        const { typesUsers_id, name, email, password, banner, profile, department_id, description } = req.body;
        const user = await User.create({ typesUsers_id, name, email, password, banner, profile, department_id, description });
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
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { typesUsers_id, name, email, password, banner, profile, department_id, description } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.update({ typesUsers_id, name, email, password, banner, profile, department_id, description });
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
router.post('/login', async (req, res) => {
    const { email, name, token, profile } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            // Create new user if doesn't exist
            const hashedToken = await hashPassword(token);
            const banner = '/upload/banner_default.png';
            
            const newUser = await User.create({
                name,
                email,
                password: hashedToken,
                banner,
                profile
            });

            const tokens = createTokens(newUser);
            return res.status(200).json({ 
                message: 'User created and logged in successfully', 
                accessToken: tokens.accessToken, 
                refreshToken: tokens.refreshToken, 
                userLogin: newUser 
            });
        } else {
            // Verify password for existing user
            const match = await comparePassword(token, existingUser.password);
            
            if (!match) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            const tokens = createTokens(existingUser);
            return res.status(200).json({ 
                message: 'Login successful', 
                accessToken: tokens.accessToken, 
                refreshToken: tokens.refreshToken, 
                userLogin: existingUser 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Logout route
router.post('/logout', verifyTokenMiddleware, async (req, res) => {
    console.log('Logout:', req.body);
    const { accessToken, refreshToken } = req.body;

    if (!accessToken) return res.status(401).json({ error: 'Access token is required' });
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token is required' });

    try {
        await deleteToken(refreshToken);
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Error during logout' });
    }
});

export default router;