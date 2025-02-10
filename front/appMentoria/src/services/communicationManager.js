import { ref } from "vue";
import socketChat from "./socketChat";
import { useRouter } from "vue-router";
import { useAppStore } from '@/stores/index';

const BACK_URL = import.meta.env.VITE_URL_BACK;
const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;
const COMMUNITY_URL = import.meta.env.VITE_URL_BACK_COMMUNITY;
const EMPLOYMENTEXCHANGE_URL = import.meta.env.VITE_URL_BACK_EMPLOYMENT_EXCHANGE;
const STADISTICS_URL = import.meta.env.VITE_URL_BACK_STADISTICS;
const MICROOSERVICES_URL = import.meta.env.VITE_URL_BACK_MICROSERVICES;
const NOTIFICATIONS_URL = import.meta.env.VITE_URL_BACK_NOTIFICATIONS;
const VITE_URL_BACK_CHAT = import.meta.env.VITE_CHATS_URL;
// Refresh acces token
export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        const response = await fetch(`${BACK_URL}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();


        // Guardar el nuevo token
        useAppStore().setAccessToken(data.accessToken);
        localStorage.setItem('accessToken', data.accessToken);

        return data;
    } catch (error) {
        console.error('Error al renovar el Access Token:', error);
        window.location.href = '/login';
        return { error: 'Error al renovar el Access Token.' };
    }
};

// Login API firebase
export const loginAPI = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}/loginAPI`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Login with my app
export const loginDB = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Refresh Login
export const getUserForRefreshLogin = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}/user?email=${encodeURIComponent(user.email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Enviar token en los headers
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();

            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }

            return getUserForRefreshLogin(user);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Logout for my app
export const logout = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');

        const response = await fetch(`${BACK_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ accessToken, refreshToken }),
        });

        if (response.status === 401) {
            const refreshResult = await refreshToken();

            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }

            // Reintenta el logout después de renovar el token
            return await logout();
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        // Clear Pinia store
        const appStore = useAppStore();
        appStore.$reset();

        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        return { message: 'Logout successful' };
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

export const subscribeToPushNotifications = async (user) => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
            const registration = await navigator.serviceWorker.register(
                "./service-worker.js"
            );
            console.log("Service Worker registrado!", registration);

            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("Permiso para notificaciones concedido");

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        import.meta.env.VITE_PUBLIC_VAPID_KEY
                    ),
                });

                console.log("Suscripción a notificaciones push: ", subscription);


                const response = await fetch(`${import.meta.env.VITE_URL_BACK_PUSH_NOTIFICATIONS}/subscribe`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id: user.id, subscription })
                });

                if (!response.ok) {
                    throw new Error("Failed to subscribe to push notifications");
                }

                return response.json();
            } else {
                console.log("Permiso para notificaciones denegado");
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        console.warn("Service Workers no soportados");
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Create new data user
export const createNewDataUser = async (userData) => {

    let sendUserData = {
        userPinia: useAppStore().user,
        userData: userData,
    };

    try {
        const response = await fetch(`${BACK_URL}/newDataUsers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(sendUserData),
        });

        if (response.status === 401) {
            const refreshResult = await refreshToken();

            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }

            // Reintenta la petición después de renovar el token
            return await createNewDataUser(userData);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Create publications
export const postCommunityPublication = async (formdata) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/publications`, {
            method: 'POST',
            body: formdata,
        });

        return response;
    } catch (error) {
        console.error(error);
    }
};

export const postEmploymentExchangePublication = async (formData) => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/publications`, {
            method: 'POST',
            body: formData,
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};

// Get Community Publications
export const getCommunityPublication = async () => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/publications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

export const getEmploymentExchangePublication = async () => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/publications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Get User Data
export const getUsersForOther = async () => {
    try {
        const response = await fetch(`${BACK_URL}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response;
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Get User Data in JSON
export const getUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}/usersAll`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

//Get Comments in Community Posts
export const getCommunityComments = async () => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

export const getEmploymentExchangeComments = async () => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};


//Post Comments in Community Posts
export const postCommunityComments = async (comment) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(comment),
        });
        return response.json();
    } catch (error) {
        console.error(error);
    }
};

export const postEmploymentExchangeComments = async (comment) => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(comment),
        });
        return response.json();
    } catch (error) {
        console.error(error);
    }
};

// Get all messages
export const fetchMessages = async (chatId) => {
    try {
        const response = await fetch(`${CHAT_URL}/getChat/${chatId}`);
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
            body: JSON.stringify({
                _id: chatData._id,
                users: chatData.users,
                interactions: [...chatData.interactions, newMessage],
            }),
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
        users: [userid1, userid2],
        interactions: [],
        reports: 0,
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

// Get all publications
export const fetchAllUserReports = async () => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users`, {
            method: "GET",
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch a single report user by ID
export const fetchReportUserById = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Create a new report user
export const createReportUser = async (reported_user_id, user_id, report) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reported_user_id, user_id, report }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Update a report user by ID
export const updateReportUser = async (id, status) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Delete a report user by ID
export const deleteReportUser = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Report deleted successfully" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch all reports comments
export const fetchAllReportsComments = async () => {
    try {
        const response = await fetch(`${BACK_URL}/reports/comments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch a single report comment by ID
export const fetchReportCommentById = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}7reports/comments/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Create a new report comment
export const createReportComment = async (comment_id, user_id, report) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment_id, user_id, report }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Update a report comment by ID
export const updateReportComment = async (id, status) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/comments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Delete a report comment by ID
export const deleteReportComment = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/comments/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Report deleted successfully" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch all reports Chats
export const fetchAllReportsChats = async () => {
    try {
        const response = await fetch(`${BACK_URL}/reports/chats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch a single report Chats by ID
export const fetchReportChatsById = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}7reports/chats/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Create a new report comment
export const createReportChats = async (comment_id, user_id, report) => {
    try {
        const response = await fetch(`${BACK_URL}/chats/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment_id, user_id, report }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Update a report comment by ID
export const updateReportChats = async (id, status) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/Chats/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Delete a report comment by ID
export const deleteReportChats = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/Chats/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Report deleted successfully" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch all reports publications
export const fetchAllReportsPublications = async () => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/reports/publications`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch a single report publication by ID
export const fetchReportPublicationById = async (id) => {
    try {
        const response = await fetch(
            `${COMMUNITY_URL}/reports/publications/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Create a new report publication
export const createReportPublication = async (
    publication_id,
    user_id,
    report,
    status
) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/reports/publications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ publication_id, user_id, report, status }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Update a report publication by ID
export const updateReportPublication = async (id, status) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/reports/publications/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};


