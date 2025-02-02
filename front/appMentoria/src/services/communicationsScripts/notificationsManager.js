const NOTIFICATIONS_URL = import.meta.env.VITE_URL_BACK_NOTIFICATIONS;

// Get all notifications for a user
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

// Update notification status
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