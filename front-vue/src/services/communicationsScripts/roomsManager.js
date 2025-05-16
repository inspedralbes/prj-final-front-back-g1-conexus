const BACK_URL=import.meta.env.VITE_ROOM_URL;

// Obtener estadísticas de aulas
export const getRoomsStats = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/rooms/stats/count`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
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

