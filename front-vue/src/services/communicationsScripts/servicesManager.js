const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetch all services status
 */
export const getAllServices = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services`);

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

/**
 * Get status of a single service
 */
export const getServiceStatus = async (serviceName) => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/${serviceName}`);

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

/**
 * Start a specific service
 */
export const startService = async (serviceName) => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/${serviceName}/start`, {
            method: 'POST',
        });

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

/**
 * Stop a specific service
 */
export const stopService = async (serviceName) => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/${serviceName}/stop`, {
            method: 'POST',
        });

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

/**
 * Start all services
 */
export const startAllServices = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/start-all`, {
            method: 'POST',
        });

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

/**
 * Stop all services
 */
export const stopAllServices = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services/stop-all`, {
            method: 'POST',
        });

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

/**
 * Create a new service
 */
export const createService = async (serviceData) => {
    try {
        const response = await fetch(`${BACKEND_URL}api/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serviceData)
        });

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