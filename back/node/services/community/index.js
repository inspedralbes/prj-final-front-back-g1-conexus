/* ----------------------------------------- IMPORTS ----------------------------------------- */
const fileUpload = require('express-fileupload');
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
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

const comEnd = loadEnv(path.resolve(__dirname, './.env'));
const app = express();
const port = comEnd.PORT;
const IA_TEXT_URL = comEnd.IA_TEXT_URL;
const IA_IMAGE_URL = comEnd.IA_IMAGE_URL;
const NOTIFICATION_URL = comEnd.NOTIFICATION_URL;

/* ----------------------------------------- SERVER APP ----------------------------------------- */
app.use(express.json());
app.use(cors({
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});
app.use(fileUpload());

/* ----------------------------------------- DATABASE ----------------------------------------- */
const dbConfig = {
    host: comEnd.MYSQL_HOST,
    user: comEnd.MYSQL_USER,
    password: comEnd.MYSQL_PASS,
    database: comEnd.MYSQL_DB
};

/* ----------------------------------------- ROUTES ----------------------------------------- */
// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World! XDDDDDDDDDDDDDDD I am a community service');
});

app.use('/upload', express.static(path.join(__dirname, 'upload')));

// CRUD operations for comments
app.get('/comments', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM comments WHERE text_ia = 1');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM comments WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'Comment not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/comments', async (req, res) => {
    const { publication_id, user_id, commentReply_id, comment } = req.body;
    var notificationIAnoResponse;
    var report;

    console.log("body", req.body);

    var running = await checkIA();
    console.log("running", running);
    let textIA = 0;
    if (running == true) {
        const analyzeContent = async (content) => {
            console.log("HOLA 1");
            const serverIA = IA_TEXT_URL + '/classifyTextCommunity';
            try {
                const response = await fetch(serverIA, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment: content }),
                });
                if (!response.ok) throw new Error(`Error IA: ${response.statusText}`);
                return await response.json();
            } catch (error) {
                console.error(`Error al analizar contenido: ${error.message}`);
                return null;
            }
        }
        let commentAnalysis = null;
        try {
            console.log("analisis comment");
            commentAnalysis = await analyzeContent(comment);
            textIA = 1;
        } catch (error) {
            console.error("Error al llamar a la ia", error);
            return res.status(500).json({ error: 'Error al analizar el comment', details: error.message });
        }

        const isReportableComent = (analysis_comment) => ['TOXICO', 'OFENSIVO', 'PROHIBIDO'].includes(analysis_comment.category);

        try {
            const connection = await mysql.createConnection(dbConfig);
            report = `Comment reason: ${commentAnalysis.reason}`;
            const category = commentAnalysis.category;
            console.log("category", category);

            const [result] = await connection.execute(
                'INSERT INTO comments (publication_id, user_id, commentReply_id, comment, category, text_ia) VALUES (?, ?, ?, ?, ?, ?)',
                [publication_id, user_id, commentReply_id, comment, category, 1]
            );
            const comment_id = result.insertId;
            let reasons = [];
            if (isReportableComent(commentAnalysis)) {
                reasons.push(`comentari: ${commentAnalysis.reason}`);
            }

            if (reasons.length > 0) {
                const notificationDescription = `S'ha generat un report del teu comentari en una publicació. Reason: ${commentAnalysis.reason}`;
                const [resultReport] = await connection.execute(
                    `INSERT INTO reportsComments (comment_id, user_id, report, status) VALUES (?, ?, ?, ?)`,
                    [comment_id, user_id, report, 'pending']
                );

                console.log("result report", resultReport);

                const notificationPayload = {
                    user_id: user_id,
                    description: notificationDescription,
                    comment_id: comment_id,
                    publication_id: publication_id,
                    report_id: resultReport.insertId,
                    revised: 0
                };

                await connection.execute(
                    `UPDATE comments SET reported = reported + 1 WHERE id = ?`,
                    [comment_id]
                );

                console.log("notification content", notificationPayload);

                try {
                    console.log("notification fetch");
                    const notificationResponse = await fetch(NOTIFICATION_URL + '/notifications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(notificationPayload),
                    });
                    console.log("response notification", notificationResponse);

                    if (!notificationResponse.ok)
                        console.error(`Error al enviar notificacion: ${notificationResponse.statusText}`);
                } catch (error) {
                    console.error("Error al realizar notificacion", error);
                }
            }

            res.status(201).json({
                message: 'comment creat correctament!',
                comment_id,
                publication_id,
                commentAnalysis,
                user_id,
                textIA: 1
            });
            connection.end();

        } catch (error) {
            console.error("Error al enviar notificacion", error);
            return res.status(500).json({ error: 'Error al enviar notificacion', details: error.message });
        }
    } else {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute(
                'INSERT INTO comments (publication_id, user_id, commentReply_id, comment, text_ia) VALUES (?, ?, ?, ?, ?)',
                [publication_id, user_id, commentReply_id, comment, 0]
            );
            const comment_id = result.insertId;
            res.status(201).json({
                message: 'comment creat, pendent de revisió!',
                comment_id,
                publication_id,
                user_id,
                textIA: 0
            });

            const notificacionReason = 'El teu comentari sera revisat més tard! Gràcies per la teva paciència';

            notificationIAnoResponse = {
                user_id: user_id,
                description: notificacionReason,
                comment_id: comment_id,
                publication_id: publication_id,
                revised: 0
            };

            console.log("notification if no response ia", notificationIAnoResponse);
            connection.end();
        } catch (error) {
            res.status(500).json({ error: 'Error al analizar contenido', details: error.message });
        }

        try {
            const notificationResponse = await fetch(NOTIFICATION_URL + '/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notificationIAnoResponse),
            });

            if (!notificationResponse.ok)
                console.error(`Error al enviar notificacion: ${notificationResponse.statusText}`);
        } catch (error) {
            res.status(500).json({ error: 'Error al enviar notificacion', details: error.message });
        }
    }
});

