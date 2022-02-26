import { url } from '$app/stores';
import axios from 'axios';
import serverProxy from './lib/server-proxy';
import SocketClient from './lib/socket';

jest.mock('axios');

describe("case REST API SUCCESS TEST", () => {
    const userName = 'YHLEE'
    const roomID = 0
    const query = {}

    beforeAll(() => {
        const getResponse = { status: 200, data: { data: [] }};
        axios.get.mockResolvedValue(getResponse);
        const postResponse = { status: 201, data: { data: [] }};
        axios.post.mockResolvedValue(postResponse);
        const patchResponse = { status: 200, data: { data: [] }};
        axios.patch.mockResolvedValue(patchResponse);
    })

    test("connect room test", () => {
        serverProxy.connectRoom(roomID, userName);
    });

    test("create room test", async () => {
        serverProxy.createRoom(roomID, userName);
    });

    test("get room list test", async () => {
        serverProxy.getRoomList(query);
    });

    test("leave room test", async () => {
        serverProxy.leaveRoom(userName, roomID);
    })

    it("exit room test", async () => {
        serverProxy.exitRoom(userName, roomID);
    })

    it("create user test", async () => {
        serverProxy.createUser(userName);
    })

    it("get user to have been assigned to room", async () => {
        serverProxy.getNotAssignedUserList();
    })

    it("get user to have been participated in the room", async () => {
            serverProxy.getParticipatedClient();
    })
});

describe("case REST API FAIL TEST", () => {
    const userName = 'YHLEE'
    const roomID = 0
    const query = {}
    const getError = new Error('get error');
    const postError = new Error('post error');
    const patchError = new Error('patch error');
    beforeAll(() => {
        const getResponse = { status: 500, data: { data: [], msg: 'get error' }};
        axios.get.mockResolvedValue(getResponse);
        const postResponse = { status: 500, data: { data: [], msg: 'post error' }};
        axios.post.mockResolvedValue(postResponse);
        const patchResponse = { status: 500, data: { data: [], msg: 'patch error' }};
        axios.patch.mockResolvedValue(patchResponse);
    })

    test("connect room test", async () => {
        await expect(() => serverProxy.connectRoom(roomID, userName)).rejects.toThrow()
    });

    test("create room test", async () => {
        try {
            await serverProxy.createRoom(roomID, userName);
        } catch(error) {
            expect(error).toEqual(postError)
        }
    });

    test("get room list test", async () => {
        try {
            await serverProxy.getRoomList(query);
        } catch(error) {
            expect(error).toEqual(getError)
        }
    });

    test("leave room test", async () => {
        try {
            await serverProxy.leaveRoom(userName, roomID);
        } catch(error) {
            expect(error).toEqual(patchError)
        }
    })

    it("exit room test", async () => {
        try {
            await  serverProxy.exitRoom(userName, roomID);
        } catch(error) {
            expect(error).toEqual(patchError)
        }
    })

    it("create user test", async () => {
        try {
            await serverProxy.createUser(userName);
        } catch(error) {
            expect(error).toEqual(postError)
        }
    })

    it("get user to have been assigned to room", async () => {
        try {
            await serverProxy.getNotAssignedUserList();
        } catch(error) {
            expect(error).toEqual(getError)
        }
    })

    it("get user to have been participated in the room", async () => {
        try {
            await serverProxy.getParticipatedClient();
        } catch(error) {
            expect(error).toEqual(getError)
        }
    })
});


describe("ServerProxy method Test", () => {
    it("objectToParams method", () => {
        expect(serverProxy.objectToParams({a: 'b', c: 'd'})).toEqual("?a=b&c=d");
    })
})

describe("Socket Instance Test", () => {
    const userName = 'YHLEE';
    beforeAll(() => {
        window.WebSocket = function WebSocket(url) {
            this.url = url;
            this.send = () => 'need connect mock';
            this.close = () => 'need connect mock';
            return this;
        }
    })

    it("websocket create test", () => {
        const yhleeSocket = new SocketClient(userName);
        expect(yhleeSocket.socket.url).toEqual(`ws://localhost:3001/ws/client?name=${userName}`);
    })

    it("websocket onListenHandler test", () => {
        const yhleeSocket = new SocketClient(userName);
        const mockListenHandler = jest.fn();
        yhleeSocket.onListenHandler(mockListenHandler);
        yhleeSocket.socket.onmessage();
        expect(mockListenHandler).toBeCalledTimes(1);
    })

    it("websocket send test", () => {
        const yhleeSocket = new SocketClient(userName);
        const mockFunction = jest.fn();
        yhleeSocket.socket.send = mockFunction;
        yhleeSocket.sendMessage('');
        expect(mockFunction).toBeCalledTimes(1);
    })

    it("websocket close test", () => {
        const yhleeSocket = new SocketClient(userName);
        const mockFunction = jest.fn();
        yhleeSocket.socket.close = mockFunction;
        yhleeSocket.close();
        expect(mockFunction).toBeCalledTimes(1);
    })

})