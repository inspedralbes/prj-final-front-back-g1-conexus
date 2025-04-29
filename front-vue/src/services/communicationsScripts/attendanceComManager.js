const BACK_URL=import.meta.env.VITE_ASSISTENCE_URL;

export const updateAttendance = async (courseId, userId, hour, assisted, day) => {
    try {
        console.log("course_id", courseId);
        console.log("user_id", userId);
        console.log("hour", hour);
        console.log("assisted", assisted);
        console.log("day", day);
        const dataToSend={};
        dataToSend.course_id=courseId;
        dataToSend.user_id=userId;
        dataToSend.hour=hour;
        dataToSend.assisted=assisted;
        dataToSend.day=day;
        const response = await fetch(`${BACK_URL}api/assistences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
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
export const getAttendanceFromCourse = async (courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/assistences/course/${courseId}`, {
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

export const getAlumns=async (courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user-courses/${courseId}`, {
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

export const getAttendanceFromDay = async (courseId, day) => {
    try {
        const response = await fetch(`${BACK_URL}api/assistences/course/${courseId}/day/${day}`, {
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