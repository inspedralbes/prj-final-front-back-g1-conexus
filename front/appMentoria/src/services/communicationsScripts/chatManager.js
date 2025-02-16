import { ref } from "vue";
import socketChat from "@/services/socketsScripts/socketChat";
import { useAppStore } from "@/stores/index";
import { refreshToken } from "@/services/communicationsScripts/mainManager";

const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;

// Get all messages
export const fetchMessages = async (chatId) => {
    try {
        const response = await fetch(`${CHAT_URL}/getChat/${chatId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.'};
            }
            return fetchMessages(chatId);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        const chatData = ref({});
        chatData.value = data[0];
        chatData.value.userName = chatData.value.user_one_name;
        chatData.value.reported = data[0].reports;
        chatData.value.interactions = chatData.value.interactions.map(
            (interaction) => ({
                _id: interaction._id,
                message: interaction.message,
                userId: interaction.userId,
                timestamp: interaction.timestamp,
                reports: interaction.reports,
            })
        );

        return chatData;
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};

// Send message
export const sendMessageInMongo = async (chatData, currentUser, messageInput, users) => {
    const newMessage = {
        message: messageInput,
        userId: currentUser.value, // Asegúrate de que userId sea una cadena
        timestamp: new Date().toISOString(),
    };

    try {
        const response = await fetch(`${CHAT_URL}/addChat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ ...chatData._rawValue, interactions: [...chatData._rawValue.interactions, newMessage] }),
        });

        if (response.status === 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.'};
            }
            return sendMessageInMongo(chatData, currentUser, messageInput);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        if (typeof messageInput === "object" && messageInput !== null) {
            messageInput.value = "";
        }
        socketChat.emit("sendMessage", {
            chatData: chatData.value,
            message: newMessage,
            userId: currentUser.value,
            users: users.value
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
        const response = await fetch(`${CHAT_URL}/getChats/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status === 401) {
            console.log("fetchChats 401, refreshToken");
            const refreshResult = await refreshToken();

            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.'};
            }

            return fetchChats(userId);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

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
export const chatButton = async (name, users, router) => {
    const appStore = useAppStore();
    if(users.length === 1) {
        users = [appStore.user.id, users[0]];
    }
    const newMessage = {
        name: name,
        users: users,
        interactions: [],
        reports: 0,
    };
    try {
        const response = await fetch(`${CHAT_URL}/newChat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(newMessage),
        });
        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.'};
            }
            return chatButton(name, users, router);
        }
        if (!response.ok) {
            throw new Error("Failed to send message");
        }
        router.push("/chatList");
    } catch (error) {
        console.error("Error sending message:", error);
        router.push("/chatList");
    }
};

// Report chat in mongo
export const reportChatMongo = async (chatId, messageId) => {
    try {
        const response = await fetch(`${CHAT_URL}/reportMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ chatId, messageId }),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.'};
            }
            return reportChatMongo(chatId, messageId);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Error reporting chat:', error);
        return { error: 'Network error. Please try again later.' };
    }
};