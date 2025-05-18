import { useAppStore } from "@/stores/index";

const BACK_URL = import.meta.env.VITE_BACKEND_URL;

export const getTypeUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/type-users/`);
        if (!response.ok) {
            throw new Error("Error fetching type users");
        }
        const data = await response.json();
        console.log("Response:", data);
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/email`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ email }),
            }
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                return { error: "Correu electrònic no trobat." };
            } else {
                return { error: "Error inesperat. Proba a registrar-te més tard." };
            }
        }

        const data = await response.json();
        console.log("Response:", data);
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const register = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            if (response.status === 400) {
                return { error: 'Correu electrònic ja registrat. Proba a iniciar sessio.' };
            } else if (response.status === 500) {
                return { error: 'Error inesperat. Proba a registrar-te més tard.' };
            } else {
                return { error: 'Error desconegut. Proba a registrar-te més tard.' };
            }
        }
        const data = await response.json();
        console.log("Response:", data);
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

export const login = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { error: 'Correu electrònic o contrasenya incorrectes. Verifica les teves credencials.' };
            } else {
                return { error: `Error inesperat. Proba a iniciar sessio més tard.` };
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

export const logout = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const appStore = useAppStore();
        appStore.$reset();

        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        return { message: 'Logout successful' };
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

export const getCoursesWithUser = async (userId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user-courses/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
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

export const getCoursesFromUser = async (userId) => {
    try {
        const response = await fetch(`${BACK_URL}api/courses/teacher/${userId}`, {
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
        console.error('Error fetching courses:', error);
    }
};

export const getHoursOfCourse = async (courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/courses/${courseId}`, {
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
        console.log(data);
        const daysOfWeek = ['monday', 'tuesday', 'wensday', 'thursday', 'friday', 'saturday', 'sunday'];
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

};

export const getAlumns = async (courseId) => {
    return fetch(`${BACK_URL}api/user-courses/course/${courseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
    })
        .then(response => response.json())
        .catch(error => console.error('Error fetching courses:', error));
};

export const getUser = async (userId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        // Verificar primero el tipo de contenido
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Respuesta recibida:", await response.text());
            return {
                error: `Error: Respuesta del servidor no es JSON válido (${response.status})`
            };
        }

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const updateUser = async (userId, user) => {
    try {
        const response = await fetch(`${BACK_URL}api/users/personalData/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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
}

export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const createUser = async (formData) => {
    try {
        const response = await fetch(`${BACK_URL}api/user`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const updateUserRole = async (userId, typesUsersId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/updateRole/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ typeUsers_id: typesUsersId }),
        });

        // Verificar primero el tipo de contenido
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return {
                error: `Error: Respuesta del servidor no es JSON válido (${response.status})`
            };
        }

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const getAllTypeUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/type-users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const getAllCourses = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/courses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const courses = await response.json();

        for (const course of courses) {
            console.log(course);
            if (course.course_teacher_id) {
                try {
                    const teacherResponse = await fetch(`${BACK_URL}api/user/${course.course_teacher_id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                    });
                    console.log(teacherResponse);

                    if (teacherResponse.ok) {
                        const teacherData = await teacherResponse.json();
                        course.teacher = teacherData;
                    } else {
                        console.error(`Failed to fetch teacher with ID ${course.course_teacher_id}`);
                        course.teacher = null;
                    }
                } catch (error) {
                    console.error(`Error fetching teacher with ID ${course.course_teacher_id}:`, error);
                    course.teacher = null;
                }
            }
        }

        return courses;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

export const deleteCourse = async (courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/courses/${courseId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const createCourse = async (course) => {
    try {
        console.log(course.course_hours_available);
        // Convertir el objeto course a una cadena JSON 
        const response = await fetch(`${BACK_URL}api/courses`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(course),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const updateCourse = async (courseId, course) => {
    try {
        const response = await fetch(`${BACK_URL}api/courses/updateCourse/${courseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(course),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const getAllDepartments = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/departments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}

export const getAllTeachersFromDepartment = async (departmentId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user/teachers/${departmentId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}
export const getCoursesWithoutUser = async (userId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user-courses/not-enrolled/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}
export const inscribeUser= async (courseId, userId) => {
    console.log(userId, courseId);
    try {
        const response = await fetch(`${BACK_URL}api/user-courses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ user_id: userId, course_id: courseId }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}
export const getCoursesWithoutTeacher = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/courses/withoutTeacher`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}
export const deleteUserFromCourse = async (userId, courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/user-courses/${userId}/${courseId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}
export const desassignTeacher = async (courseId) => {
    try {
        const response = await fetch(`${BACK_URL}api/courses/desassignTeacher/${courseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ course_teacher_id: null }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}
export const assignTeacher = async (courseId, teacherId) => {
    console.log(courseId, teacherId);   
    try {
        const response = await fetch(`${BACK_URL}api/courses/assignTeacher`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ course_id: courseId, teacher_id: teacherId }),
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
}


export const countUsers = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/user/stats/count`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error("Error fetching user count");
        }
        const data = await response.json();
        console.log("User count data:", data);
        return data;
    } catch (error) {
        console.error("Error in countUsers:", error);
        throw error;
    }
};

export const getLatestActivities = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/activities`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error ${response.status}: ${errorText}`);
            return { error: `Error del servidor: ${response.status}` };
        }
        
        // Intentar parsear la respuesta como JSON
        try {
            const data = await response.json();
            return data || [];
        } catch (parseError) {
            console.error("Error parseando JSON:", parseError);
            return { error: "La respuesta no es un JSON válido" };
        }
    } catch (error) {
        console.error("Error de red:", error);
        return { error: "Error de conexión. Comprueba tu red." };
    }
};