const BACK_URL = import.meta.env.VITE_LOST_OBJECT_URL;

// Obtener estadísticas de objetos perdidos
export const getLostObjectStats = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/lost-objects/stats/count`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }
        );
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching lost object stats:', error);
        return { total: 0, reportedToday: 0 };
    }
};

// Obtener todos los objetos perdidos
export const getAllLostObjects = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/lost-objects`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching lost objects:', error);
        return [];
    }
};