const BACK_URL = import.meta.env.VITE_CANTEEN_URL;

function handle401(response) {
    if (response.status === 401) {
        window.location.href = '/';
        return true;
    }
    return false;
}

export const getAllCanteenItems = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/canteen`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

export const getCanteenItemById = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}api/canteen/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

export const createItem = async (canteenItem) => {
    try {
        const response = await fetch(`${BACK_URL}api/canteen`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(canteenItem),
        });
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating course:', error);
    }
}

export const updateItem = async (canteenItem) => {
    try {
        const response = await fetch(`${BACK_URL}api/canteen/${canteenItem.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(canteenItem),
        });
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating course:', error);
    }
}

export const deleteItem = async (id) => {
    try {
        const response = await fetch(`${BACK_URL}api/canteen/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting course:', error);
    }
}

export const getAllEnabledCanteenItems = async () => {
    try {
        const response = await fetch(`${BACK_URL}api/canteen/allItems/enabled`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (handle401(response)) return;
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}