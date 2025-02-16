import io from 'socket.io-client';

const CHAT_URL = import.meta.env.VITE_URL_BACK_CHAT;

const socketChat = io(CHAT_URL);

export default socketChat;