/**
 * Gestor de comunicaciones para el servicio de chat
 * Maneja todas las llamadas a la API de chat
 */

// URL base del servicio de chat
const API_URL_CHAT = import.meta.env.VITE_CHAT_URL;

function handle401(response) {
    if (response.status === 401) {
        window.location.href = '/';
        return true;
    }
    return false;
}

/**
 * Obtiene todos los chats disponibles
 * @returns {Promise<Array>} Lista de chats
 */
export const getAllChats = async () => {
    try {
        const response = await fetch(`${API_URL_CHAT}api/chat`);
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`Error al obtener chats: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getAllChats:', error);
        throw error;
    }
};

/**
 * Obtiene un chat específico por su ID
 * @param {string} chatId - ID del chat
 * @returns {Promise<Object>} Datos del chat
 */
export const getChatById = async (chatId) => {
    try {
        const response = await fetch(`${API_URL_CHAT}api/chat/${chatId}`);
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`Error al obtener chat: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error en getChatById (${chatId}):`, error);
        throw error;
    }
};

/**
 * Obtiene un chat por su nombre
 * @param {string} chatName - Nombre del chat
 * @returns {Promise<Object>} Datos del chat
 */
export const getChatByName = async (chatName) => {
    try {
        const response = await fetch(`${API_URL_CHAT}api/chat/name/${encodeURIComponent(chatName)}`);
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`Error al obtener chat por nombre: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error en getChatByName (${chatName}):`, error);
        throw error;
    }
};

/**
 * Crea un nuevo chat
 * @param {Object} chatData - Datos del nuevo chat
 * @param {string} chatData.name - Nombre del chat
 * @param {Array<string>} [chatData.teachers] - IDs de los profesores
 * @param {Array<Object>} [chatData.interaction] - Mensajes iniciales
 * @returns {Promise<Object>} Datos del chat creado
 */
export const createChat = async (chatData) => {
    try {
        const response = await fetch(`${API_URL_CHAT}api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chatData)
        });
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`Error al crear chat: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createChat:', error);
        throw error;
    }
};

/**
 * Envía un mensaje a un chat existente
 * @param {string} chatId - ID del chat
 * @param {string} teacherId - ID del profesor que envía el mensaje
 * @param {string} message - Contenido del mensaje
 * @returns {Promise<Object>} Chat actualizado con el nuevo mensaje
 */
export const sendMessage = async (chatId, teacherId, message) => {
    try {
        console.log(`Enviando mensaje al chat ${chatId}:`, { teacherId, message });

        // Detectar enlaces en el mensaje (como respaldo al procesamiento del servidor)
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const links = message.match(urlRegex) || [];
        const hasLinks = links.length > 0;

        const response = await fetch(`${API_URL_CHAT}api/chat/${chatId}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teacherId,
                message,
                hasLinks,
                links
            })
        });
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`Error al enviar mensaje: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor al enviar mensaje:', result);
        return result;
    } catch (error) {
        console.error(`Error en sendMessage (chat: ${chatId}):`, error);
        throw error;
    }
};

/**
 * Elimina un mensaje específico de un chat
 * @param {string} chatId - ID del chat
 * @param {string} messageId - ID del mensaje a eliminar
 * @returns {Promise<Object>} Chat actualizado sin el mensaje
 */
export const deleteMessage = async (chatId, messageId) => {
    try {
        console.log(`Intentando eliminar mensaje - Chat ID: ${chatId}, Mensaje ID: ${messageId}`);

        // Verificar que los IDs sean válidos
        if (!chatId || !messageId) {
            throw new Error("IDs de chat o mensaje no válidos");
        }

        // Verificar formato de los IDs (básico)
        const idRegex = /^[0-9a-fA-F]{24}$/;  // Formato común de ID de MongoDB
        const isNumericId = /^\d+$/.test(messageId);  // Formato numérico común también

        if (!idRegex.test(chatId)) {
            console.warn(`El formato del ID de chat ${chatId} podría no ser válido`);
        }

        if (!idRegex.test(messageId) && !isNumericId) {
            console.warn(`El formato del ID de mensaje ${messageId} podría no ser válido`);
        }

        // Realizar la solicitud DELETE
        const response = await fetch(`${API_URL_CHAT}api/chat/${chatId}/message/${messageId}`, {
            method: 'DELETE'
        });
        if (handle401(response)) return;

        // Si el mensaje no se encuentra, manejarlo de forma especial
        if (response.status === 404) {
            console.warn(`Mensaje ${messageId} no encontrado, puede que ya haya sido eliminado`);
            // Devolver un objeto simulando una respuesta exitosa
            return {
                success: true,
                message: "El mensaje ya no existe",
                alreadyDeleted: true
            };
        }

        // Para otros errores, lanzar excepción normal
        if (!response.ok) {
            throw new Error(`Error al eliminar mensaje: ${response.statusText}`);
        }

        // Si todo fue exitoso, devolver la respuesta
        return await response.json();
    } catch (error) {
        console.error(`Error en deleteMessage (chat: ${chatId}, mensaje: ${messageId}):`, error);
        throw error;
    }
};

/**
 * Elimina un chat por su ID
 * @param {string} chatId - ID del chat a eliminar
 * @returns {Promise<Object>} Respuesta de la operación
 */
export const deleteChat = async (chatId) => {
    try {
        const response = await fetch(`${API_URL_CHAT}api/chat/${chatId}`, {
            method: 'DELETE'
        });
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`Error al eliminar el chat: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en deleteChat (chatId: ${chatId}):`, error);
        throw error;
    }
};

/**
 * Obtiene todos los chats donde participa un profesor específico
 * @param {number} teacherId - ID del profesor
 * @returns {Promise<Array>} Lista de chats
 */
export const getChatsByUser = async (teacherId) => {
    try {
        const response = await fetch(`${API_URL_CHAT}api/chat/user/${teacherId}`);
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`Error al obtener chats del usuario: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error en getChatsByUser (teacherId: ${teacherId}):`, error);
        throw error;
    }
};

/**
 * Objeto que agrupa todas las funciones para facilitar la importación
 */
const chatManager = {
    getAllChats,
    getChatById,
    getChatByName,
    createChat,
    sendMessage,
    deleteMessage,
    deleteChat,
    getChatsByUser
};

export default chatManager;
