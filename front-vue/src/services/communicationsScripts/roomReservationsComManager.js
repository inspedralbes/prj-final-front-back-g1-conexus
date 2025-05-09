const BACK_URL=import.meta.env.VITE_ROOM_URL;
export const getAllRooms = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/rooms`, {
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
};
export const getReservationsFormRoom = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}api/roomReservations/room/${id}`, {
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

export const createNewReservation = async (reservation) => {
    try {
        const response = await fetch(`${BACK_URL}api/roomReservations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reservation),
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

export const createNewRoom = async (room) => {
    try {
        const response = await fetch(`${BACK_URL}api/rooms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(room),
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
export const deleteRoom = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}api/rooms/${id}`, {
            method: "DELETE",
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
export const updateRoom = async (id, room) => {
    try {
        const response = await fetch(`${BACK_URL}api/rooms/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(room),
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