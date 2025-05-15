const BACK_URL = import.meta.env.VITE_GRADE_URL;
import { getAlumns } from "./mainManager.js";

export const getGradesFromUserAndCourse = async (userId, courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/grades/getAllGradesFromUserAndCourse/${userId}/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching grades:', error);
    }
}
export const getTasksFromCourse = async (courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/tasks/getAllTasksFromCourse/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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
export const getTask = async (taskId, courseId) => {
    try {
        const alumns = await getAlumns(courseId);
        alumns.forEach(alumn => {
            alumn.grades = null;
        });
        const response = await fetch(`${BACK_URL}api/grades/getAllGradesFromTask/${taskId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(alumns)
        console.log(data);
        data.forEach(grade => {
            alumns.forEach(alumn => {
                if (alumn.user_id == grade.user_id) {
                    alumn.grades = grade.grade;
                }
            });
        });
        return alumns;
    } catch (error) {
        console.error('Error fetching task:', error);
    }
}


export const updateGrade = async (user_id, grade, task_id) => {
    try {
        if (grade < 0 || grade > 10) {
            return { message: "Grade must be between 0 and 10" };
        }
        const gradeData = {
            user_id: user_id,
            task_id: task_id,
            grade: grade
        };
        const response = await fetch(`${BACK_URL}api/grades`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(gradeData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating grade:', error);
    }
}

export const getCourseStats = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/courses/stats/count`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching course stats:', error);
        return { total: 0, createdThisMonth: 0 };
    }
};