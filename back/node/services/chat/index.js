const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function loadEnv(envPath) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    throw result.error;
  }
  return result.parsed;
}

const chatEnv = loadEnv(path.resolve(__dirname, './.env'));

const PORT = chatEnv.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type"],
  }
});

app.use(express.json());

app.use(cors({
  origin: '*',
  credentials: true,
  allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type"],
}));

mongoose.connect(chatEnv.MONGO_URI, { dbName: 'Chat' })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

const messageSchema = new mongoose.Schema({
  user_one_id: Number,
  user_two_id: Number,
  interactions: [
    {
      userId: String,
      message: String,
      timestamp: Date
    }
  ]
});

const Message = mongoose.model('Message', messageSchema);

app.get('/', (req, res) => {
  res.send('Hello World! I am a chat service');
});

app.get('/chatTest', (req, res) => {
  res.send(JSON.stringify(chatEnv));
});

app.get('/getChats', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/getChats/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const messages = await Message.find();
    const filteredMessages = messages.filter(message => message.user_one_id == id || message.user_two_id == id);
    ('ID:', id);
    console.log('Messages:', filteredMessages);
    res.json(filteredMessages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/getChat/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const messages = await Message.find({ _id: id });
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/addChat', async (req, res) => {
  console.log('addChat');
  const { _id, user_one_id, user_two_id, interactions } = req.body;
  console.log('req.body:', req.body);
  try {
    let message;
    let isFirstInteraction = false;
    if (_id) {
      message = await Message.findById(_id);
      if (message && message.interactions.length === 0 && interactions.length > 0) {
        isFirstInteraction = true;
      }
      message = await Message.findByIdAndUpdate(_id, { user_one_id, user_two_id, interactions }, { new: true, upsert: true });
    } else {
      message = new Message({ user_one_id, user_two_id, interactions });
      if (interactions.length > 0) {
        isFirstInteraction = true;
      }
      await message.save();
    }

    // if (isFirstInteraction) {
    //   console.log("eyyyyyyyyyyy estoy dentro");
    //   const notificationPayload = {
    //     user_id: user_two_id,
    //     title: 'Nou missatge',
    //     message: `Tens un nou missatge de ${user_one_id}!`
    //   };

    //   await fetch(chatEnv.ENDPOINT_URL_PUSH_NOTIFICATIONS + '/sendNotification', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(notificationPayload)
    //   });
    // }

    res.json(message);
  } catch (err) {
    console.error('Error en /addChat:', err);
    res.status(500).send(err);
  }
});

app.post('/newChat', async (req, res) => {
  console.log('newChat')
  const { _id, user_one_id, user_two_id, interactions } = req.body;
  const existingChat = await Message.findOne({
    $or: [
      { user_one_id: user_one_id, user_two_id: user_two_id },
      { user_one_id: user_two_id, user_two_id: user_one_id }
    ]
  });

  if (existingChat) {
    return res.status(400).send('A chat between these users already exists');
  }
  try {
    const message = new Message({ user_one_id, user_two_id, interactions });
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).send(err);
  }
});

const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

setInterval(async () => {
  try {
    const chats = await Message.find();
    const now = new Date();

    for (const chat of chats) {
      const createdAt = chat._id.getTimestamp();

      if (chat.interactions.length === 0 && now - createdAt > TWENTY_FOUR_HOURS_IN_MS) {
        await Message.findByIdAndDelete(chat._id);
        console.log(`Deleted chat with id: ${chat._id}`);
      }
    }
  } catch (err) {
    console.error('Error checking chats:', err);
  }
}, 10000);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('sendMessage', async (data) => {
    console.log('sendMessage:', data);
    const { chatId, userId, message } = data;
    const newMessage = {
      userId,
      message,
      timestamp: new Date()
    };

    try {
      const chat = await Message.findById(chatId);
      if (chat) {
        const isFirstInteraction = chat.interactions.length === 0;
        chat.interactions.push(newMessage);
        await chat.save();
        io.emit('receiveMessage', newMessage);
        console.log('Message saved:', newMessage);

        if (isFirstInteraction) {
          const notificationPayload = {
            user_id: userId === chat.user_one_id ? chat.user_two_id : chat.user_one_id,
            title: 'Nou chat obert',
            message: `Tens un nou missatge de ${userId}!`
          };

          console.log("toy dentro perras");

          const response = await fetch(chatEnv.ENDPOINT_URL_PUSH_NOTIFICATIONS + '/sendNotification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(notificationPayload)
          });

          console.log("response", response.json());
        }
      }
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});
