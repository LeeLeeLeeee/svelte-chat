import axios from 'axios';
class ServerProxy {
    constructor() {
        axios.defaults.baseURL = "/api";
        axios.defaults.headers.common['Content-Type'] = 'application/json'
    }

    async createRoom(roomId, roomName) {
        try {
            const { status, data } = await axios.post(`/room/create`, {
                id: roomId,
                name: roomName
            });
            if (status != 201) {
                throw new Error(data.msg)
            }
            return data;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getRoomList() {
        try {
            const { status, data } = await axios.get('/room');
            if (status !== 200) {
                throw new Error(data.msg)
            } 
            return data
        } catch (error) {
            throw new Error(error);
        }
    }

    async coonectRoom(roomName, userName) {
        try {
            const { status, data } = await axios.get(`/room/connect?roomName=${roomName}&userName=${userName}`);
            if (status !== 200) {
                throw new Error(error);
            }
            return data;    
        } catch(error) {
            throw new Error(error)
        }
    }

    async createUser(name) {
        try {
            const { status, data } = await axios.post(`/user/create`, { name });
            if (status != 201) {
                throw new Error(data.msg)
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async getUserList() {
        try {
            const { status, data } = await axios.get('/user');
            if (status !== 200) {
                throw new Error(data.msg)
            }
            return data;
        } catch (error) {
            throw new Error(error)
        }
    }
}

const serverProxy = new ServerProxy();
export default serverProxy;