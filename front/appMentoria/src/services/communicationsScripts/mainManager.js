import { useAppStore } from '@/stores/index';
import { ref } from 'vue';

const BACK_URL = import.meta.env.VITE_URL_BACK;

// ------------------------------------ Login / Logout ------------------------------------
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

// Logout for my app
export const logout = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');

        console.log('refreshToken:');

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
            console.log('refreshResult:', refreshResult);
            console.log('Holaaaaaaaaaaaaaaaa');

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

// Get User Data
export const getUsersForOther = async () => {
    console.log("getUsersForOther")
    try {
        const response = await fetch(`${BACK_URL}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();

            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }

            return getUsersForOther();
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
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
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return getUsers();
        }
        
        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Get all publications
export const fetchAllUserReports = async () => {
    try {
        const response = await fetch(`${BACK_URL}/reports/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return fetchAllUserReports();
        }

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
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return fetchReportUserById(id);
        }

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
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ reported_user_id, user_id, report }),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return createReportUser(reported_user_id, user_id, report);
        }

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
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ status }),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return updateReportUser(id, status);
        }

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
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return deleteReportUser(id);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return fetchAllReportsComments();
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return fetchReportCommentById(id);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ comment_id, user_id, report }),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return createReportComment(comment_id, user_id, report);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ status }),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return updateReportComment(id, status);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return deleteReportComment(id);
        }
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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return fetchAllReportsChats();
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return fetchReportChatsById(id);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ comment_id, user_id, report }),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return createReportChats(comment_id, user_id, report);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({ status }),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return updateReportChats(id, status);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return deleteReportChats(id);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Report deleted successfully" };
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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return fetchUserValidation();
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return getNewUsers();
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return fetchAllClasses();
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return deleteUserInDb(id);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return deleteUserValidation(id);
        }

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
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: "No se pudo renovar el token. Inicia sesión nuevamente." };
            }
            return updateUserValidation(id);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "Usuari verificat correctament" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const reportChat = async (message_id, user_id, content, report) => {
    try {
        const response = await fetch(`${BACK_URL}/reports/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ message_id, user_id, content, report }),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return reportChat(message_id, user_id, content, report);
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

export const editData = async (userData) => {
    console.log(userData);
    try {
        const response = await fetch(`${BACK_URL}/editData/${userData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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
        let res = await response.json();
        console.log(res)
        res.status = 200
        return res;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
}

export const editGeneralInfo = async (userData, bannerPicture, profilePicture) => {
    try {
        let dataToSend = new FormData();
        dataToSend.append('profilePicture', profilePicture);
        dataToSend.append('bannerPicture', bannerPicture);
        dataToSend.append('name', userData.get('name'));
        dataToSend.append('city', userData.get('city'));

        let res = await fetch(`${BACK_URL}/editGeneralInfo/${userData.get('id')}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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
        let response = await res.json();
        response[0].banner = BACK_URL + response[0].banner
        response[0].profile = BACK_URL + response[0].profile
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
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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
        let toReturn = await response.json();
        toReturn.status = 200
        return toReturn
    } catch (error) {
        console.error('Error updating availability:', error);
        throw error;
    }
}