import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import serverProxy from '$lib/server-proxy';

export const roomStore = writable({
	roomList: []
});


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
	return false;
};

export const createRoom = async (roomName, username) => {
	const roomId = uuidv4();
	try {
		const { data: { id, name } } = await serverProxy.createRoom(roomId, roomName);
		roomStore.update((state) => {
			state.roomList.push({
				roomId: id,
				roomName: name,
				userCount: 0
			})
			return { ...state };
		})
	} catch (error) {
		throw new Error(error)
	}

};

export const enterRoom = async (roomId, userName) => {
	try {
		 await serverProxy.connectRoom(roomId, userName);
	} catch(error) {
		throw new Error(error)
	}
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
				roomList: data.map((room) => ({ roomId: room.id, roomName: room.name, userCount: room.countParticipant }))
			}))
		}
	} catch (error) {
		console.log(error)
	}
}

export const getParticipatedClient = async (roomId) => {
	try {
		const { data } = await serverProxy.getParticipatedClient(roomId);
		return data;
	} catch (error) {
		console.log(error)
		return [];
	}
	
}
