import { useAppStore } from "@/stores/index";

const BACK_URL = import.meta.env.VITE_BACK_URL;


export const loginAPI = async (user) => {
    try {
        const response = await fetch(`${BACK_URL}/api/user/login`, {
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
        const response = await fetch(`${BACK_URL}/api/user-courses/user/${userId}`, {
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
