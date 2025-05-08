const API_URL = import.meta.env.VITE_LOST_OBJECT_URL;

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error in request');
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

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
        
        // Create data object to serialize
        const dataObj = {
            title: lostObjectData.objectName,
            description: lostObjectData.description,
            user_id: lostObjectData.user_id || 1, // Default to user 1 if not provided
            expired_at: lostObjectData.foundDate ? new Date(new Date(lostObjectData.foundDate).getTime() + 14*24*60*60*1000).toISOString() : null,
            location: lostObjectData.location
        };
        
        formData.append('data', JSON.stringify(dataObj));
        
        if (lostObjectData.image) {
            formData.append('image', lostObjectData.image);
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
};