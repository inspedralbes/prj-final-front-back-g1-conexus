const API_URL = import.meta.env.VITE_LOST_OBJECT_URL;

// Obtenir tots els objectes perduts
export const getAllLostObjects = async () => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error obtenint objectes perduts");
        }

        return await response.json();
    } catch (error) {
        console.error("Error obtenint objectes perduts:", error);
        throw error;
    }
};

// Obtenir un objecte perdut per ID
export const getLostObjectById = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error obtenint l'objecte perdut amb ID ${id}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error obtenint l'objecte perdut amb ID ${id}:`, error);
        throw error;
    }
};

// Crear un nou objecte perdut
export const createLostObject = async (objectData) => {
    try {
        // Crear FormData si hi ha una imatge
        const formData = new FormData();
        
        // Afegim les propietats individualment
        formData.append('title', objectData.title);
        formData.append('description', objectData.description);
        formData.append('location', objectData.location);
        formData.append('foundDate', objectData.foundDate);
        
        // Afegim userid actual
        formData.append('user_id', localStorage.getItem('userId') || '1');
        
        // Afegim la imatge si existeix
        if (objectData.image) {
            formData.append('image', objectData.image);
        }
        
        // No cal enviar les dades com a JSON
        // No utilitzem JSON.stringify amb FormData

        const response = await fetch(`${API_URL}api/lost-objects`, {
            method: 'POST',
            headers: {
                // No afegim Content-Type perquè FormData ho defineix automàticament
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: formData // Enviem directament el FormData sense JSON.stringify
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || `Error al servidor: ${response.status}`;
            } catch (e) {
                errorMessage = errorText || `Error al servidor: ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        const responseText = await response.text();
        return responseText ? JSON.parse(responseText) : { success: true };
    } catch (error) {
        console.error("Error creant l'objecte perdut:", error);
        throw error;
    }
};

// Actualitzar un objecte perdut existent
export const updateLostObject = async (id, objectData) => {
    try {
        // Crear FormData si hi ha una imatge
        const formData = new FormData();
        formData.append('title', objectData.title);
        formData.append('description', objectData.description);
        formData.append('location', objectData.location);
        formData.append('foundDate', objectData.foundDate);
        
        // Si la imatge és un File (nova imatge seleccionada), afegir-la al FormData
        if (objectData.image && objectData.image instanceof File) {
            formData.append('image', objectData.image);
        } 
        // Si la imatge és un string (URL existent) o null, passar-la com a string
        else {
            formData.append('currentImage', objectData.image || '');
        }

        const response = await fetch(`${API_URL}api/lost-objects/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                // No es defineix 'Content-Type' perquè es configura automàticament amb FormData
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error actualitzant l'objecte perdut amb ID ${id}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error actualitzant l'objecte perdut amb ID ${id}:`, error);
        throw error;
    }
};

// Eliminar un objecte perdut
export const deleteLostObject = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error eliminant l'objecte perdut amb ID ${id}`);
        }

        // Si la resposta és buida o només inclou un estat HTTP
        const text = await response.text();
        if (!text) {
            return { success: true };
        }

        try {
            // Intentar analitzar com a JSON
            return JSON.parse(text);
        } catch (e) {
            // Si no és JSON, retornar el text
            return { message: text, success: response.ok };
        }
    } catch (error) {
        console.error(`Error eliminant l'objecte perdut amb ID ${id}:`, error);
        throw error;
    }
};

// Obtenir comentaris d'un objecte perdut
export const getLostObjectResponses = async (objectId) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${objectId}/responses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error obtenint comentaris de l'objecte ${objectId}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error obtenint comentaris de l'objecte ${objectId}:`, error);
        throw error;
    }
};

// Afegir un comentari a un objecte perdut
export const addLostObjectResponse = async (objectId, responseData) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${objectId}/responses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(responseData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error afegint comentari a l'objecte ${objectId}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error afegint comentari a l'objecte ${objectId}:`, error);
        throw error;
    }
};

// Eliminar un comentari d'un objecte perdut
export const deleteLostObjectResponse = async (objectId, responseId) => {
    try {
        const response = await fetch(`${API_URL}api/lost-objects/${objectId}/responses/${responseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error eliminant comentari ${responseId}`);
        }

        // Si la resposta és buida o només inclou un estat HTTP
        const text = await response.text();
        if (!text) {
            return { success: true };
        }

        try {
            // Intentar analitzar com a JSON
            return JSON.parse(text);
        } catch (e) {
            // Si no és JSON, retornar el text
            return { message: text, success: response.ok };
        }
    } catch (error) {
        console.error(`Error eliminant comentari ${responseId}:`, error);
        throw error;
    }
};