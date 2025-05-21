const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function handle401(response) {
    if (response.status === 401) {
        window.location.href = '/';
        return true;
    }
    return false;
}

export const getAllServices = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};

export const getServiceStatus = async (serviceName) => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/${serviceName}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching service ${serviceName}:`, error);
        throw error;
    }
};

export const startService = async (serviceName) => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/${serviceName}/start`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error starting service ${serviceName}:`, error);
        throw error;
    }
};

export const stopService = async (serviceName) => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/${serviceName}/stop`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error stopping service ${serviceName}:`, error);
        throw error;
    }
};

export const startAllServices = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/start-all`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error starting all services:', error);
        throw error;
    }
};

export const stopAllServices = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/stop-all`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error stopping all services:', error);
        throw error;
    }
};

export const createService = async (serviceData) => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(serviceData)
        });

        if (handle401(response)) return;
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating service:', error);
        throw error;
    }
};

export const uploadServiceFile = async (formData) => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: formData,
        });

        if (handle401(response)) return;
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error uploading service file:', error);
        throw error;
    }
};

export const deleteService = async (serviceName) => {
    try {
        console.log('Deleting service:', localStorage.getItem('accessToken'));
        const response = await fetch(`${BACKEND_URL}api/services/${serviceName}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error deleting service ${serviceName}:`, error);
        throw error;
    }
};