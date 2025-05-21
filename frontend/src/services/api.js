
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

async function fetchAPI(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
  
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const config = {
      method,
      headers,
    };
  
    if (body && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
      config.body = body;
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
  completeProviderProfile: (data) => fetchAPI('/auth/register/provider', 'POST', data),

  //Timeslots
  // Create slot
 createTimeSlot: (slotData) => fetchAPI('/timeslots/create', 'POST',slotData),

// Get all provider time slots
 getProviderSlots: () => fetchAPI('/timeslots/view'),

// Delete slot
 deleteTimeSlot: (slotId) => fetchAPI(`/timeslots/delete/${slotId}`, 'DELETE'),

 updateTimeSlot: (slotData, slotId) => fetchAPI(`/timeslots/update/${slotId}`, 'PATCH', slotData),

 // View provider appointments
 getProviderAppointments: () => fetchAPI(`/appointment/provider/view`),

 cancelAppointmentProvider: (appointmentId) => fetchAPI(`/appointment/provider/cancel/${appointmentId}`, 'PATCH')

};