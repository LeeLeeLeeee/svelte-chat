import SocketClient from '$lib/socket';
import { get, writable } from 'svelte/store';
import { userStore } from './user';

export const socketStore = writable({ socketClient: null });

const closeSocket = (socket) => {
    if( socket !== null ) {
        socket.close();
        return true;
    }
    return false;
}

export const connectSocketClient = () => {
    const { socketClient } = get(socketStore);
    const { username } = get(userStore);
    if (username !== "") {
        socketStore.update((state) => {
            closeSocket(socketClient)
            const sc = new SocketClient(username);
            return { ...state, socketClient: sc }
        })    
    }
}

export const closeSocketClient = () => {
    socketStore.update((state) => {
        if( closeSocket(state.socketClient) ) {
            return { ...state, socketClient: null }
        }
        return { ...state }
    });
};