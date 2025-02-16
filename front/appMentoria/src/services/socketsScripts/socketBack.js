import io from 'socket.io-client';

const BACK_URL = import.meta.env.VITE_URL_BACK;

const socketBack = io(BACK_URL);

export default socketBack;