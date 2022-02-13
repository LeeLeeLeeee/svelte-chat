import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import serverProxy from '$lib/server-proxy';

export const roomStore = writable({
	roomList: [],
	participants: [],
	enteredRoomList: []
});

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
