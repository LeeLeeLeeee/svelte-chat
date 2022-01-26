import { writable } from 'svelte/store';

export const userStore = writable({
	username: `이영현-${Math.floor(Math.random() * 100)}`
});

export const setUserName = (name) => {
	if (name === '') {
		throw new Error('isBlank');
	}
	userStore.update((state) => ({ ...state, username: name }));
};
