const API_URL = import.meta.env.VITE_INCIDENT_URL;

function handle401(response) {
    if (response.status === 401) {
        window.location.href = '/';
        return true;
    }
    return false;
}

// Helper function to handle fetch responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error en la solicitud');
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

// Get all reports
export const getAllReports = async () => {
    try {
        const response = await fetch(`${API_URL}api/reports`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
};

// Get a single report by ID
export const getReportById = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/reports/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching report ${id}:`, error);
        throw error;
    }
};

// Create a new report
export const createReport = async (reportData) => {
    try {
        const response = await fetch(`${API_URL}api/reports`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: reportData,
        });
        if (handle401(response)) return;
        return await handleResponse(response);
    } catch (error) {
        console.error('Error creating report:', error);
        throw error;
    }
};

// Update a report
export const updateReport = async (id, reportData) => {
    try {
        const response = await fetch(`${API_URL}api/reports/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(reportData),
        });
        if (handle401(response)) return;
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error updating report ${id}:`, error);
        throw error;
    }
};

// Delete a report
export const deleteReport = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/reports/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error eliminant l'informe ${id}`);
        }
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
    } catch (error) {
        console.error(`Error eliminant l'informe ${id}:`, error);
        throw error;
    }
};

// Get reports by user ID
export const getReportsByUserId = async (userId) => {
    try {
        const response = await fetch(`${API_URL}api/reports/user/${userId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching reports for user ${userId}:`, error);
        throw error;
    }
};

// Get reports by room ID
export const getReportsByRoomId = async (roomId) => {
    try {
        const response = await fetch(`${API_URL}api/reports/room/${roomId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching reports for room ${roomId}:`, error);
        throw error;
    }
};

// Get finished reports
export const getFinishedReports = async () => {
    try {
        const response = await fetch(`${API_URL}api/reports/finished`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching finished reports:', error);
        throw error;
    }
};

// Get not finished reports
export const getNotFinishedReports = async () => {
    try {
        const response = await fetch(`${API_URL}api/reports/not-finished`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching not finished reports:', error);
        throw error;
    }
};

// Corregir la función assignReport
export const assignReport = async (reportId, userId) => {
    try {
        const response = await fetch(`${API_URL}api/reports/${reportId}/assign`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ user_assigned: userId }),
        });
        if (handle401(response)) return;
        const text = await response.text();
        if (!text) {
            return { success: true };
        }
        try {
            return JSON.parse(text);
        } catch (e) {
            return { message: text, success: response.ok };
        }
    }
    catch (error) {
        console.error(`Error assigning report ${reportId} to user ${userId}:`, error);
        throw error;
    }
};

// Get report statistics
export const getReportStats = async () => {
    try {
        const response = await fetch(`${API_URL}api/reports/stats/count`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching report stats:', error);
        return { total: 0, pending: 0, resolved: 0 };
    }
};
