import { writable } from 'svelte/store';

export const socketStore = writable({ socketClient: null });

export const setSocketClient = (sc) => {
    if (sc === null) {
        throw new Error('isBlank');
    }
    socketStore.update((_) => ({ socketClient: sc }))
};

export const deleteSocketClient = (sc) => {
    sc.close();
    socketStore.update((_) => ({ socketClient: '' }));
};