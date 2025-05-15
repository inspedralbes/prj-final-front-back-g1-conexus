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
        const response = await fetch(`${API_URL}api/lost-objects`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }
        );
        const objects = await handleResponse(response);
        
        // Para cada objeto, carga sus respuestas
        for (const object of objects) {
            try {
                const responsesData = await getLostObjectResponses(object.id);
                object.responses = responsesData;
                object.responses_count = responsesData.length;
            } catch (error) {
                console.warn(`Error loading responses for object ${object.id}`, error);
                object.responses = [];
                object.responses_count = 0;
            }
        }
        
        return objects;
    } catch (error) {
        console.error('Error fetching lost objects:', error);
        throw error;
    }
};

// Añadir esta función:
export const getLostObjectsResponsesCount = async () => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/responses-count`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }
        );
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching response counts:', error);
        throw error;
    }
};

export const getLostObjectById = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }
        );
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching lost object ${id}:`, error);
        throw error;
    }
};

export const createLostObject = async (lostObjectData, userId) => {
    try {
        const formData = new FormData();
        
        // Create data object to serialize
        const dataObj = {
            title: lostObjectData.objectName,
            description: lostObjectData.description,
            user_id: userId, // Use the provided user ID
            expired_at: lostObjectData.foundDate ? new Date(new Date(lostObjectData.foundDate).getTime() + 14*24*60*60*1000).toISOString() : null,
            location: lostObjectData.location
        };
        
        formData.append('data', JSON.stringify(dataObj));
        
        if (lostObjectData.image) {
            formData.append('image', lostObjectData.image);
        }
        
        const response = await fetch(`${API_URL}api/lost-objects`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: formData,
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error creating lost object:', error);
        throw error;
    }
};

export const deleteLostObject = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        
        if (response.status === 204) {
            return true;
        }
        
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error deleting lost object ${id}:`, error);
        throw error;
    }
};

export const getLostObjectResponses = async (lostObjectId) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${lostObjectId}/responses`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }
        );
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching responses for lost object ${lostObjectId}:`, error);
        throw error;
    }
};

export const createResponse = async (lostObjectId, responseData) => {
    try {
        // Asegúrate de que responseData contiene user_id y comment
        console.log('Enviando respuesta:', responseData); // Añade este log para debug
        
        const response = await fetch(`${API_URL}api/lost-objects/${lostObjectId}/responses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                user_id: responseData.user_id,
                lostAndFound_id: lostObjectId, // Añadir esto si es necesario
                comment: responseData.comment
            }),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error creating response for lost object ${lostObjectId}:`, error);
        throw error;
    }
};

export const deleteResponse = async (lostObjectId, responseId) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${lostObjectId}/responses/${responseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        
        if (response.status === 204) {
            return true;
        }
        
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error deleting response ${responseId} for lost object ${lostObjectId}:`, error);
        throw error;
    }
};