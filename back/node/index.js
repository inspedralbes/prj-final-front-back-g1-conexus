/* ----------------------------------------- IMPORTS ----------------------------------------- */
const fileUpload = require('express-fileupload');
const { Server } = require('socket.io');
const { createServer } = require('http');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const refreshKey = process.env.REFRESH_KEY;

const refreshTokensDB = new Set();

const app = express();
const port = process.env.PORT;

/* ----------------------------------------- SERVER APP ----------------------------------------- */
app.use(express.json());
app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

app.use(fileUpload());

/* ----------------------------------------- DATABASE ----------------------------------------- */
const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
};

/* ----------------------------------------- SOCKETS ----------------------------------------- */
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        allowedHeaders: ["Access-Control-Allow-Origin"],
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('newComment', (comment) => {
        console.log('newComment event received', comment);
        io.emit('updateComments');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

/* ----------------------------------------- ROUTES ----------------------------------------- */
// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World! XDDDDDDDDDDDDDDD');
});

app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Login with api's google, github, discord
app.post('/loginAPI', async (req, res) => {
    const { email, name, token, profile } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    let userLogin = {};

    try {
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length == 0) {
            let tokenHash = await hashPassword(token);
            let banner = '/upload/banner_default.png';
            const [result] = await connection.execute('INSERT INTO users (name, email, password, banner, profile) VALUES (?, ?, ?, ?, ?)', [name, email, tokenHash, banner, profile]);
            const [resultNewUser] = await connection.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
            userLogin = resultNewUser[0];
        } else {
            let password = users[0].password;
            let match = await comparePassword(token, password);
            if (!match) {
                return res.status(400).json({ error: 'Invalid password' });
            } else {
                if (users[0].class_id != null) {
                    const [resultClassName] = await connection.execute('SELECT * FROM classes WHERE id = ?', [users[0].class_id]);
                    let className = resultClassName[0].name;
                    userLogin = users[0];
                    userLogin.class_name = className;

                    const [following]= await connection.execute('SELECT * FROM following WHERE user_id = ?', [userLogin.id]);
                    const [followers]= await connection.execute('SELECT * FROM following WHERE following_id = ?', [userLogin.id]);
                    userLogin.following = following;
                    userLogin.followers = followers;
                } else {
                    userLogin = users[0];
                }
            }
        }

        const tokenJW = jwt.sign({ id: userLogin.id, email: userLogin.email }, secretKey, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: userLogin.id, email: userLogin.email }, refreshKey, { expiresIn: '7d' });

        refreshTokensDB.add(refreshToken);

        res.status(200).json({ message: 'Login successful', accessToken: tokenJW, refreshToken: refreshToken, userLogin });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    } finally {
        connection.end();
        console.log('Connection closed');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    let userLogin = {};

    try {
        console.log(email, password);

        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length == 0) return res.status(400).json({ error: 'User not found' });

        let passwordDB = users[0].password;

        if (email.includes('@example.com')) {
            console.log('Email de ejemplo');
            if (password != passwordDB) {
                console.log('Contraseña incorrecta');
                return res.status(400).json({ error: 'Invalid password' });
            } else {
                const [resultClassName] = await connection.execute('SELECT * FROM classes WHERE id = ?', [users[0].class_id]);
                let className = resultClassName[0].name;
                userLogin = users[0];
                userLogin.class_name = className;
            }
        } else {
            let match = await comparePassword(password, passwordDB);
            if (!match) {
                return res.status(400).json({ error: 'Invalid password' });
            } else {
                const [resultClassName] = await connection.execute('SELECT * FROM classes WHERE id = ?', [users[0].class_id]);
                let className = resultClassName[0].name;
                userLogin = users[0];
                userLogin.class_name = className;
            }
        }

        const aToken = jwt.sign({ id: userLogin.id, email: userLogin.email }, secretKey, { expiresIn: '1h' });
        const rToken = jwt.sign({ id: userLogin.id, email: userLogin.email }, refreshKey, { expiresIn: '7d' })

        refreshTokensDB.add(rToken);

        res.status(200).json({ message: 'Login successful', accessToken: aToken, refreshToken: rToken, userLogin });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    } finally {
        connection.end();
        console.log('Connection closed');
    }
});

