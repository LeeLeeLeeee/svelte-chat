import axios from 'axios';
class ServerProxy {
    constructor() {
        axios.defaults.baseURL = "/api/v1";
        axios.defaults.headers.common['Content-Type'] = 'application/json'
    }

    async connectRoom(name, roomName) {
        try {
            const data = await axios.post('/connect', { name, roomName })
        } catch(error) {
            console.log(error);
        }
    }
}

const serverProxy = new ServerProxy();
export default serverProxy;