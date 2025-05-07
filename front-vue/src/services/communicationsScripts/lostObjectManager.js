const API_URL = import.meta.env.VITE_LOST_OBJECT_URL;

export const getAllLostObjects = async () => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching lost objects:', error);
        throw error;
    }
};


export const getLostObjectById = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${id}`);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching lost object ${id}:`, error);
        throw error;
    }
};

export const createLostObject = async (lostObjectData) => {
    try {
        const formData = new FormData();
        for (const key in lostObjectData) {
            formData.append(key, lostObjectData[key]);
        }
        const response = await fetch(`${API_URL}api/lost-objects`, {
            method: 'POST',
            body: formData,
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error creating lost object:', error);
        throw error;
    }
}

export const updateLostObject = async (id, lostObjectData) => {
    try {
        const formData = new FormData();
        for (const key in lostObjectData) {
            formData.append(key, lostObjectData[key]);
        }
        const response = await fetch(`${API_URL}api/lost-objects/${id}`, {
            method: 'PUT',
            body: formData,
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error updating lost object ${id}:`, error);
        throw error;
    }
}

export const deleteLostObject = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${id}`, {
            method: 'DELETE',
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error deleting lost object ${id}:`, error);
        throw error;
    }
}