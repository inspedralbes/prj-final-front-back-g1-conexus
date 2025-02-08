/* ----------------------------------------- IMPORTS ----------------------------------------- */
const fileUpload = require('express-fileupload');
const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const { createTokens, verifyToken, refreshToken, deleteToken } = require('/usr/src/app/middleware/auth.js');

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
                } else {
                    userLogin = users[0];
                }
            }
        }

        const tokens = createTokens(userLogin);

        res.status(200).json({ message: 'Login successful', accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, userLogin });
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

        const tokens = createTokens(userLogin);

        res.status(200).json({ message: 'Login successful', accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, userLogin });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    } finally {
        connection.end();
        console.log('Connection closed');
    }
});

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

    deleteToken(refreshToken);    
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
                users.discord_link,
                users.github_link
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
        res.status(500).json({ error: 'Database error' });
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

// This Routes its for statistics
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

app.post('/refresh', refreshToken);

// Function to hash password
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
};

// Function to compare password
async function comparePassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match
};

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});