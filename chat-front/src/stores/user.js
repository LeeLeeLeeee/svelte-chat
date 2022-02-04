import { writable } from 'svelte/store';
import serverProxy from '$lib/server-proxy';

export const userStore = writable({
	username: '',
	userNameList: [],
});

export const createUserName = async (name) => {
	if (name === '') {
		throw new Error('isBlank');
	}
	await serverProxy.createUser(name);
	setUserName(name);
};

export const setUserName = (name) => {
	userStore.update((state) => ({ ...state, username: name }));
}

export const getNotAssignedUserNameList = async () => {
	try {
		const { data } = await serverProxy.getNotAssignedUserList();
		if (data.length > 0) {
			userStore.update((state) => ({...state, userNameList: data}));
		}
	} catch(error) {
		console.log(error);
	}
}
