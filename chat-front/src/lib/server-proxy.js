import { io } from 'socket.io-client';

class SocketClient {
    constructor(name, room) {
        const URL = `http://192.168.4.73:19123/${room}`
        this.socket = io(URL, { authConnect: false});
        this.socket.onAny((event, ...args) => {
            console.log(event, args);
        })
        this.socket.auth = name;
    }

    connect() {
        this.socket.connect();
    }
}