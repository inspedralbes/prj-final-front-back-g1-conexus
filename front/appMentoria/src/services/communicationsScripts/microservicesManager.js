const MICROSERVICES_URL = import.meta.env.VITE_URL_BACK_MICROSERVICES;

// Get all services
export const getServices = async () => {
    try {
        const response = await fetch(`${MICROSERVICES_URL}/getProcess`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// ----
export const changeServiceViewUsers = async (id, enabled) => {
    try {
        const response = await fetch(`${MICROSERVICES_URL}/changeServiceViewUserFront/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ enabled }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Network error:", error);
        throw new Error("Failed to update the service state.");
    }
};