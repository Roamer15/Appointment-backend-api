const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

async function fetchAPI(endpoint, method = 'GET', body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    // credentials: 'include', // For cookies if needed
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export default {
  // Auth
  register: (data) => fetchAPI('/auth/register', 'POST', data),
  login: (data) => fetchAPI('/auth/login', 'POST', data),
  resendVerificationEmail: (data) => fetchAPI('/verify-email', 'POST', data),
};