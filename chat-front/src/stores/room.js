import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export const roomStore = writable({
	roomList: []
});

const setUserToRoom = (room, userName) => {
	if (!room.userList.includes(userName)) {
		room.userList.push(userName);
	}
};

const deleteUserFromRoom = (room, userName) => {
	if (room.userList.includes(userName)) {
		room.userList = room.userList.filter((name) => userName !== name);
	}
};

const findRoom = (roomList, roomName) => {
	for (const room of roomList) {
		if (roomName !== room.roomName) continue;
		return room;
	}
	throw new Error('not found');
};

export const createRoom = (roomName, username) => {
	const roomId = uuidv4();

	roomStore.update((state) => {
		try {
			findRoom(state.roomList, roomName);
		} catch (error) {
			state.roomList.push({
				roomId,
				roomName,
				userList: [username]
			});
		}
		return { ...state };
	});
};

export const enterRoom = (roomName, userName) => {
	roomStore.update((state) => {
		try {
			const room = findRoom(state.roomList, roomName);
			setUserToRoom(room, userName);
		} finally {
			return { ...state };
		}
	});
};

export const exitRoom = (roomName, userName) => {
	roomStore.update((state) => {
		try {
			const room = findRoom(state.roomList, roomName);
			deleteUserFromRoom(room, userName);
		} finally {
			return { ...state };
		}
	});
};

export const deleteRoom = (roomName) => {
	roomStore.update((state) => ({
		roomList: state.roomList.filter((room) => room.roomName !== roomName)
	}));
};
