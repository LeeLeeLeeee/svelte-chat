import axios from 'axios';
class ServerProxy {
    constructor() {
        axios.defaults.baseURL = "/api";
        axios.defaults.headers.common['Content-Type'] = 'application/json'
    }

    async createRoom(roomName) {
        try {
            await axios.get(`/create?roomName=${roomName}`);
        } catch(error) {
            console.log(error);
        }
    }

    async getRoomList() {
        try {
            const roomLIst = await axios.get('/room');
            console.log(roomLIst);
        } catch(error) {
            console.log(error);
        }
    }
}

const serverProxy = new ServerProxy();
export default serverProxy;