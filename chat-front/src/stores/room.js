import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import serverProxy from '$lib/server-proxy';

export const roomStore = writable({
	roomList: [],
	participants: [],
	enteredRoomList: []
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

export const createRoom = async (roomName) => {
	const roomId = uuidv4();
	try {
		await serverProxy.createRoom(roomId, roomName);
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

export const leaveRoom = (roomName, userName) => {
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

export const getAbleParticipateRoomList = async (username) => {
	try {
		const { data } = await serverProxy.getRoomList({ ableParticipate: true, username });
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

export const getParticipatedRoomList = async (username) => {
	try {
		const { data } = await serverProxy.getRoomList({ ableParticipate: false, username });
		if (data !== null) {
			roomStore.update((state) => ({
				...state,
				enteredRoomList: data.map((room) => ({ roomId: room.id, roomName: room.name, userCount: room.countParticipant }))
			}))
		}
	} catch (error) {
		console.log(error)
	}
}

export const getParticipatedClient = async (roomId) => {
	try {
		const { data } = await serverProxy.getParticipatedClient(roomId);
		roomStore.update((state) => ({...state, participants: data}));
	} catch (error) {
		console.log(error)
		return [];
	}
	
}
