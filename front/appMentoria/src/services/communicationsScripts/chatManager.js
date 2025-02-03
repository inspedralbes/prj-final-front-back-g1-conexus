import { ref } from "vue";
import socketChat from "@/socketsScripts/socketChat";
import { useAppStore } from "@/stores/appStore";

const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;

// Get all messages
export const fetchMessages = async (chatId) => {
    try {
        const response = await fetch(`${CHAT_URL}/getChat/${chatId}`);
        const data = await response.json();
        const chatData = ref({});
        chatData.value = data[0];
        chatData.value.userName = chatData.value.user_one_name;
        chatData.value.interactions = chatData.value.interactions.map(
            (interaction) => ({
                message: interaction.message,
                userId: interaction.userId,
                timestamp: interaction.timestamp,
            })
        );
        return chatData;
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};

// Send message
export const sendMessageInMongo = async (chatData, currentUser, messageInput) => {
    const newMessage = {
        message: messageInput,
        userId: currentUser,
        timestamp: new Date().toISOString(),
    };

    try {
        await fetch(`${CHAT_URL}/addChat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chatData._rawValue),
        });
        if (typeof messageInput === "object" && messageInput !== null) {
            messageInput.value = "";
        }
        socketChat.emit("sendMessage", {
            chatId: chatData._rawValue._id,
            userId: currentUser,
            message: newMessage.message,
        });
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

// Get all chats
export const fetchChats = async (userId) => {
    const chats = ref([]);
    const chatsInfo = ref(false);

    try {
        const response = await fetch(`${CHAT_URL}/getChats/${userId}`);
        const data = await response.json();
        chats.value = data;
        chatsInfo.value = true;
    } catch (err) {
        console.error("Error al obtener los chats", err);
        chatsInfo.value = false;
    }
    return { chats: chats.value, chatsInfo: chatsInfo.value };
};

// Create a new chat
export const chatButton = async (userid2, router) => {
    const appStore = useAppStore();
    const userid1 = appStore.getUser().id;
    const newMessage = {
        user_one_id: userid1,
        user_two_id: userid2,
        interactions: [],
        __v: 0,
    };
    try {
        const response = await fetch(`${CHAT_URL}/newChat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newMessage),
        });
        if (!response.ok) {
            throw new Error("Failed to send message");
        }
        router.push("/chatList");
    } catch (error) {
        console.error("Error sending message:", error);
        router.push("/chatList");
    }
};