//Edit generalInfo
app.put("/editGeneralInfo/:id", async (req,res)=>{
    const { id } = req.params;
    const { name, city } = req.body;

    let profilePicture = req.files ? req.files.profilePicture : null;
    let bannerPicture = req.files ? req.files.bannerPicture : null;

    console.log("bannerPicture", req.files);

    if (profilePicture) {
        const profilePath = path.join(__dirname, 'upload', profilePicture.name);
        await profilePicture.mv(profilePath);
        profilePicture = `/upload/${profilePicture.name}`;
    }

    if (bannerPicture) {
        const bannerPath = path.join(__dirname, 'upload', bannerPicture.name);
        await bannerPicture.mv(bannerPath);
        bannerPicture = `/upload/${bannerPicture.name}`;
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        let query = 'UPDATE users SET name = ?, city = ?';
        let values = [name, city];

        if (bannerPicture) {
            query += ', banner = ?';
            values.push(bannerPicture);
        }

        if (profilePicture) {
            query += ', profile = ?';
            values.push(profilePicture);
        }

        query += ' WHERE id = ?';
        values.push(id);

        const [result] = await connection.execute(query, values);
        

        if (result.affectedRows == 0) return res.status(404).json({ error: 'User not found' });

        const [updatedUser] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        connection.end();
        if (updatedUser.length == 0) return res.status(404).json({ error: 'User not found' });
        console.log("Responding")
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
})

//Edit PersonalInfo
app.put("/editData/:id",async (req,res)=>{
    const { id } = req.params;
    const { description,phone,tags,skills,Instagram,Twitter,Linkedin,Facebook,Github,title } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    console.log("editDataTime")
    try {
        const [result] = await connection.execute(
            'UPDATE users SET Linkedin = ?, Instagram = ?, description = ?, Twitter = ?, Github = ?, Facebook = ?, title=?, phone=?,softwareSkills=?, languages=? WHERE id = ?',
            [Linkedin,Instagram,description,Twitter,Github,Facebook,title,phone,skills,tags,id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ "error": 'Database error', "errorText": error });
    }
})

//Edit Availability
app.put("/updateAvailability/:id",async (req,res)=>{
    const { id } = req.params;
    let { availability } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    console.log("editAvailability")
    if(availability.length == 0){
        availability = null;
    }
    try {
        const [result] = await connection.execute(
            'UPDATE users SET availability = ? WHERE id = ?',
            [availability,id]
        );
        const [updatedUser] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        connection.end();
        if (updatedUser.length == 0) return res.status(404).json({ error: 'User not found' });
        console.log("Responding")
        res.status(200).json(updatedUser);
       
    } catch (error) {
        res.status(500).json({ "error": 'Database error', "errorText": error });
    }
    
})

// Access User for email
app.get('/user', verifyToken, async (req, res) => {
    const email = req.query.email;

    console.log('Email:', req.query.email);

    if (!email) {
        return res.status(400).json({ error: 'Email es requerido' });
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length == 0) {
            return res.status(404).json({ error: 'User not found' });
        } else if (users[0].class_id != null) {
            const [resultClassName] = await connection.execute('SELECT * FROM classes WHERE id = ?', [users[0].class_id]);
            let className = resultClassName[0].name;
            userLogin = users[0];
            userLogin.class_name = className;
        } else {
            userLogin = users[0];
        }

        res.status(200).json(userLogin);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    } finally {
        connection.end();
    }
});

// Logout route
app.post('/logout', verifyToken, async (req, res) => {
    console.log('Logout:', req.body);
    const { accessToken, refreshToken } = req.body;

    if (!accessToken) return res.status(401).send('Token is required');
    if (!refreshToken) return res.status(401).send('Token is required');

    refreshTokensDB.delete(refreshToken);
    console.log('HOLAAAAAAAAAAAAAAAA');
    res.status(200).send('User logout successfully');
});

