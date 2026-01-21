const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if response is JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || 'Server error occurred');
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:5000');
    }
    
    // Re-throw with better message
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (email, password, userType) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, userType }),
  }),

  getCurrentUser: () => apiCall('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => apiCall('/user/profile'),
  
  updateProfile: (profileData) => apiCall('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  updateLocation: (locationData) => apiCall('/user/location', {
    method: 'PUT',
    body: JSON.stringify(locationData),
  }),
};

// Services API
export const servicesAPI = {
  getServices: (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    const queryString = queryParams.toString();
    return apiCall(`/services${queryString ? `?${queryString}` : ''}`);
  },

  getServiceById: (id) => apiCall(`/services/${id}`),

  getCategories: () => apiCall('/services/categories/list'),

  checkAvailability: (id, date, time) => {
    const queryParams = new URLSearchParams({ date, time });
    return apiCall(`/services/${id}/availability?${queryParams.toString()}`);
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: (bookingData) => apiCall('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  getMyBookings: (status) => {
    const query = status ? `?status=${status}` : '';
    return apiCall(`/bookings/my-bookings${query}`);
  },

  getBookingById: (id) => apiCall(`/bookings/${id}`),

  updateBookingStatus: (id, status) => apiCall(`/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

// Provider API
export const providerAPI = {
  // Services
  getMyServices: () => apiCall('/provider/services'),

  createService: (serviceData) => apiCall('/provider/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  }),

  updateService: (id, serviceData) => apiCall(`/provider/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  }),

  deleteService: (id) => apiCall(`/provider/services/${id}`, {
    method: 'DELETE',
  }),

  // Bookings
  getMyBookings: (status) => {
    const query = status ? `?status=${status}` : '';
    return apiCall(`/provider/bookings${query}`);
  },

  updateBookingStatus: (id, status) => apiCall(`/provider/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),

  // Stats
  getStats: () => apiCall('/provider/stats'),
};
