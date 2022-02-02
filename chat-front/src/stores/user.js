import { writable } from 'svelte/store';
import serverProxy from '$lib/server-proxy';

export const userStore = writable({
	username: '',
	userNameList: [],
});

export const createUserName = async (name) => {
	try {
		if (name === '') {
			throw new Error('isBlank');
		}
		await serverProxy.createUser(name);
		setUserName(name);
	} catch(error) {
		console.log(error);
	}
};

export const setUserName = (name) => {
	userStore.update((state) => ({ ...state, username: name }));
}

export const getUserNameList = async () => {
	try {
		const { data } = await serverProxy.getUserList();
		if (data.length > 0) {
			userStore.update((state) => ({...state, userNameList: data}));
		}
	} catch(error) {
		console.log(error);
	}
}
