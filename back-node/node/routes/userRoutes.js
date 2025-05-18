import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { generateToken, verifyTokenMiddleware } from "../token.js";
import TypeUser from "../models/TypeUser.js";
import { Op } from "sequelize"; // Añade esta importación

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

export async function hashPassword(contrasenya) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasenya, salt);
    return hashedPassword
}

// Obtener todos los usuarios
router.get("/", verifyTokenMiddleware, async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo usuario
router.post("/", upload.single('profile'), async (req, res) => {
    console.log(req.body);
    try {
        const { typeUsers_id, name, email, password, profile } = req.body;
        
        // Verificar si ya existe un usuario con ese correo
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: "Ya existe un usuario con este correo electrónico" 
            });
        }
        
        // Validar el rol según el dominio del correo
        if (email.toLowerCase().includes('@gmail.com')) {
            // Si es Gmail, no permitir rol de Administrador (id=3) o Cantina (id=5)
            if (typeUsers_id == 3 || typeUsers_id == 5) {
                return res.status(403).json({ 
                    message: "Los usuarios con correo Gmail no pueden registrarse como Administrador o Cantina" 
                });
            }
        }
        
        // Si no existe y el rol es válido, crear el nuevo usuario
        const user = await User.create({ typeUsers_id, name, email, password, profile });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener un usuario por ID
router.get("/:id", verifyTokenMiddleware, async (req, res) => {
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

// Obtener un usuario por email
router.post("/email", verifyTokenMiddleware, async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);

        // Obtener el usuario con su tipo de usuario
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: TypeUser,
                    as: 'typeusers',
                    attributes: ['id', 'name']
                }
            ]
        });

        console.log(user);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un usuario por ID
router.put("/personalData/:id", verifyTokenMiddleware, async (req, res) => {
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
router.put("/updateRole/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { typeUsers_id } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await user.update({ typeUsers_id });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar un usuario por ID
router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
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

// Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });

        console.log('Existing user:', existingUser);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify password
        const match = await bcrypt.compare(password, existingUser.password);

        if (!match) {
            return res.status(404).json({ error: 'Invalid password' });
        }

        const tokens = generateToken(existingUser);
        return res.status(200).json({
            message: 'Login successful',
            accessToken: tokens,
            userLogin: existingUser
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Get all users with typeUsers_id=1 (teacher) from a specific department
router.get("/teachers/:department_id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { department_id } = req.params;
        const users = await User.findAll({
            where: {
                typeUsers_id: 1,
                department_id: department_id
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get stats: total users and users registered today
router.get("/stats/count", async (req, res) => {
    try {
        // Get total count of users
        const totalUsers = await User.count();

        // Get today's date boundaries (start and end of day)
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Count users registered today
        const todayUsers = await User.count({
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        res.json({
            total: totalUsers,
            registeredToday: todayUsers
        });
    } catch (error) {
        console.error("Error getting user stats:", error);
        res.status(500).json({ message: error.message });
    }
});

// Verificar si un correo ya está registrado y obtener los roles permitidos para ese dominio
router.post("/check-email", async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "El correo es requerido" });
        }
        
        // Verificar si el correo ya existe
        const existingUser = await User.findOne({ where: { email } });
        
        // Obtener todos los roles disponibles
        const allRoles = await TypeUser.findAll();
        
        // Filtrar roles según el dominio del correo
        let allowedRoles = [...allRoles];
        
        if (email.toLowerCase().includes('@gmail.com')) {
            // Si es gmail, excluir roles de Administrador (id=3) y Cantina (id=5)
            allowedRoles = allRoles.filter(role => 
                role.id !== 3 && role.id !== 5
            );
        }
        
        return res.json({ 
            exists: !!existingUser,
            allowedRoles: allowedRoles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Añadir esta función al final del archivo, antes de export default router
export async function getLatestUser() {
    try {
        // No necesitamos verificar token aquí
        const latestUser = await User.findOne({
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'email', 'typeUsers_id', 'createdAt'],
            include: [
                {
                    model: TypeUser,
                    as: 'typeusers',
                    attributes: ['name']
                }
            ]
        });
        
        return latestUser;
    } catch (error) {
        console.error("Error al obtener usuario reciente:", error);
        throw error;
    }
}

export default router;