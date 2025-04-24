const API_URL = import.meta.env.VITE_INCIDENT_URL;

// Helper function to handle fetch responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la solicitud');
    }
    return response.json();
};

// Get all reports
export const getAllReports = async () => {
    try {
        const response = await fetch(`${API_URL}api/reports`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
};

// Get a single report by ID
export const getReportById = async (id) => {
    try {
        const response = await fetch(`${API_URL}api/reports/${id}`);
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
            body: reportData,
        });
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
            },
            body: JSON.stringify(reportData),
        });
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
        });
        await handleResponse(response);
        return true;
    } catch (error) {
        console.error(`Error deleting report ${id}:`, error);
        throw error;
    }
};

// Get reports by user ID
export const getReportsByUserId = async (userId) => {
    try {
        const response = await fetch(`${API_URL}api/reports/user/${userId}`);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching reports for user ${userId}:`, error);
        throw error;
    }
};

// Get reports by room ID
export const getReportsByRoomId = async (roomId) => {
    try {
        const response = await fetch(`${API_URL}api/reports/room/${roomId}`);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching reports for room ${roomId}:`, error);
        throw error;
    }
};

// Get finished reports
export const getFinishedReports = async () => {
    try {
        const response = await fetch(`${API_URL}api/reports/finished`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching finished reports:', error);
        throw error;
    }
};

// Get not finished reports
export const getNotFinishedReports = async () => {
    try {
        const response = await fetch(`${API_URL}api/reports/not-finished`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching not finished reports:', error);
        throw error;
    }
};