// CRUD operations for users
app.get('/users', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT 
                users.id, 
                users.name, 
                users.email,
                users.banner,
                users.profile,
                qualifications.name AS qualification,
                users.Github
            FROM 
                users
            LEFT JOIN 
                qualifications
            ON 
                users.qualification_id = qualifications.id
            WHERE 
                users.typesUsers_id = 1
        `);
        connection.end();
        console.log('rows: ', rows);
        res.json(rows);
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: 'Database error:'+error.message });
    }
});

app.get('/usersAll', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/userProfile/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id,name, email, banner, profile, city, tags, availability, class_id, Linkedin, Instagram, Twitter, Github, Facebook, title, phone, softwareSkills, languages, description FROM users WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'User not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }

});

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'User not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/users/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, email, password, typesUsers_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE users SET name = ?, email = ?, password = ?, typesUsers_id = ? WHERE id = ?',
            [name, email, hashedPassword, typesUsers_id, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for newDataUsers
app.get('/newDataUsers', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM newDataUsers');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/newDataUsers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM newDataUsers WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'User not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/newDataUsers', verifyToken, async (req, res) => {
    try {
        console.log('New data user:', req.body);
        const { userPinia, userData } = req.body;

        // Validar que ambos objetos existan
        if (!userPinia || !userData) {
            return res.status(400).json({ error: 'Datos incompletos: se necesitan userPinia y userData.' });
        }

        // Fusionar los datos: Actualizar userPinia con los valores de userData
        const updatedUser = {
            ...userPinia,
            ...userData,
            tags: userData.tags || userPinia.tags, // Manejar valores específicos
            availibility: userData.availibility || userPinia.availibility,
        };

        console.log('Usuario actualizado:', updatedUser);

        // Convertir `tags` y `availibility` a JSON string si no están vacíos
        if (updatedUser.tags && typeof updatedUser.tags !== 'string') {
            updatedUser.tags = JSON.stringify(updatedUser.tags);
        }

        if (updatedUser.availibility && typeof updatedUser.availibility !== 'string') {
            updatedUser.availibility = JSON.stringify(updatedUser.availibility);
        }

        // Aquí va la lógica para guardar los datos en la base de datos
        const connection = await mysql.createConnection(dbConfig);
        const query = `
            INSERT INTO newDataUsers (typesUsers_id, user_id, name, email, password, banner, profile, class_id, city, discord_link, github_link, tags, availibility)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            updatedUser.typesUsers_id,
            updatedUser.user_id,
            updatedUser.name,
            updatedUser.email,
            updatedUser.password,
            updatedUser.banner,
            updatedUser.profile,
            updatedUser.class_id,
            updatedUser.city,
            updatedUser.discord_link,
            updatedUser.github_link,
            updatedUser.tags,
            updatedUser.availibility,
        ];
        await connection.execute(query, values);
        connection.end();

        // Simulación de respuesta exitosa
        res.status(201).json({ message: 'Datos del usuario actualizados correctamente', updatedUser });
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.put('/newDataUsers/:id', async (req, res) => {
    const { id } = req.params;
    const { typesUsers_id, user_id, name, email, password, token, banner, profile, status, class_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE newDataUsers SET typesUsers_id = ?, user_id = ?, name = ?, email = ?, password = ?, token = ?, banner = ?, profile = ?, status = ?, class_id = ? WHERE id = ?',
            [typesUsers_id, user_id, name, email, hashedPassword, token, banner, profile, status, class_id, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'New data user updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/newDataUsers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM newDataUsers WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'New data user deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for qualifications
app.get('/qualifications', verifyToken, async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM qualifications');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/qualifications/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM qualifications WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'Qualification not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/qualifications', verifyToken, async (req, res) => {
    const { name } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO qualifications (name) VALUES (?)',
            [name]
        );
        connection.end();
        res.status(201).json({ message: 'Qualification created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/qualifications/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE qualifications SET name = ? WHERE id = ?',
            [name, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Qualification not found' });

        res.json({ message: 'Qualification updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/qualifications/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM qualifications WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Qualification not found' });

        res.json({ message: 'Qualification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for usersQualifications
app.get('/users/qualifications', verifyToken, async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM usersQualifications');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/users/qualifications/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM usersQualifications WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'UserQualification not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/users/qualifications', verifyToken, async (req, res) => {
    const { user_id, qualification_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO usersQualifications (user_id, qualification_id) VALUES (?, ?)',
            [user_id, qualification_id]
        );
        connection.end();
        res.status(201).json({ message: 'UserQualification created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/users/qualifications/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { user_id, qualification_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE usersQualifications SET user_id = ?, qualification_id = ? WHERE id = ?',
            [user_id, qualification_id, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'UserQualification not found' });

        res.json({ message: 'UserQualification updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/users/qualifications/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM usersQualifications WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'UserQualification not found' });

        res.json({ message: 'UserQualification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for classes
app.get('/classes', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM classes');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/classes/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM classes WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'Class not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/classes', verifyToken, async (req, res) => {
    const { name } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO classes (name) VALUES (?)',
            [name]
        );
        connection.end();
        res.status(201).json({ message: 'Class created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/classes/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE classes SET name = ? WHERE id = ?',
            [name, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Class not found' });

        res.json({ message: 'Class updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/classes/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM classes WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Class not found' });

        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for teachersClasses
app.get('/teachersClasses', verifyToken, async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM teachersClasses');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/teachersClasses/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM teachersClasses WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'TeacherClass not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/teachersClasses', verifyToken, async (req, res) => {
    const { user_id, class_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO teachersClasses (user_id, class_id) VALUES (?, ?)',
            [user_id, class_id]
        );
        connection.end();
        res.status(201).json({ message: 'TeacherClass created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/teachersClasses/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { user_id, class_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE teachersClasses SET user_id = ?, class_id = ? WHERE id = ?',
            [user_id, class_id, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'TeacherClass not found' });

        res.json({ message: 'TeacherClass updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/teachersClasses/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM teachersClasses WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'TeacherClass not found' });

        res.json({ message: 'TeacherClass deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for reports comments
app.get('/reports/comments', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute(`SELECT 
            reportsComments.id, 
            reportsComments.comment_id, 
            reportsComments.user_id AS reporting_user_id, 
            reportsComments.report, 
            reportsComments.status, 
            reportsComments.created_at, 
            comments.comment, 
            comments.user_id AS comment_user_id,
            reporting_user.name AS reporting_user_name,
            comment_user.name AS comment_user_name,
            comment_user.email AS comment_user_email
            FROM reportsComments 
            JOIN comments ON reportsComments.comment_id = comments.id 
            JOIN users AS reporting_user ON reportsComments.user_id = reporting_user.id
            JOIN users AS comment_user ON comments.user_id = comment_user.id`);
        connection.end();

        res.status(200).send(results);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/reports/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('SELECT * FROM reportsComments WHERE id = ?', [id]);
        connection.end();

        if (result.length === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(200).send(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/reports/comments', async (req, res) => {
    const { comment_id, user_id, report } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('INSERT INTO reportsComments (comment_id, user_id, report) VALUES (?, ?, ?)', [comment_id, user_id, report]);
        connection.end();

        res.status(201).send({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/reports/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('UPDATE reportsComments SET status = ? WHERE id = ?', [status, id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(200).send({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/reports/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM reportsComments WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for reports users
app.get('/reports/users', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute(`
            SELECT 
                reportsUsers.id,
                reportsUsers.reported_user_id,
                reportsUsers.user_id,
                reportsUsers.report,
                reportsUsers.status,
                reportsUsers.created_at,
                reportedUser.name AS reported_user_name,
                reportedUser.email AS reported_user_email,
                reportingUser.name AS reporting_user_name,
                reportingUser.email AS reporting_user_email
            FROM reportsUsers
            JOIN users AS reportedUser ON reportsUsers.reported_user_id = reportedUser.id
            JOIN users AS reportingUser ON reportsUsers.user_id = reportingUser.id
        `);
        connection.end();

        res.status(200).send(results);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/reports/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('SELECT * FROM reportsUsers WHERE id = ?', [id]);
        connection.end();

        if (result.length === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(200).send(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/reports/users', async (req, res) => {
    const { reported_user_id, user_id, report } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('INSERT INTO reportsUsers (reported_user_id, user_id, report) VALUES (?, ?, ?)', [reported_user_id, user_id, report]);
        connection.end();

        res.status(201).send({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/reports/users/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('UPDATE reportsUsers SET status = ? WHERE id = ?', [status, id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(200).send({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/reports/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM reportsUsers WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for chats reports
app.get('/reports/chats', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute(`
            SELECT 
                reportsChats.id, 
                reportsChats.chat_id, 
                reportsChats.user_id AS reporting_user_id, 
                reportsChats.report, 
                reportsChats.status, 
                reportsChats.created_at, 
                chats.message, 
                chats.user_id AS chat_user_id,
                reporting_user.name AS reporting_user_name,
                chat_user.name AS chat_user_name,
                chat_user.email AS chat_user_email
            FROM reportsChats 
            JOIN chats ON reportsChats.chat_id = chats.id 
            JOIN users AS reporting_user ON reportsChats.user_id = reporting_user.id
            JOIN users AS chat_user ON chats.user_id = chat_user.id
        `);
        connection.end();

        res.status(200).send(results);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/reports/chats/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('SELECT * FROM reportsChats WHERE id = ?', [id]);
        connection.end();

        if (result.length === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(200).send(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/reports/chats', async (req, res) => {
    const { message_id, user_id, content, report } = req.body;
  
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [result] = await connection.execute(
        'INSERT INTO reportsChats (message_id, user_id, content, report) VALUES (?, ?, ?, ?)',
        [message_id, user_id, content, report]
      );
      connection.end();
  
      res.status(201).send({ id: result.insertId });
    } catch (error) {
      console.error('Error saving report:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

app.put('/reports/chats/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('UPDATE reportsChats SET status = ? WHERE id = ?', [status, id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(200).send({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/reports/chats/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM reportsChats WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Create users rewiews
app.post('/reviews', async (req, res) => {
    const { reviewed_user_id, reviewer_user_id, rating } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();
        const [result] = await connection.execute('INSERT INTO reviews (reviewed_user_id, reviewer_user_id, rating) VALUES (?, ?, ?)', [reviewed_user_id, reviewer_user_id, rating]);

        const [rows] = await connection.execute('SELECT AVG(rating) as rating FROM reviews WHERE reviewed_user_id = ?', [reviewed_user_id]);
        if (rows.length == 0) {
            throw new Error('No reviews found for the user');
        }
        const averageRating = parseFloat(rows[0].rating).toFixed(2);

        await connection.execute('UPDATE users SET review = ? WHERE id = ?', [averageRating, reviewed_user_id]);
        await connection.commit();
        connection.end();
        res.status(201).send({ id: result.insertId });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});


app.get('/pendingUsers', async (req, res) => {
    try {

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE verified = 0');
        connection.end();

        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error. Please try again later.' });
    }
});

app.delete('/verified/users/:id', async (req, res) => {
    const { id } = req.params;
    console.log("ID recibido en backend:", id); // Depuración
    if (!id) {
        return res.status(400).send({ error: "ID no proporcionado" });
    }
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Usuario no encontrado' });

        res.status(204).send();
    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({ error: "Error en la base de datos" });
    }
});


app.put('/verified/users/:id', async (req, res) => {

    const { id } = req.params;

    try {

        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('UPDATE users SET verified = 1 WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Usuario no encontrado' });

        res.status(200).send({ message: 'Usuario verificado exitosamente' });

    } catch (error) {
        console.error('Error en la base de datos:', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});


// Get type of users
app.get('/typesUsers', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM typesUsers');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/comments', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM comments');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/publications', async (req, res) => {
    console.log('Publications');
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM publications');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Route for refresh access token
app.post('/refresh', async (req, res) => {
    console.log('Refresh token 0:', req.body);
    const { refreshToken } = req.body;

    console.log('Refresh token 1:', refreshToken);

    if (!refreshToken) return res.status(401).send('Token is required');
    if (!refreshTokensDB.has(refreshToken)) return res.status(403).send('Invalid token');

    try {
        console.log('Refresh token 2:', refreshToken);
        const decoded = jwt.verify(refreshToken, refreshKey);
        console.log('Decoded:', decoded);
        const newAccessToken = jwt.sign({ id: decoded.id, email: decoded.email }, secretKey, { expiresIn: '1h' });
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.log('Error refresh:', err);
        refreshTokensDB.delete(refreshToken);
        res.status(403).json({ error: 'Invalid token or expired' });
    }
});

// Function to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Token es requerido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    console.log('Token:', token);

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log('Token verification error:', err);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expirado' });
            }
            return res.status(403).json({ error: 'Fallo al autenticar el token' });
        }
        console.log('Decoded:', decoded);
        req.user = decoded;
        next();
    });
}

// Function to hash password
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
}

// Function to compare password
async function comparePassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match
}

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//User follows or unfollows someone
app.post('/follow', verifyToken, async (req, res) => {
    const { user_id, followed_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('SELECT * FROM following WHERE user_id = ? AND following_user_id = ?', [user_id, followed_id]);
        if(result.length == 0){
            const [result] = await connection.execute('INSERT INTO following (user_id, following_user_id) VALUES (?, ?)', [user_id, followed_id]);
            connection.end();
            res.status(200).json({ following:true });
        }
        else{
            const connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute('DELETE FROM following WHERE user_id = ? AND following_user_id = ?', [user_id, followed_id]);
            connection.end();
            res.status(200).json({ following: false });
        }
    } catch (error) {
        res.status(500).json({ "error": 'Database error'+ error });
    }
});

app.get('/checkIfFollows/:user_id/:followed_id', verifyToken, async (req, res) => {
    const { user_id, followed_id } = req.params;

    try {
        let result;
        console.log("user_id",user_id);
        console.log("followed_id",followed_id);
        const connection = await mysql.createConnection(dbConfig);
         [result] = await connection.execute('SELECT * FROM following WHERE user_id = ? AND following_user_id = ?', [user_id, followed_id]);
        connection.end();
        console.log(result)
        if (result.length == 0) return res.status(200).json({ following: false });

        res.status(200).json({ following: true });
    } catch (error) {
        res.status(500).json({ "error": 'Database error'+ error });
    }
});

app.get('/recommendedUsers/:user_id', verifyToken, async (req, res) => {
    const { user_id } = req.params;

    try {
        let recommendedUsers = [];
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE id != ? AND id IN (SELECT user_id FROM following WHERE following_user_id = ? ORDER BY RAND())', [user_id, user_id]);
        console.log("Yo sigo a",rows);
        for (const row of rows) {
            let [auxRows] = await connection.execute('SELECT * FROM users WHERE id != ? AND id IN (SELECT user_id FROM following WHERE following_user_id = ? ORDER BY RAND())', [row.id, row.id]);
            console.log(row.id, "sigue a", auxRows);
            auxRows.forEach((auxRow) => {
            console.log("auxRow", auxRow);
            console.log(auxRow.id != user_id);
            console.log(!recommendedUsers.includes(auxRow));
            if (auxRow.id != user_id && !recommendedUsers.includes(auxRow)) {
                recommendedUsers.push(auxRow);
                console.log("recomendado", auxRow);
            }
            });
        }
        console.log("me han recomendado", recommendedUsers);
        console.log("hay", recommendedUsers.length, "usuarios recomendados");
        if(recommendedUsers.length < 16){
            let [auxRows]=await connection.execute('SELECT * FROM users WHERE id != ? AND id NOT IN (SELECT user_id FROM following WHERE following_user_id = ?) ORDER BY RAND()', [user_id, user_id]);
             auxRows.forEach((auxRow) => {
                if(auxRow.id != user_id && !recommendedUsers.includes(auxRow)){
                    recommendedUsers.push(auxRow);
                }
            });
        }
            if(recommendedUsers.length > 16){
                recommendedUsers = recommendedUsers.sort(() => Math.random() - 0.5);
                recommendedUsers = recommendedUsers.slice(0,16);
            }
        connection.end();

        console.log("Los usuarios que estan siendo recomendados són", recommendedUsers);
        res.status(200).json(recommendedUsers);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});