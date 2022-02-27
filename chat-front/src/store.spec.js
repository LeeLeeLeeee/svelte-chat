import { contextStore, setContextClose, setContextOpen, setContextTarget, setPosition, setContextProps } from '$stores/context';
import { messageStore, readRoomMessage, noticeRoomMessage } from '$stores/message'
import { roomStore, createRoom, enterRoom, getRoomList, getAbleParticipateRoomList, getParticipatedRoomList, getParticipatedClient } from '$stores/room';
import { socketStore, connectSocketClient, closeSocketClient } from '$stores/socket';
import { userStore, setUserName, createUserName } from '$stores/user';
import { toastStore, setDuraction, deleteToast, insertToast } from '$stores/toast';
import axios from 'axios';
import { get } from 'svelte/store';

jest.mock('axios');

describe("context store test", () => {

    beforeAll(() => {
        setContextTarget('testContext');
    })

    it("set context id", () => {
        const { target } = get(contextStore);
        expect(target).toEqual('testContext');
    })

    it("set context close, open", () => {
        setContextClose()
        const { isOpen: test1 } = get(contextStore);
        expect(test1).toBeFalsy();
        setContextOpen()
        const { isOpen: test2 } = get(contextStore);
        expect(test2).toBeTruthy();
    });

    it("set context position", () => {
        setPosition({ x: 10, y: 10 })
        const { x, y } = get(contextStore);
        expect(x).toBe(10);
        expect(y).toBe(10);
    });

    it("set context props", () => {
        setContextProps({ test: true })
        const { props } = get(contextStore);
        expect(props.test).toBeTruthy();
    });

});

describe("message store test", () => {

    it("set notice for room", () => {
        noticeRoomMessage('testRoom');
        const { testRoom } = get(messageStore);
        expect(testRoom).toBeTruthy();
    })

    it("read the testRoom notice", () => {
        readRoomMessage('testRoom')
        const { testRoom } = get(messageStore);
        expect(testRoom).toBeFalsy();
    })
})

describe("room store test", () => {
    const roomName = 'TEST_ROOM';
    const roomID = '1';
    const userName = 'YHLEE';
    beforeEach(() => {
        const getResponse = { status: 200, data: { data: [
            { id: roomID, name: roomName, countParticipant: 0 },
        ] }};
        axios.get.mockResolvedValue(getResponse);
        const postResponse = { status: 201, data: { data: [] }};
        axios.post.mockResolvedValue(postResponse);
        const patchResponse = { status: 200, data: { data: [] }};
        axios.patch.mockResolvedValue(patchResponse);
    })

    it("create room", () => {
        createRoom(roomID, roomName);
    })

    it("enter room", () => {
        enterRoom(roomID, userName);
    })

    it("get roomList", async () => {
        await getRoomList();
        const { roomList } = get(roomStore);
        const [room] = roomList;
        expect(room.roomId).toEqual(roomID);
        expect(room.roomName).toEqual(roomName);
        expect(room.userCount).toEqual(0);
    })

    it("get roomList to be able to particpate", async () => {
        await getAbleParticipateRoomList(userName);
        const { roomList } = get(roomStore);
        const [room] = roomList;
        expect(room.roomId).toEqual(roomID);
        expect(room.roomName).toEqual(roomName);
        expect(room.userCount).toEqual(0);
    })

    it("get roomList to participated in", async() => {
        await getParticipatedRoomList(userName);
        const { enteredRoomList } = get(roomStore);
        const [room] = enteredRoomList;
        expect(room.roomId).toEqual(roomID);
        expect(room.roomName).toEqual(roomName);
        expect(room.userCount).toEqual(0);
    })

    it("get participants who participated in the room", async () => {
        axios.get.mockResolvedValue({ status: 200, data: { data: [
            userName,
        ] } });
        await getParticipatedClient(roomID);
        const { participants } = get(roomStore);
        const [user] = participants;
        expect(user).toEqual(userName);
    })

})

describe("socket store test", () => {
    const userName = 'YHLEE';
    beforeAll(async () => {
        window.WebSocket = function WebSocket(url) {
            this.url = url;
            this.send = () => 'need connect mock';
            this.close = () => 'need connect mock';
            return this;
        }

        const response = { status: 201, data: { data: '' }};
        axios.post.mockResolvedValue(response);
        await createUserName(userName);
    })

    it("connect socket client", async () => {
        await connectSocketClient();
        const { socketClient } = get(socketStore);
        expect(socketClient).not.toBeNull();
    })

    it("close socket client", async () => {
        await closeSocketClient();
        const { socketClient } = get(socketStore);
        expect(socketClient).toBeNull();
    })
})

describe("toast store test", () => {
    it("set toast duraction", () => {
        setDuraction(3);
        const { duraction } = get(toastStore);
        expect(duraction).toEqual(3)
    })

    it("insert doesn't match type toast", () => {
        insertToast(undefined, 'test');
        const { toastList } = get(toastStore);
        expect(toastList.length).toEqual(0);
    })

    it("insert toast", () => {
        insertToast('success', 'test');
        const { toastList } = get(toastStore);
        const [ toast ] = toastList;
        expect(toast.index).toEqual(2);
        expect(toast.type).toEqual('success');
        expect(toast.message).toEqual('test');
    })

    it("delete toast", () => {
        deleteToast(2);
        const { toastList } = get(toastStore);
        expect(toastList.length).toEqual(0);
    })
});
