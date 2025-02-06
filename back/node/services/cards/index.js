const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

function loadEnv(envPath) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        throw result.error;
    }
    return result.parsed;
}

const cardEnd = loadEnv(path.resolve(__dirname, './.env'));

const app = express();
const port = cardEnd.PORT;

/* ----------------------------------------- SERVER APP ----------------------------------------- */

app.use(express.json());
app.use(fileUpload());
app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ----------------------------------------- DATABASE ----------------------------------------- */

const dbConfig = {
    host: cardEnd.MYSQL_HOST,
    user: cardEnd.MYSQL_USER,
    password: cardEnd.MYSQL_PASS,
    database: cardEnd.MYSQL_DB
};

/* ----------------------------------------- ROUTES ----------------------------------------- */

app.get('/getCardsFromUser', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/cards', async (req, res) => {
    const { user_id, cardFront, cardBack } = req.body;

    if (!user_id || !cardFront || !cardBack) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        // Definir el directorio del usuario
        const userDir = path.join(__dirname, 'uploads', `user_${user_id}`);

        // Si no existe la carpeta del usuario, la creamos
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        // Generar nombres únicos para las imágenes
        const timestamp = Date.now();
        const frontName = `${timestamp}_cardfrontal.svg`;
        const backName = `${timestamp}_cardback.svg`;

        // Definir rutas de guardado
        const base64Front = cardFront.split(';base64,').pop();
        const base64Back = cardBack.split(';base64,').pop();

        fs.writeFileSync(path.join(userDir, frontName), Buffer.from(base64Front, 'base64'));
        fs.writeFileSync(path.join(userDir, backName), Buffer.from(base64Back, 'base64'));

        // Rutas de las imágenes
        const frontPath = `/uploads/user_${user_id}/${frontName}`;
        const backPath = `/uploads/user_${user_id}/${backName}`;

        const connection = await mysql.createConnection(dbConfig);

        // Obtener las tarjetas actuales del usuario
        const [rows] = await connection.execute('SELECT cards FROM users WHERE id = ?', [user_id]);

        let currentCards = rows.length > 0 ? rows[0].cards : null;

        // Si currentCards es un objeto, lo convertimos en un array
        if (currentCards && typeof currentCards === 'object') {
            currentCards = [currentCards];
        } else if (!currentCards) {
            currentCards = []; // Si no existen tarjetas, inicializamos como un array vacío
        }

        // Verificamos si ya hay 3 tarjetas
        if (currentCards.length >= 3) {
            return res.status(400).json({ error: 'No se pueden agregar más de 3 tarjetas' });
        }

        // Crear un nuevo objeto de tarjeta con las rutas de las imágenes
        const newCard = { front: frontPath, back: backPath };

        // Agregar la nueva tarjeta al array de tarjetas existentes
        currentCards.push(newCard);

        // Realizar el UPDATE para agregar el nuevo objeto de tarjeta
        await connection.execute(
            'UPDATE users SET cards = ? WHERE id = ?',
            [JSON.stringify(currentCards), user_id]
        );

        connection.end();

        res.json({ message: 'Tarjetas actualizadas correctamente' });

    } catch (error) {
        console.error("Error en el servidor:", error); // Para ver detalles del error
        res.status(500).json({ error: 'Database error ' + error.message });
    }
});

app.delete('/cards', async (req, res) => {

});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
