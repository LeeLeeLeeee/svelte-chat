import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import serverProxy from '$lib/server-proxy';
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

export const createRoom = async (roomName, username) => {
	const roomId = uuidv4();
	try {
		const { data: { id, name } } = await serverProxy.createRoom(roomId, roomName);
		roomStore.update((state) => {
			state.roomList.push({
				roomId: id,
				roomName: name,
				userList: [username]
			})
			return { ...state };
		})
	} catch (error) {
		throw new Error(error)
	}

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

export const getRoomList = async () => {
	try {
		const { data } = await serverProxy.getRoomList();
		if (data !== null) {
			roomStore.update((state) => ({
				...state,
				roomList: data.map((room) => ({ roomId: room.id, roomName: room.name, userList: [] }))
			}))
		}
	} catch (error) {
		console.log(error)
	}
}
