import { useAppStore } from "@/stores/index";

const BACK_URL = import.meta.env.VITE_BACK_URL;

export const checkUser = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}/api/user/checkUser`, {
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
        const response = await fetch(`${BACK_URL}/api/user/login`, {
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
        const response = await fetch(`${BACK_URL}/api/user/loginDB`, {
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
export const getUserAPI = async (userId) => {
    try {
        const response = await fetch(`${BACK_URL}/api/users/${userId}`, {
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

export const getUsersAPI = async () => {
    try {
        const response = await fetch(`${BACK_URL}/api/users`, {
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

export const updateUserAPI = async (userId, user) => {
    try {
        const response = await fetch(`${BACK_URL}/api/users/personalData/${userId}`, {
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

export const deleteUserAPI = async (userId) => {
    try {
        const response = await fetch(`${BACK_URL}/api/users/${userId}`, {
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

export const createUserAPI = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}/api/users`, {
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
}

export const updateUserRoleAPI = async (userId, typesUsersId) => {
    try {
        const response = await fetch(`${BACK_URL}/api/users/updateRole/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ typesUsers_id: typesUsersId }),
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