import { io } from 'socket.io-client';

const socket = io(import.meta.env.REACT_APP_API_URL, {
  autoConnect: false,
  withCredentials: true
});

export const connectSocket = (userId) => {
  socket.auth = { userId };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const onSocketEvent = (event, callback) => {
  socket.on(event, callback);
};

export const offSocketEvent = (event, callback) => {
  socket.off(event, callback);
};

export default socket;