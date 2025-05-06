import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.NODE_CHAT_PORT || 3007;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.NODE_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    dbName: "chat"
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

const messageSchema = new mongoose.Schema({
    name: String,
    teachers: [Number],
    interaction: [
        {
            teacherId: String,
            message: String,
            date: Date
        }
    ]
});

mongoose.model("Message", messageSchema);

app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
