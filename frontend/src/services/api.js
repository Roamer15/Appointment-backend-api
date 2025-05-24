import { toast } from "react-toastify";

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
    credentials: 'include', // for cookie auth if used
  };

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    config.body = body;
  }

  try {
    const response = await fetch(url, config);

    // Check for token expiration
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      toast.error("Session expired. Please log in again.");
      window.location.href = '/login'; // Redirect to login
      return;
    }

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

  // services/api.js
export async function searchProviders(params) {
  const query = new URLSearchParams(params).toString();

  return fetch(`${API_BASE_URL}/search/providers?${query}`, {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
}

  
export default {
  // Auth
  register: (data) => fetchAPI('/auth/register', 'POST', data),
  login: (data) => fetchAPI('/auth/login', 'POST', data),
  resendVerificationEmail: (data) => fetchAPI('/verify-email', 'POST', data),
  completeProviderProfile: (data) => fetchAPI('/auth/register/provider', 'POST', data),

  //Timeslots
 createTimeSlot: (slotData) => fetchAPI('/timeslots/create', 'POST',slotData),
 getProviderSlots: () => fetchAPI('/timeslots/view'),
 deleteTimeSlot: (slotId) => fetchAPI(`/timeslots/delete/${slotId}`, 'DELETE'),
 updateTimeSlot: (slotData, slotId) => fetchAPI(`/timeslots/update/${slotId}`, 'PATCH', slotData),

 //appointments
 getProviderAppointments: () => fetchAPI(`/appointment/provider/view`),
 cancelAppointmentProvider: (appointmentId) => fetchAPI(`/appointment/provider/cancel/${appointmentId}`, 'PATCH'),
 getProviderById: (providerId) => fetchAPI(`/profile/providers/${providerId}`),
 getProviderTimeSlots: (providerId) => fetchAPI(`/search/providers/${providerId}/available-slots`),
 bookAppointment: (idData) => fetchAPI(`/appointment/booking`, 'POST', idData),
 getClientAppointments: () => fetchAPI(`/appointment/view`),
 getProviders: () => fetchAPI(`/search/providers`),
 cancelAppointment: (appointmentId) => fetchAPI(`/appointment/cancel/${appointmentId}`, 'PATCH'),
 rescheduleAppointment: (appointmentId, data) => fetchAPI(`/appointment/reschedule/${appointmentId}`, 'PATCH', data),

 //stats
 getProviderStats: () => fetchAPI(`/stats/`)

};