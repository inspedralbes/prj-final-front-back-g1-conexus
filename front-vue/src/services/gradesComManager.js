const BACK_URL = import.meta.env.VITE_GRADE_URL;

export const getTasksFromCourse = async (courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/tasks/getAllTasksFromCourse/${courseId}`, {
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
        console.error('Error fetching tasks:', error);
    }
}
export const createTask = async (task) => {
    try {
        const response = await fetch(`${BACK_URL}api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating task:', error);
    }
}