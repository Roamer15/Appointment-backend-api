// context/NotificationContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

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
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const notificationsRes = await api.getUnreadNotifications();
        console.log(notificationsRes.unreadNotifications);
        setNotifications(notificationsRes.unreadNotifications || []);
        setUnreadCount((notificationsRes.unreadNotifications || []).length);
        console.log(unreadCount)
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const newSocket = io("http://localhost:5001", {
      path: "/socket.io",
      withCredentials: true,
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token,
        userId: getUserIdFromToken(token),
        providerId: getProviderIdFromToken(token),
      },
    });

    // Debugging listeners
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for appointment events
    socket.on("new_appointment", (data) => {
      console.log(data);
      const notification = {
        id: Date.now(),
        type: "new",
        title: "New Appointment",
        message: data.message,
        time: new Date().toLocaleTimeString(),
        read: false,
      };
      addNotification(notification);
    });

    socket.on("appointment_canceled", (data) => {
      const notification = {
        id: Date.now(),
        type: "canceled",
        title:
          data.by === "provider"
            ? "Appointment Canceled"
            : "Appointment Canceled by Client",
        message: data.message,
        time: new Date().toLocaleTimeString(),
        read: false,
      };
      addNotification(notification);
    });

    socket.on("appointment_rescheduled", (data) => {
      const notification = {
        id: Date.now(),
        type: "rescheduled",
        title:
          data.by === "provider"
            ? "Appointment rescheduled"
            : "Appointment rescheduled by Client",
        message: "An appointment has been rescheduled",
        time: new Date().toLocaleTimeString(),
        read: false,
      };
      addNotification(notification);
    });

    return () => {
      socket.off("new_appointment");
      socket.off("appointment_canceled");
      socket.off("appointment_rescheduled");
    };
  }, [socket]);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      const res = await api.updateNotificationToRead(id);
      console.log(res);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      const res = await api.markAllAsRead();
      console.log(res);
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
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
