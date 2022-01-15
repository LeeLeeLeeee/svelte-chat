import { writable } from "svelte/store";

export const userStore = writable({
    username: '',
})

export const setUserName = (name) => {
    if(name === '') {
        throw new Error('isBlank');
    }
    userStore.update((state) => ({ ...state, username: name }));
}