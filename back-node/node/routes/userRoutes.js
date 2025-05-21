import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { generateToken, verifyTokenMiddleware } from "../token.js";
import TypeUser from "../models/TypeUser.js";
import { Op } from "sequelize";
import fetch from 'node-fetch';
import fs from 'fs';

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

router.get("/", verifyTokenMiddleware, async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", upload.single('profile'), verifyTokenMiddleware, async (req, res) => {
    console.log("Req body:", req.body);
    console.log("Req file:", req.file);
    
    try {
        const { typeUsers_id, name, email, password } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: "Ja existeix un usuari amb aquest correu electrònic" 
            });
        }

        const profile = req.file ? `uploads/${req.file.filename}` : null;
        
        const user = await User.create({ 
            typeUsers_id, 
            name, 
            email, 
            password, 
            profile 
        });
        
        res.json(user);
    } catch (error) {
        console.error("Error en crear usuari:", error);
        res.status(500).json({ message: error.message });
    }
});

async function downloadImage(url, filename) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error en descarregar la imatge: ${response.statusText}`);
    }
    
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
        
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: "Ja existeix un usuari amb aquest correu electrònic" 
            });
        }
        
        let profilePath = null;
        
        if (req.file) {
            profilePath = `uploads/${req.file.filename}`;
        }
        else if (profile && (profile.startsWith('http://') || profile.startsWith('https://'))) {
            try {
                const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
                profilePath = await downloadImage(profile, uniqueFilename);
                console.log(`Imatge descarregada i desada a: ${profilePath}`);
            } catch (downloadError) {
                console.error("Error en descarregar la imatge:", downloadError);
            }
        }
        // Caso 3: Si ya es una ruta local (empieza con 'uploads/')
        else if (profile && profile.startsWith('api/uploads/')) {
            profilePath = profile;
        }
        
        const user = await User.create({ 
            typeUsers_id, 
            name, 
            email, 
            password, 
            profile: profilePath
        });
        
        res.json(user);
    } catch (error) {
        console.error("Error en registrar usuari:", error);
        res.status(500).json({ message: error.message });
    }
});

// Obtener un usuario por ID
router.get("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/email", verifyTokenMiddleware, async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);

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
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/personalData/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password, profile, department_id, description } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        await user.update({ name, password, profile, department_id, description });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/updateRole/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { typeUsers_id } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        await user.update({ typeUsers_id });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        if (user.profile) {
            try {
                const imagePath = path.resolve(user.profile);
                
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Imatge eliminada: ${imagePath}`);
                }
            } catch (imageError) {
                console.error("Error en eliminar la imatge:", imageError);
            }
        }
        await user.destroy();
        res.json({ message: "Usuari eliminat correctament" });
    } catch (error) {
        console.error("Error en eliminar usuari:", error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });

        console.log('Usuari existent:', existingUser);

        if (!existingUser) {
            return res.status(404).json({ error: 'Usuari no trobat' });
        }

        const match = await bcrypt.compare(password, existingUser.password);

        if (!match) {
            return res.status(404).json({ error: 'Contrasenya invàlida' });
        }

        const tokens = generateToken(existingUser);
        return res.status(200).json({
            message: 'Inici de sessió correcte',
            accessToken: tokens,
            userLogin: existingUser
        });
    } catch (error) {
        console.error('Error d\'inici de sessió:', error);
        res.status(500).json({ error: 'Error del servidor durant l\'inici de sessió' });
    }
});

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

router.get("/stats/count", async (req, res) => {
    try {
        const totalUsers = await User.count();
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

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
        console.error("Error en obtenir estadístiques d'usuaris:", error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/check-email", async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "El correu és obligatori" });
        }

        const existingUser = await User.findOne({ where: { email } });
        
        return res.json({ 
            exists: !!existingUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/updateDepartment/:id", verifyTokenMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { department_id } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        await user.update({ department_id });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

export async function getLatestUser() {
    try {
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
        console.error("Error en obtenir usuari recent:", error);
        throw error;
    }
}

export default router;