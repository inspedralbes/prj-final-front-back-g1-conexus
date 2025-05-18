import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { generateToken, verifyTokenMiddleware } from "../token.js";
import TypeUser from "../models/TypeUser.js";
import { Op } from "sequelize"; // Añade esta importación
import fetch from 'node-fetch';  // Añade esta importación al inicio del archivo
import fs from 'fs';             // Añade esta importación para el sistema de archivos

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
router.post("/", upload.single('profile'), verifyTokenMiddleware, async (req, res) => {
    console.log("Req body:", req.body);
    console.log("Req file:", req.file);
    
    try {
        const { typeUsers_id, name, email, password } = req.body;
        
        // Verificar si ya existe un usuario con ese correo
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: "Ya existe un usuario con este correo electrónico" 
            });
        }

        // Capturar la ruta del archivo si existe
        const profile = req.file ? `uploads/${req.file.filename}` : null;
        
        const user = await User.create({ 
            typeUsers_id, 
            name, 
            email, 
            password, 
            profile  // Ahora guardamos la ruta de la imagen
        });
        
        res.json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: error.message });
    }
});

// Función auxiliar para descargar la imagen desde una URL
async function downloadImage(url, filename) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error al descargar la imagen: ${response.statusText}`);
    }
    
    // Crear directorio 'uploads' si no existe
    if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads');
    }
    
    const filePath = `uploads/${filename}`;
    const fileStream = fs.createWriteStream(filePath);
    
    return new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on("error", reject);
        fileStream.on("finish", () => resolve(filePath));
    });
}

router.post("/register", upload.single('profile'), async (req, res) => {
    console.log("Req body:", req.body);
    console.log("Req file:", req.file);
    
    try {
        const { typeUsers_id, name, email, password, profile } = req.body;
        
        // Verificar si ya existe un usuario con ese correo
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: "Ya existe un usuario con este correo electrónico" 
            });
        }
        
        let profilePath = null;
        
        // Caso 1: Si hay un archivo subido mediante multer
        if (req.file) {
            profilePath = `uploads/${req.file.filename}`;
        }
        // Caso 2: Si hay una URL de imagen en el campo profile
        else if (profile && (profile.startsWith('http://') || profile.startsWith('https://'))) {
            try {
                // Generar un nombre único y seguro para el archivo
                // Evitar usar la extensión de la URL original, ya que puede ser problemática
                const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
                
                // Descargar la imagen y obtener la ruta donde se guardó
                profilePath = await downloadImage(profile, uniqueFilename);
                console.log(`Imagen descargada y guardada en: ${profilePath}`);
            } catch (downloadError) {
                console.error("Error al descargar la imagen:", downloadError);
                // Continuar sin imagen si hay error en la descarga
            }
        }
        // Caso 3: Si ya es una ruta local (empieza con 'uploads/')
        else if (profile && profile.startsWith('uploads/')) {
            profilePath = profile;
        }
        
        // Crear el usuario con la ruta de la imagen (o null si no hay imagen)
        const user = await User.create({ 
            typeUsers_id, 
            name, 
            email, 
            password, 
            profile: profilePath
        });
        
        res.json(user);
    } catch (error) {
        console.error("Error registering user:", error);
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
router.post("/email", async (req, res) => {
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

        // Eliminar la imagen si existe
        if (user.profile) {
            try {
                // La ruta almacenada en la base de datos ya debe incluir 'uploads/'
                const imagePath = path.resolve(user.profile);
                
                // Verificar que el archivo existe antes de intentar eliminarlo
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Imagen eliminada: ${imagePath}`);
                }
            } catch (imageError) {
                console.error("Error al eliminar la imagen:", imageError);
                // Continuamos con la eliminación del usuario incluso si hay error con la imagen
            }
        }

        // Eliminar el usuario
        await user.destroy();
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
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