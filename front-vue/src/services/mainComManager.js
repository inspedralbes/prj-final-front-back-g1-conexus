const BACK_URL = import.meta.env.VITE_BACKEND_URL;

export const getCoursesFromUser = async (userId) => {
    try {
        const response = await fetch(`${BACK_URL}api/courses/teacher/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}
