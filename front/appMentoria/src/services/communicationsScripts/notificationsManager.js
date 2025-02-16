import { refreshToken } from "@/services/communicationsScripts/mainManager";
const NOTIFICATIONS_URL = import.meta.env.VITE_URL_BACK_NOTIFICATIONS;

// Get all notifications for a user
export const getNotifications = async (userID) => {
    try {
        const response = await fetch(`${NOTIFICATIONS_URL}/getNotifications?user_id=${userID}`, {
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
            return getNotifications(userID);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

// Update notification status
export const updateNotificationRevision = async (id) => {
    try {
        const response = await fetch(`${NOTIFICATIONS_URL}/notifications/${id}`, {
            method: 'PUT',
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
            return updateNotificationRevision(id);
        }

        if (!response.ok) {
            throw new Error('Failed to update notification');
        }
        return response;

    } catch (error) {
        console.error('Error updating notification:', error);
        throw error;
    }
};