const BACK_URL = import.meta.env.VITE_LOST_OBJECT_URL;

function handle401(response) {
    if (response.status === 401) {
        window.location.href = '/';
        return true;
    }
    return false;
}

// Obtener estadísticas de objetos perdidos
export const getLostObjectStats = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/lost-objects/stats/count`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
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
        const response = await fetch(`${BACK_URL}api/lost-objects`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
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