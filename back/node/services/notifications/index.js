/* ----------------------------------------- IMPORTS ----------------------------------------- */
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const FormData = require('form-data');

const path = require('path');
const dotenv = require('dotenv');

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

app.get('/getNotifications', async (req, res) => {
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

app.get('/notifications/:id', async (req, res) => {
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

app.put('/notifications/:id', async (req, res) => {
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

app.post('/notifications', async (req, res) => {

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