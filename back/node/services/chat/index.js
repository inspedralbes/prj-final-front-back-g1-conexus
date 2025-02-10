const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

function loadEnv(envPath) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    throw result.error;
  }
  return result.parsed;
}

const chatEnv = loadEnv(path.resolve(__dirname, "./.env"));

const PORT = chatEnv.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type"],
  },
});

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type"],
  })
);

mongoose
  .connect(chatEnv.MONGO_URI, { dbName: "Chat" })
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

const messageSchema = new mongoose.Schema({
  users: [Number],
  reports: { type: Number, default: 0 },
  interactions: [
    {
      userId: String,
      message: String,
      timestamp: Date,
    },
  ],
});

const Message = mongoose.model("Message", messageSchema);

app.get("/", (req, res) => {
  res.send("Hello World! I am a chat service");
});

app.get("/chatTest", (req, res) => {
  res.send(JSON.stringify(chatEnv));
});

app.get("/getChats", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/getChats/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const messages = await Message.find();
    const filteredMessages = messages.filter((message) =>
      message.users.includes(Number(id))
    );
    console.log("Messages:", filteredMessages);
    res.json(filteredMessages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/getChat/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const messages = await Message.find({ _id: id });
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/addChat", async (req, res) => {
  console.log("addChat");
  const { _id, users, reports, interactions } = req.body;
  console.log("req.body:", req.body);
  try {
    let message;
    if (_id) {
      message = await Message.findByIdAndUpdate(
        _id,
        { users, reports, interactions },
        { new: true, upsert: true }
      );
    } else {
      message = new Message({ users, reports, interactions });
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
    res.status(200).json(message);
  } catch (err) {
    console.error("Error adding chat:", err);
    res.status(500).send(err);
  }
});

app.post("/newChat", async (req, res) => {
  console.log("newChat");
  const { users, interactions } = req.body;

  const existingChat = await Message.findOne({
    users: { $all: users },
  });

  if (existingChat) {
    return res.status(400).send("A chat between these users already exists");
  }
  try {
    const message = new Message({
      users,
      reports: 0,
      interactions,
    });
    console.log("message:", message);
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/reportMessage", async (req, res) => {
  const { chatId, messageId } = req.body;

  try {
    const chat = await Message.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    chat.reports = 1;
    await chat.save();

    res.status(200).json({ message: "Message reported successfully", reports: chat.reports });
  } catch (err) {
    console.error("Error reporting message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

setInterval(async () => {
  try {
    const chats = await Message.find();
    const now = new Date();

    for (const chat of chats) {
      const createdAt = chat._id.getTimestamp();

      if (
        chat.interactions.length === 0 &&
        now - createdAt > TWENTY_FOUR_HOURS_IN_MS
      ) {
        await Message.findByIdAndDelete(chat._id);
        console.log(`Deleted chat with id: ${chat._id}`);
      }
    }
  } catch (err) {
    console.error("Error checking chats:", err);
  }
}, 10000);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("sendMessage", async (data) => {
    console.log("sendMessage:", data);
    const { chatId, userId, message } = data;
    const newMessage = {
      userId,
      message,
      timestamp: new Date(),
    };

    try {
      const chat = await Message.findById(chatId);
      if (chat) {
        const isFirstInteraction = chat.interactions.length === 0;
        chat.interactions.push(newMessage);
        await chat.save();
        io.emit("receiveMessage", newMessage);
        console.log("Message saved:", newMessage);

        if (isFirstInteraction) {
          const notificationPayload = {
            user_id: userId === chat.users[0] ? chat.users[1] : chat.users[0],
            title: "Nou chat obert",
            message: `Tens un nou missatge de ${userId}!`,
          };

          const response = await fetch(chatEnv.ENDPOINT_URL_PUSH_NOTIFICATIONS + "/sendNotification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificationPayload),
          });

          console.log("response", await response.json());
        }
      }
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("listening on *:" + PORT);
});
