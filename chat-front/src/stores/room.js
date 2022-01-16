import { writable } from 'svelte/store';

export const roomStore = writable({
	roomList: [{roomId: 'a', userList: ['a', 'b', 'c']}, {roomId: 'b', userList: ['a']}]
});


const setUserToRoom = (room, userName) => {
	if(!room.userList.includes(userName)) {
        room.userList.push(userName)
    }
};

const deleteUserFromRoom = (room, userName) => {
    if(room.userList.includes(userName)) {
        room.userList = room.userList.filter((name) => userName !== name);
    }
}

const findRoom = (roomList, roomId) => {
    for (const room of roomList) {
        if (roomId !== room.id) continue;
        return room;
    }
    throw new Error('not found');
}

export const createRoom = (roomId) => {
	roomStore.update((state) => ({
		roomList: [...state.roomList, { id: roomId, userList: [] }]
	}));
};

export const enterRoom = (roomId, userName) => {
	roomStore.update((state) => {
        try {
            const room = findRoom(state.roomList, roomId);
            setUserToRoom(room, userName);
        } finally {
            return { ...state };
        }
		
	});
};

export const exitRoom = (roomId, userName) => {
    roomStore.update((state) => {
        try {
            const room = findRoom(state.roomList, roomId);
            deleteUserFromRoom(room, userName);
        } finally {
            return { ...state };
        }
    })
};
