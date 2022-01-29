import { writable } from 'svelte/store';
import serverProxy from '$lib/server-proxy';

export const userStore = writable({
	username: ''
});

export const setUserName = async (name) => {
	try {
		if (name === '') {
			throw new Error('isBlank');
		}
		await serverProxy.createUser(name)
		userStore.update((state) => ({ ...state, username: name }));
	} catch(error) {
		throw new Error(error)
	}
};
