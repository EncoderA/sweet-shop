import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const createApiInstance = (token = null) => {
  const api = axios.create({
    baseURL: `${API_BASE_URL}/api/sweets`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};

// Get all sweets
export const getAllSweets = async (token = null) => {
  try {
    const api = createApiInstance(token);
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching sweets:', error);
    throw error;
  }
};

// Search sweets
export const searchSweets = async (filters = {}, token = null) => {
  try {
    const api = createApiInstance(token);
    const params = new URLSearchParams();
    
    if (filters.name) {
      params.append('name', filters.name);
    }
    
    if (filters.category && filters.category.length > 0) {
      // If multiple categories, we'll need to handle this differently
      // For now, let's join them or handle the first one
      params.append('category', filters.category.join(','));
    }
    
    if (filters.minPrice) {
      params.append('minPrice', filters.minPrice.toString());
    }
    
    if (filters.maxPrice) {
      params.append('maxPrice', filters.maxPrice.toString());
    }

    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error searching sweets:', error);
    throw error;
  }
};

// Create new sweet (admin only)
export const createSweet = async (sweetData, token = null) => {
  try {
    const api = createApiInstance(token);
    const response = await api.post('/', sweetData);
    return response.data;
  } catch (error) {
    console.error('Error creating sweet:', error);
    throw error;
  }
};

// Update sweet (admin only)
export const updateSweet = async (id, sweetData, token = null) => {
  try {
    const api = createApiInstance(token);
    const response = await api.put(`/${id}`, sweetData);
    return response.data;
  } catch (error) {
    console.error('Error updating sweet:', error);
    throw error;
  }
};

// Delete sweet (admin only)
export const deleteSweet = async (id, token = null) => {
  try {
    const api = createApiInstance(token);
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sweet:', error);
    throw error;
  }
};

// Purchase sweet
export const purchaseSweet = async (id, purchaseData, token = null) => {
  try {
    const api = createApiInstance(token);
    const response = await api.post(`/${id}/purchase`, purchaseData);
    return response.data;
  } catch (error) {
    console.error('Error purchasing sweet:', error);
    throw error;
  }
};

// Bulk purchase sweets
export const purchaseBulkSweets = async (purchaseData, token = null) => {
  try {
    const api = createApiInstance(token);
    const response = await api.post('/purchase/bulk', purchaseData);
    return response.data;
  } catch (error) {
    console.error('Error purchasing bulk sweets:', error);
    throw error;
  }
};

// Restock sweet (admin only)
export const restockSweet = async (id, restockData, token = null) => {
  try {
    const api = createApiInstance(token);
    const response = await api.post(`/${id}/restock`, restockData);
    return response.data;
  } catch (error) {
    console.error('Error restocking sweet:', error);
    throw error;
  }
};

// Upload image
export const uploadImage = async (formData, token = null) => {
  try {
    const api = axios.create({
      baseURL: `${API_BASE_URL}/api/upload`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }

    const response = await api.post('/single', formData);
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get all user orders (Admin only)
export const getAllUserOrders = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sweets/orders/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch orders')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching all orders:', error)
    throw error
  }
}

// Get user order history
export const getUserOrderHistory = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sweets/orders/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch user orders')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching user orders:', error)
    throw error
  }
}

// Get user purchases (legacy endpoint)
const getUserPurchases = async (userId, token = null) => {
  try {
    const api = createApiInstance(token);
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    throw error;
  }
}

// Consolidated API object
export const sweetApi = {
  getAllSweets,
  searchSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  purchaseBulkSweets,
  restockSweet,
  uploadImage,
  getUserPurchases,
  getAllUserOrders,
  getUserOrderHistory
}