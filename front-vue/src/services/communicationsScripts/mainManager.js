import { useAppStore } from "@/stores/index";

const BACK_URL = import.meta.env.VITE_BACKEND_URL;

export const checkUser = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/checkUser`, {
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

export const loginAPI = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/login`, {
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

export const loginDB = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/loginDB`, {
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

export const logout = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        // Clear Pinia store
        const appStore = useAppStore();
        appStore.$reset();

        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        return { message: 'Logout successful' };
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};
export const getUser = async (userId) => {
    try {
        const response = await fetch(`${BACK_URL}api/users/${userId}`, {
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
}

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Verificar primero el tipo de contenido
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Respuesta recibida:", await response.text());
            return { 
                error: `Error: Respuesta del servidor no es JSON válido (${response.status})` 
            };
        }

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const updateUser = async (userId, user) => {
    try {
        const response = await fetch(`${BACK_URL}api/users/personalData/${userId}`, {
            method: "PUT",
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
}

export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/${userId}`, {
            method: "DELETE",
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
}

export const createUser = async (formData) => {
    try {
        const response = await fetch(`${BACK_URL}api/user`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const updateUserRole = async (userId, typesUsersId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/updateRole/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ typeUsers_id: typesUsersId }),
        });

        // Verificar primero el tipo de contenido
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return { 
                error: `Error: Respuesta del servidor no es JSON válido (${response.status})` 
            };
        }

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};


export const getAllTypeUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/type-users`, {
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
}