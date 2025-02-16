import { refreshToken } from "@/services/communicationsScripts/mainManager";
import { useAppStore } from "@/stores/index";
const COMMUNITY_URL = import.meta.env.VITE_URL_BACK_COMMUNITY;

// Get Community Publications
export const getCommunityPublication = async () => {
    const user_id = useAppStore().getUser().id;

    console.log('user_id:', user_id);

    try {
        const response = await fetch(`${COMMUNITY_URL}/publications?user_id=${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return getCommunityPublication();
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Post Community Publications
export const postCommunityPublication = async (formdata) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/publications`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: formdata,
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return postCommunityPublication(formdata);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return response;
    } catch (error) {
        console.error(error);
    }
};

//Get Comments in Community Posts
export const getCommunityComments = async () => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return getCommunityComments();
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

//Post Comments in Community Posts
export const postCommunityComments = async (comment) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(comment),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return postCommunityComments(comment);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

// Fetch all reports publications
export const fetchAllReportsPublications = async () => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/reports/publications`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return fetchAllReportsPublications();
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Fetch a single report publication by ID
export const fetchReportPublicationById = async (id) => {
    try {
        const response = await fetch(
            `${COMMUNITY_URL}/reports/publications/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
            }
        );

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return fetchReportPublicationById(id);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Create a new report publication
export const createReportPublication = async (
    publication_id,
    user_id,
    report,
    status
) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/reports/publications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ publication_id, user_id, report, status }),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return createReportPublication(publication_id, user_id, report, status);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Update a report publication by ID
export const updateReportPublication = async (id, status) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/reports/publications/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ status }),
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return updateReportPublication(id, status);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Network error. Please try again later.' };
    }
};

// Delete a report publication by ID
export const deleteReportPublication = async (id) => {
    try {
        const response = await fetch(
            `${COMMUNITY_URL}/reports/publications/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
            }
        );

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return deleteReportPublication(id);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return { message: "ReportPublication deleted successfully" };
    } catch (error) {
        console.error("Network error:", error);
        return { error: "Network error. Please try again later." };
    }
};

// Get all reports comments
export const getMyPublicationsInCommunity = async (userID) => {
    try {
        const response = await fetch(`${COMMUNITY_URL}/getMyPublications?user_id=${userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        });

        if (response.status == 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.error) {
                return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
            }
            return getMyPublicationsInCommunity(userID);
        }

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching my publications:', error);
    }
};