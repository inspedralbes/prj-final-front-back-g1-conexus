import { useAppStore } from "@/stores/index";

const BACK_URL = import.meta.env.VITE_BACKEND_URL;

export const getTypeUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/type-users/`);
        if (!response.ok) {
            throw new Error("Error fetching type users");
        }
        const data = await response.json();
        console.log("Response:", data); 
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const register = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            if (response.status === 400) {
                return { error: 'Correu electrònic ja registrat. Proba a iniciar sessio.' };
            } else if (response.status === 500) {
                return { error: 'Error inesperat. Proba a registrar-te més tard.' };
            } else {
                return { error: 'Error desconegut. Proba a registrar-te més tard.' };
            }
        }
        const data = await response.json();
        console.log("Response:", data);
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

export const login = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/login`, {
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

        const appStore = useAppStore();
        appStore.$reset();

        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        return { message: 'Logout successful' };
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};