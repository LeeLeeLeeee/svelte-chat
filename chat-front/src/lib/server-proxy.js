import axios from 'axios';
class ServerProxy {
    constructor() {
        axios.defaults.baseURL = "/api";
        axios.defaults.headers.common['Content-Type'] = 'application/json'
    }

    objectToParams(object) {
        if (typeof object !== 'object') return ''
        console.log(object);
        return Object.keys(object).reduce((pv, key, ci) => `${pv}${ci === 0 ? '?' : '&'}${key}=${object[key]}`,'');
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

    async getRoomList(query) {
        try {
            const { status, data } = await axios.get(`/room${this.objectToParams(query)}`);
            if (status !== 200) {
                throw new Error(data.msg)
            } 
            return data
        } catch (error) {
            throw new Error(error);
        }
    }

    async connectRoom(roomId, userName) {
        try {
            const { status, data } = await axios.get(`/room/connect?roomId=${roomId}&userName=${userName}`);
            if (status !== 200) {
                throw new Error(data.msg);
            }
            return data;    
        } catch(error) {
            throw new Error(error)
        }
    }

    async exitRoom(userName) {
        try {
            const { status, data } = await axios.post(`/user/exit`, {
                name: userName
            })
            if (status != 200) {
                throw new Error(data.msg)
            }
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

    async getNotAssignedUserList() {
        try {
            const { status, data } = await axios.get('/user?notAssigned=true');
            if (status !== 200) {
                throw new Error(data.msg)
            }
            return data;
        } catch (error) {
            throw new Error(error)
        }
    }

    async getParticipatedClient(roomId) {
        try {
            const { status, data } = await axios.get(`/user?roomId=${roomId}`);
            if (status !== 200) {
                throw new Error(data.msg)
            }
            return data;
        } catch (error) {
            throw new Error(error);
        }
    }
}

const serverProxy = new ServerProxy();
export default serverProxy;