import { useAppStore } from "@/stores/index";

const BACK_URL = import.meta.env.VITE_BACKEND_URL;

export const loginAPI = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const getCoursesWithUser= async (userId) => {
    try{
        const response = await fetch(`${BACK_URL}api/user-courses/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    }catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

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

export const getHoursOfCourse = async (courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/courses/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const processedHours = Object.fromEntries(
            daysOfWeek.map(day => {
            if (!data.course_hours_available[day] || data.course_hours_available[day].length === 0) {
                return [day, null];
            }
            const ranges = data.course_hours_available[day];
            const slots = ranges.flatMap(range => {
                const [start, end] = range.split('-').map(time => {
                    const [hours, minutes] = time.split(':').map(Number);
                    return hours * 60 + minutes;
                });
                const result = [];
                for (let time = start; time < end; time += 60) {
                    const slotStart = time;
                    const slotEnd = Math.min(time + 60, end);
                    const formatTime = minutes => {
                        const h = Math.floor(minutes / 60);
                        const m = minutes % 60;
                        return `${h}:${m.toString().padStart(2, '0')}`;
                    };
                    result.push(`${formatTime(slotStart)}-${formatTime(slotEnd)}`);
                }
                return result;
            });
            return [day, slots];
            })
        );
        data.course_hours_available = processedHours;
        processedHours.course_id = data.course_id;
        processedHours.course_name = data.course_name;
        return processedHours;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
    
}

export const getAlumns = async (courseId) => {
    return fetch(`${BACK_URL}api/user-courses/course/${courseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .catch(error => console.error('Error fetching courses:', error));
}
