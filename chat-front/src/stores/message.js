import { writable } from "svelte/store";

export const messageStore = writable({});

export const readRoomMessage = (roomId) => {
    messageStore.update((state) => ({...state, [roomId]: false}))
}

export const noticeRoomMessage = (roomId) => {
    messageStore.update((state) => ({...state, [roomId]: true}))
}