app.put('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { publication_id, user_id, commentReply_id, comment } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE comments SET publication_id = ?, user_id = ?, commentReply_id = ?, comment = ? WHERE id = ?',
            [publication_id, user_id, commentReply_id, comment, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Comment not found' });

        res.json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM comments WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Comment not found' });

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for publications
app.get('/publications', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM publications WHERE typesPublications_id = 1 AND text_ia = 1 AND image_ia = 1');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/publications', async (req, res) => {
    const { title, description, user_id, expired_at } = req.body;
    var notificationIAnoResponse;

    console.log("file", req.files);
    console.log("body", req.body);

    if (!title || !description || !req.files || !req.files.image) {
        return res.status(400).json({ error: 'Faltan datos obligatorios (título, descripción, imagen).' });
    }

    const imageFile = req.files.image;
    const imageName = `${Date.now()}-${imageFile.name}`;
    const imagePath = path.join(__dirname, 'upload', imageName);

    await imageFile.mv(imagePath);

    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    var running = await checkIA();
    console.log("running", running);
    let textIA = 0, imageIA = 0;
    if (running == true) {
        // Llamada a la IA para analizar título y descripción
        const analyzeContent = async (content) => {
            console.log("HOLA 1");
            const serverIA = IA_TEXT_URL + '/classifyTextCommunity';
            try {
                const response = await fetch(serverIA, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment: content }),
                });
                if (!response.ok) throw new Error(`Error IA: ${response.statusText}`);
                return await response.json();
            } catch (error) {
                console.error(`Error al analizar contenido: ${error.message}`);
                return null;
            }
        };

        let titleAnalysis = null, descriptionAnalysis = null;

        try {
            console.log("HOLA 2");
            titleAnalysis = await analyzeContent(title);
            descriptionAnalysis = await analyzeContent(description);
            textIA = 1;
        } catch (error) {
            console.error("Error al llamar a la IA", error);
            return res.status(500).json({ error: 'Error al analizar título o descripción.', details: error.message });
        }

        // Manejo de imagen
        // Llamada a la IA para analizar la imagen
        const serverMjsUrl = IA_IMAGE_URL + '/classify-imageCommunity';

        let imageAnalysis = null;
        try {
            const fetchPromise = await import('node-fetch');
            const fetch = fetchPromise.default;
            const response = await fetch(serverMjsUrl, {
                method: 'POST',
                body: formData,
                headers: formData.getHeaders(),
            });

            if (!response.ok)
                throw new Error(`Error IA imagen: ${response.statusText}`);

            imageAnalysis = await response.json();
            imageIA = 1;
        } catch (fetchError) {
            console.error("Error al llamar a la IA:", fetchError);

            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error al eliminar la imagen temporal:", err);
            });
            return res.status(500).json({ error: 'Error al analizar la imagen con la IA.' });
        }

        const isReportableComment = (analysis_comment) => ['TOXICO', 'OFENSIVO', 'PROHIBIDO'].includes(analysis_comment.category);

        // Guardar en base de datos
        try {
            const connection = await mysql.createConnection(dbConfig);
            const report = `Análisis: título (${titleAnalysis.category} | ${titleAnalysis.reason}), Descripció (${descriptionAnalysis.category} | ${descriptionAnalysis.reason}), imagen (${imageAnalysis.category} | ${imageAnalysis.reason})`;

            const [result] = await connection.execute(
                `INSERT INTO publications (typesPublications_id, title, description, user_id, image, text_ia, image_ia, expired_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [1, title, description, user_id, `/upload/${imageName}`, 1, 1, expired_at || null]
            );
            const publication_id = result.insertId;

            let reasons = [];
            if (isReportableComment(titleAnalysis)) {
                reasons.push(`títol: ${titleAnalysis.reason}`);
            }
            if (isReportableComment(descriptionAnalysis)) {
                reasons.push(`descripción: ${descriptionAnalysis.reason}`);
            }
            if (imageAnalysis.category === 'OFENSIVA' || (imageAnalysis.category === 'POTENCIALMENTE_SUGERENTE' && imageAnalysis.subcategory === 'OFENSIVO')) {
                reasons.push(`imagen: ${imageAnalysis.reason}`);
            }

            console.log("Hola 3");

            if (reasons.length > 0) {
                const notificationDescription = `S'ha generat un report al postejar una publicació. Reasons: ${reasons.join(', ')}.`;

                const [resultReport] = await connection.execute(
                    `INSERT INTO reportsPublications (publication_id, user_id, report, status) VALUES (?, ?, ?, ?)`,
                    [publication_id, user_id, report, 'pending']
                );

                console.log("Hola 4");

                console.log("resultReport ID:", resultReport.insertId);

                // Hacer fetch a las notificaciones
                const notificationPayload = {
                    user_id,
                    description: notificationDescription,
                    publication_id: publication_id,
                    report_id: resultReport.insertId,
                    revised: 0
                };

                await connection.execute(
                    `UPDATE publications SET reports = reports + 1 WHERE id = ?`,
                    [publication_id]
                );

                console.log("notification content", notificationPayload);

                try {
                    console.log("Hola 5");
                    const notificationResponse = await fetch(NOTIFICATION_URL + '/notifications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(notificationPayload),
                    });

                    console.log("response notification", notificationResponse);

                    if (!notificationResponse.ok) {
                        console.error("Error al enviar la notificación:", await notificationResponse.text());
                    }
                } catch (notificationError) {
                    console.error("Error al realizar el fetch de la notificación:", notificationError);
                }
            }

            res.status(201).json({
                message: 'publicació creada correctament!',
                publication_id: publication_id,
                titleAnalysis,
                descriptionAnalysis,
                imageAnalysis,
                textIA,
                imageIA,
            });
            connection.end();
        } catch (error) {
            fs.unlink(imagePath, () => { }); // Limpieza
            res.status(500).json({ error: 'Error al guardar la publicación en la base de datos.', details: error.message });
        }
    } else {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute(
                `INSERT INTO publications (typesPublications_id, title, description, user_id, image, text_ia, image_ia, expired_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [1, title, description, user_id, `/upload/${imageName}`, textIA, imageIA, expired_at || null]
            );
            const publication_id = result.insertId;
            res.status(201).json({
                message: 'publicació creada, pendent de revisar!',
                publication_id: publication_id,
                text_ia: 0,
                image_ia: 0,
            });

            const notificationReason = 'Tu publicació sera revisada més tard! Gràcies per la teva paciència.';

            notificationIAnoResponse = {
                user_id,
                description: notificationReason,
                publication_id: publication_id,
                revised: 0
            };

            console.log("notification if no response ia", notificationIAnoResponse);
            connection.end();

        } catch (error) {
            res.status(500).json({ error: 'Error al analizar contenido', details: error.message });
        }

        try {
            const notificationResponse = await fetch(NOTIFICATION_URL + '/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notificationIAnoResponse),
            });

            if (!notificationResponse.ok) {
                console.error("Error al enviar la notificación:", await notificationResponse.text());
            }
        } catch (notificationError) {
            console.error("Error al realizar el fetch de la notificación:", notificationError);
        }

    }
});


app.get('/publications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM publications WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'Publication not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/getMyPublications', async (req, res) => {
    console.log("user_id recibido:", req.query.user_id); // Confirma el valor
    const { user_id } = req.query;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM publications WHERE user_id = ? AND typesPublications_id = 1', [user_id]);
        console.log("Datos obtenidos:", rows); // Muestra los datos obtenidos
        connection.end();

        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/publications', async (req, res) => {
    const { title, description, user_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO publications (typesPublications_id, title, description, user_id) VALUES (?, ?, ?, ?)',
            [1, title, description, user_id]
        );
        connection.end();
        res.status(201).json({ message: 'Publication created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/publications/:id', async (req, res) => {
    const { id } = req.params;
    const { typesPublications_id, title, description, user_id, reports } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE publications SET typesPublications_id = ?, title = ?, description = ?, user_id = ?, reports = ? WHERE id = ?',
            [typesPublications_id, title, description, user_id, reports, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Publication not found' });

        res.json({ message: 'Publication updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/publications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM publications WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Publication not found' });

        res.json({ message: 'Publication deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for reportsPublications
app.get('/reports/publications', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT 
                rp.id,
                rp.user_id AS reporting_user_id,
                rp.report,
                rp.status,
                rp.created_at,
                u1.name AS reporting_user_name,
                u1.email AS reporting_user_email,
                p.title,
                p.description,
                p.image,
                p.user_id AS publication_user_id,
                u2.name AS publication_user_name,
                u2.email AS publication_user_email
            FROM reportsPublications rp
            JOIN users u1 ON rp.user_id = u1.id
            JOIN publications p ON rp.publication_id = p.id
            JOIN users u2 ON p.user_id = u2.id
        `);
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/reports/publications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM reportsPublications WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'ReportPublication not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/reports/publications', async (req, res) => {
    const { publication_id, user_id, report, status } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO reportsPublications (publication_id, user_id, report, status) VALUES (?, ?, ?, ?)',
            [publication_id, user_id, report, status]
        );
        connection.end();
        res.status(201).json({ message: 'ReportPublication created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/reports/publications/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE reportsPublications SET status = ? WHERE id = ?',
            [ status, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'ReportPublication not found' });

        res.json({ message: 'ReportPublication updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/reports/publications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM reportsPublications WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'ReportPublication not found' });

        res.json({ message: 'ReportPublication deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

async function checkIA() {

    var running = true;
    const serverIAtext = IA_TEXT_URL + '/';
    const serverIAimage = IA_IMAGE_URL + '/';

    try {
        const responseText = await fetch(serverIAtext);
        if (!responseText.ok) throw new Error(`Error IA: ${responseText.statusText}`);

        const responseImage = await fetch(serverIAimage);
        if (!responseImage.ok) throw new Error(`Error IA: ${responseImage.statusText}`);

    } catch (error) {
        running = false;
        console.error(`Error al analizar contenido: ${error.message}`);
    }
    return running;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});