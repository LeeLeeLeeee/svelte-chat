import { SocketClient, SocketManager } from '$lib/socket';
import { writable } from 'svelte/store';

export const socketStore = writable({ socketClient: null, socketManager: null });

const closeSocket = (socket) => {
    if( socket !== null ) {
        socket.close();
        return true;
    }
    return false;
}

export const setSocketClient = (name) => {
    socketStore.update((state) => {
        closeSocket(state.socketClient)
        const sc = new SocketClient(name);
        return { ...state, socketClient: sc }
    })
};

export const closeSocketClient = () => {
    socketStore.update((state) => {
        if( closeSocket(state.socketClient) ) {
            return { ...state, socketClient: null }
        }
        return { ...state }
    });
};