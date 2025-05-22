const BACK_URL = import.meta.env.VITE_ASSISTENCE_URL;

function handle401(response) {
    if (response.status === 401) {
        window.location.href = '/';
        return true;
    }
    return false;
}

export const updateAttendance = async (courseId, userId, hour, assisted, day) => {
    try {
        const dataToSend = {
            course_id: courseId,
            user_id: userId,
            hour,
            assisted,
            day,
        };
        const response = await fetch(`${BACK_URL}api/assistences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(dataToSend),
        });
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
    }
};

export const getAttendanceFromCourse = async (courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/assistences/course/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
    }
};

export const getAlumns = async (courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user-courses/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
    }
};

export const getAttendanceFromDay = async (courseId, day) => {
    try {
        const response = await fetch(`${BACK_URL}api/assistences/course/${courseId}/day/${day}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
    }
};

export const getAttendanceFromUserAndCourse = async (userId, courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/assistences/user/${userId}/course/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
    }
};