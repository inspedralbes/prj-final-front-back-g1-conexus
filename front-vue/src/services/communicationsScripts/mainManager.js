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
            if (response.status === 404) {
                return { error: 'Correu electrònic o contrasenya incorrectes. Verifica les teves credencials.' };
            } else {
                return { error: `Error inesperat. Proba a iniciar sessio més tard.` };
            }
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
            if (response.status === 404) {
                return { error: 'Correu electrònic o contrasenya incorrectes. Verifica les teves credencials.' };
            } else {
                return { error: `Error inesperat. Proba a iniciar sessio més tard.` };
            }
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