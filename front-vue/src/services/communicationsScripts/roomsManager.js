const API_URL = import.meta.env.VITE_BACKEND_URL;
function handle401(response) {
    if (response.status === 401) {
        window.location.href = '/';
        return true;
    }
    return false;
}

// Helper function to handle fetch responses
const handleResponse = async (response) => {
    if (handle401(response)) return;
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error en la solicitud');
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

// Obtener estadísticas de aulas
export const getRoomsStats = async () => {
    try {
        const response = await fetch(`${API_URL}api/rooms/stats/count`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return { total: 0, available: 0, maintenance: 0 };
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching room stats:', error);
        return { total: 0, available: 0, maintenance: 0 };
    }
};

// Get all rooms
export const getAllRooms = async () => {
    try {
        const response = await fetch(`${API_URL}api/rooms`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return [];
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};

// Get a single room by ID
export const getRoomById = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/rooms/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return null;
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching room ${id}:`, error);
        throw error;
    }
};
