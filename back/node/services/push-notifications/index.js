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

app.get('/', (req, res) => {
    res.send('Hello World! I am a push notifications service');
});

webpush.setVapidDetails('mailto:test@conexushub.com', pushNotificationsEnv.PUBLIC_VAPID_KEY, pushNotificationsEnv.PRIVATE_VAPID_KEY);

const subscriptions = [];

app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    if (!subscriptions.endpoint) {
        return res.status(400).json({ error: 'invalid Subscription endpoint' });
    }

    subscriptions.push(subscription);
    console.log("subscription saved", subscription);
    res.status(201).json({ message: 'Subscription saved' });
});

app.post('/sendNotification-addChat', (req, res) => {
    const { title, message } = req.body;

    const notificationPayload = {
        notification: {
            title: title,
            body: message,
            icon: 'assets/icons/icon-512x512.png',
        }
    };

    Promise.all(subscriptions.map(subscription => webpush.sendNotification(subscription, JSON.stringify(notificationPayload))))
        .then(() => res.status(200).json({ message: 'Notification sent' }))
        .catch(err => {
            console.error('Error sending notification', err);
            res.sendStatus(500);
        });
});
console.log(pushNotificationsEnv.PUBLIC_VAPID_KEY, pushNotificationsEnv.PRIVATE_VAPID_KEY);

server.listen(PORT, () => {
    console.log(`Push notifications service listening on port ${PORT}`);
});
