const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function to handle fetch responses
const handleResponse = async (response) => {
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
        const response = await fetch(`${API_URL}api/rooms/stats/count`);
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
        const response = await fetch(`${API_URL}api/rooms`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};

// Get a single room by ID
export const getRoomById = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/rooms/${id}`);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching room ${id}:`, error);
        throw error;
    }
};

