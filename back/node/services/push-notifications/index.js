const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { createServer } = require('http');
const morgan = require('morgan');
const webpush = require('web-push');

function loadEnv(envPath) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        throw result.error;
    }
    return result.parsed;
}

const pushNotificationsEnv = loadEnv(path.resolve(__dirname, './.env'));
const PORT = pushNotificationsEnv.PORT;
const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type"],
}));

webpush.setVapidDetails('mailto:test@conexushub.com', pushNotificationsEnv.PUBLIC_VAPID_KEY, pushNotificationsEnv.PRIVATE_VAPID_KEY);
app.get('/', (req, res) => {
    res.send('Hello World! I am a push notifications service');
});

// app.use(require('./routes/index'));


const subscriptions = {};

app.post('/subscribe', (req, res) => {
    const { user_id, subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'invalid Subscription endpoint' });
    }

    subscriptions[user_id] = subscription;
    console.log("subscription saved", subscriptions);
    res.status(201).json({ message: 'Subscription saved' });
});

app.post('/sendNotification', (req, res) => {
    const { user_id, title, message } = req.body;

    console.log("aaaaaa body", req.body);

    // Obtener la suscripción del usuario desde la base de datos
    const subscription = subscriptions[user_id];
    console.log("subscription", subscription);

    if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
    }

    // Payload de la notificación
    const payload = JSON.stringify({ title, message });

    // Enviar notificación
    webpush.sendNotification(subscription, payload)
        .then(() => {
            console.log('Notificación enviada con éxito');
            res.status(200).json({ message: 'Notification sent' });
        })
        .catch(err => {
            console.error('Error al enviar la notificación:', err);

            // Verificar si la suscripción ha caducado (código 410)
            if (err.statusCode === 410) {
                // Eliminar la suscripción caducada de la base de datos
                delete subscriptions[user_id];  // Asegúrate de eliminar la suscripción en tu base de datos
                console.log('Suscripción caducada eliminada');
                return res.status(410).json({ error: 'Subscription expired and removed' });
            }

            // Manejo de otros errores
            res.status(500).json({ error: 'Error sending notification' });
        });
});


console.log(pushNotificationsEnv.PUBLIC_VAPID_KEY, pushNotificationsEnv.PRIVATE_VAPID_KEY);

server.listen(PORT, () => {
    console.log(`Push notifications service listening on port ${PORT}`);
});
