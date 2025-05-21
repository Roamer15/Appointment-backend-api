// context/NotificationContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {jwtDecode} from 'jwt-decode'

const NotificationContext = createContext();

// utils/auth.js
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded?.userId || decoded?.id;
  } catch {
    return null;
  }
};
const getProviderIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded?.providerId;
  } catch {
    return null;
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const newSocket = io('http://localhost:5001', {
    path: '/socket.io',
    withCredentials: true,
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    auth: {
      token,
      userId: getUserIdFromToken(token), // Add this
      providerId: getProviderIdFromToken(token) // Add this
    }
  });

  // Debugging listeners
  newSocket.on('connect', () => {
    console.log('Socket connected:', newSocket.id);
  });

  newSocket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
  });

  setSocket(newSocket);

  return () => {
    newSocket.off('connect');
    newSocket.off('connect_error');
    newSocket.disconnect();
  };
}, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for appointment events
    socket.on('new_appointment', (data) => {
        console.log(data)
      const notification = {
        id: Date.now(),
        type: 'new',
        title: 'New Appointment',
        message: data.message,
        time: new Date().toLocaleTimeString(),
        read: false,
      };
      addNotification(notification);
    });

    socket.on('appointment_canceled', (data) => {
      const notification = {
        id: Date.now(),
        type: 'canceled',
        title: data.by === 'provider' 
          ? 'Appointment Canceled' 
          : 'Appointment Canceled by Client',
        message: data.message,
        time: new Date().toLocaleTimeString(),
        read: false,
      };
      addNotification(notification);
    });

    socket.on('appointment_rescheduled', (data) => {
      const notification = {
        id: Date.now(),
        type: 'rescheduled',
        title: data.by === 'provider' 
          ? 'Appointment rescheduled' 
          : 'Appointment rescheduled by Client',
        message: 'An appointment has been rescheduled',
        time: new Date().toLocaleTimeString(),
        read: false,
      };
      addNotification(notification);
    });

    return () => {
      socket.off('new_appointment');
      socket.off('appointment_canceled');
      socket.off('appointment_rescheduled');
    };
  }, [socket]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);