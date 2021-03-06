import axios from 'axios';
class ServerProxy {
    constructor() {
        axios.defaults.baseURL = "/api";
        axios.defaults.headers.common['Content-Type'] = 'application/json'
    }

    objectToParams(object) {
        if (typeof object !== 'object') return ''
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
            throw new Error(error.message);
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
            throw new Error(error.message);
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
            throw new Error(error.message)
        }
    }

    async leaveRoom(userName, roomId) {
        try {
            const { status, data } = await axios.patch(`/user/leave`, {
                name: userName,
                roomId: roomId,
            })
            if (status != 200) {
                throw new Error(data.msg)
            }
        } catch(error) {
            throw new Error(error.message)
        }
    }

    async exitRoom(userName, roomId) {
        try {
            const { status, data } = await axios.patch(`/user/exit`, {
                name: userName,
                roomId: roomId,
            })
            if (status !== 200) {
                throw new Error(data.msg);
            }
        } catch(error) {
            throw new Error(error.message);
        }
    }

    async createUser(name) {
        try {
            const { status, data } = await axios.post(`/user/create`, { name });
            if (status != 201) {
                throw new Error(data.msg)
            }
        } catch (error) {
            throw new Error(error.message)
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
            throw new Error(error.message)
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
            throw new Error(error.message);
        }
    }
}

const serverProxy = new ServerProxy();
export default serverProxy;