// Delete a report publication by ID
export const deleteReportPublication = async (id) => {
    try {
        const response = await fetch(
            `${COMMUNITY_URL}/reports/publications/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "ReportPublication deleted successfully" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Get all users in status pending
export const fetchUserValidation = async () => {
    try {
        const response = await fetch(`${BACK_URL}/pendingUsers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pendingUsers = await response.json();
        return pendingUsers;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Get User Data
export const getNewUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}/newDataUsers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Get User Data
export const fetchAllClasses = async () => {
    try {
        const response = await fetch(`${BACK_URL}/classes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};


// delete a user in the admin validation
export const deleteUserInDb = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Report deleted successfully" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const deleteUserValidation = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/verified/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Usuari eliminat correctament" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};


export const updateUserValidation = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}/verified/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Usuari verificat correctament" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const getServices = async () => {
    try {
        const response = await fetch(`${MICROOSERVICES_URL}/getProcess`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const changeServiceViewUsers = async (id, enabled) => {
    try {
        const response = await fetch(`${MICROOSERVICES_URL}/changeServiceViewUserFront/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ enabled }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        throw new Error("Failed to update the service state.");
    }
};

export const getNotifications = async (userID) => {
    try {
        const response = await fetch(`${NOTIFICATIONS_URL}/getNotifications?user_id=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

export const updateNotificationRevision = async (id) => {

    try {
        const response = await fetch(`${NOTIFICATIONS_URL}/notifications/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to update notification');
        }
        return response;

    } catch (error) {
        console.error('Error updating notification:', error);
        throw error;
    }
};

export const getMyPublications = async (userID) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/getMyPublications?user_id=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching my publications:', error);
    }
}

export const getMyPeticions = async (userID) => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/getMyPublications?user_id=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching my publications:', error);
    }
}

export const reportChat = async (message_id, user_id, content, report) => {
    try {
      const response = await fetch(`${BACK_URL}/reports/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message_id, user_id, content, report }),
      });
  
      if (!response.ok) {
        return { error: `HTTP error! status: ${response.status}` };
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error reporting chat:', error);
      return { error: 'Network error. Please try again later.' };
    }
  };


  export const reportChatMongo = async (chatId, messageId) => {
    try {
      const response = await fetch(`${CHAT_URL}/reportMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, messageId }),
      });
  
      if (!response.ok) {
        return { error: `HTTP error! status: ${response.status}` };
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error reporting chat:', error);
      return { error: 'Network error. Please try again later.' };
    }
  };
  
export const editData = async (userData) => {
    console.log(userData);
    try {
        const response = await fetch(`${BACK_URL}/editData/${userData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(userData),
        });

        if (response.status === 401) {
            const refreshResult = await refreshToken();

            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }

            // Reintenta la petición después de renovar el token
            return await editData(userData);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }
        let res=await response.json();
        console.log(res)
        res.status=200
        return res;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
}

export const editGeneralInfo = async (userData, bannerPicture, profilePicture) => {
    try {
        let dataToSend=new FormData();
        dataToSend.append('profilePicture',profilePicture);
        dataToSend.append('bannerPicture',bannerPicture);
        dataToSend.append('name',userData.get('name'));
        dataToSend.append('city',userData.get('city'));
      
        let res = await fetch(`${BACK_URL}/editGeneralInfo/${userData.get('id')}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: dataToSend,
        });
        console.log("lmao", userData.get('profilePicture'));
        if (res.status === 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return await editGeneralInfo(userData);
        }
        if (!res.ok) {
            return { error: `HTTP error! status: ${res.status}` };
        }
        let response=await res.json();
        response[0].banner=BACK_URL+response[0].banner
        response[0].profile=BACK_URL+response[0].profile
        console.log(response[0])
        return response[0];
    } catch (error) {
        console.error('Error updating general info:', error);
        throw error;
    }
}

export const updateAvailability = async (id, availability) => {
try {
    const response = await fetch(`${BACK_URL}/updateAvailability/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ availability }),
    });

    if (response.status === 401) {
        const refreshResult = await refreshToken();

        if (refreshResult.error) {
            return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
        }

        // Reintenta la petición después de renovar el token
        return await updateAvailability(id, availability);
    }

    if (!response.ok) {
        return { error: `HTTP error! status: ${response.status}` };
    }
    let toReturn=await response.json();
    toReturn.status=200
    return toReturn
}catch (error) {
    console.error('Error updating availability:', error);
    throw error;
}
}