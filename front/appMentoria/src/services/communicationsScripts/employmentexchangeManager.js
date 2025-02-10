const EMPLOYMENTEXCHANGE_URL = import.meta.env.VITE_URL_BACK_EMPLOYMENT_EXCHANGE;
import { refreshToken } from "@/services/communicationsScripts/mainManager";

// Get all publications in employment exchange
export const getEmploymentExchangePublication = async () => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/publications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return getEmploymentExchangePublication();
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Post in employment exchange
export const postEmploymentExchangePublication = async (formData) => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/publications`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,                
            },
            body: formData,
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return postEmploymentExchangePublication(formData);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return response;
    } catch (error) {
        console.error(error);
    }
};

// Get employment exchange publications
export const getEmploymentExchangeComments = async () => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return getEmploymentExchangeComments();
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Post Comments in Employment Exchange Posts
export const postEmploymentExchangeComments = async (comment) => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(comment),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return postEmploymentExchangeComments(comment);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

// Get my publications in employment exchange
export const getMyPeticions = async (userID) => {
    try {
        const response = await fetch(`${EMPLOYMENTEXCHANGE_URL}/getMyPublications?user_id=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,                
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return getMyPeticions(userID);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching my publications:', error);
    }
}