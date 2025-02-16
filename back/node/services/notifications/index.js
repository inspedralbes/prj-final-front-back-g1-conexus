/* ----------------------------------------- IMPORTS ----------------------------------------- */
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
// const { verifyToken } = require('../../middleware/auth.js');
const { verifyToken } = require('/usr/src/node/middleware/auth.js');

function loadEnv(envPath) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        throw result.error;
    }
    return result.parsed;
}

const notiEnd = loadEnv(path.resolve(__dirname, './.env'));

const app = express();
const port = notiEnd.PORT;

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

// app.use(fileUpload());

/* ----------------------------------------- DATABASE ----------------------------------------- */
const dbConfig = {
    host: notiEnd.MYSQL_HOST,
    user: notiEnd.MYSQL_USER,
    password: notiEnd.MYSQL_PASS,
    database: notiEnd.MYSQL_DB
};

/* ----------------------------------------- ROUTES ----------------------------------------- */
// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World! XDDDDDDDDDDDDDDD I am a notifications service');
});

app.get('/getNotifications', verifyToken, async (req, res) => {
    console.log("user_id", req.query.user_id);
    const { user_id } = req.query;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM notifications WHERE user_id = ? AND revised = 0', [user_id]);
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/notifications/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM notifications WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'Notification not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/notifications/:id', verifyToken, async (req, res) => {
    console.log("req.params", req.params);
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Actualizar el campo `revised` de la notificación a 1 (marcada como leída)
        const [result] = await connection.execute(
            'UPDATE notifications SET revised = 1 WHERE id = ?',
            [id]
        );

        connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/notificationCheckedIA/:id', async (req, res) => {
    const { description, request_id, publication_id } = req.body;

    try {
        // Validar que uno de los dos valores (request_id o publication_id) sea válido
        if (request_id == null && publication_id == null) {
            return res.status(400).json({ error: 'Either request_id or publication_id must be provided' });
        }

        const connection = await mysql.createConnection(dbConfig);

        let query, queryParams;

        if (request_id != null) {
            // Si request_id es válido, actualiza usando request_id
            query = 'UPDATE notifications SET description = ? WHERE request_id = ?';
            queryParams = [description, request_id];
        } else if (publication_id != null) {
            // Si publication_id es válido, actualiza usando publication_id
            query = 'UPDATE notifications SET description = ? WHERE publication_id = ?';
            queryParams = [description, publication_id];
        }

        // Ejecutar la consulta SQL
        const [result] = await connection.execute(query, queryParams);
        connection.end();

        // Comprobar si se actualizó alguna fila
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error); // Registro del error para depuración
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/notifications', verifyToken, async (req, res) => {
    const { user_id, description, chat_id, report_id, publication_id, request_id, comment_id, revised } = req.body;
    console.log("user_id notification", user_id);
    console.log("desciption", description);
    console.log("request_id", request_id);
    if (!user_id) {
        return res.status(400).json({ error: 'User id is required.' });
    }

    console.log("body", req.body);

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO notifications (user_id, description, chat_id, report_id, publication_id, request_id, comment_id, revised) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, description || null, chat_id || null, report_id || null, publication_id || null, request_id || null, comment_id || null, 0]
        );

        console.log("result", result);

        res.status(201).json({
            notificationId: result.insertId,
            user_id,
            description,
            chat_id,
            report_id,
            publication_id,
            request_id,
            comment_id,
            revised: 0
        });

        connection.end();
        console.log('Notification created:', result);

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: 'Database error' });
    }

});

app.post('/notifications/IA', async (req, res) => {
    const { user_id, description, chat_id, report_id, publication_id, request_id, comment_id, revised } = req.body;
    console.log("user_id notification", user_id);
    console.log("desciption", description);
    console.log("request_id", request_id);
    if (!user_id) {
        return res.status(400).json({ error: 'User id is required.' });
    }

    console.log("body", req.body);

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO notifications (user_id, description, chat_id, report_id, publication_id, request_id, comment_id, revised) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, description || null, chat_id || null, report_id || null, publication_id || null, request_id || null, comment_id || null, 0]
        );

        console.log("result", result);

        res.status(201).json({
            notificationId: result.insertId,
            user_id,
            description,
            chat_id,
            report_id,
            publication_id,
            request_id,
            comment_id,
            revised: 0
        });

        connection.end();
        console.log('Notification created:', result);

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: 'Database error' });
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 