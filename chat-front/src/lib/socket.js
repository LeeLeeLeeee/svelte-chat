class BaseSocket {
    constructor(url) {
        this.socket = new WebSocket(url)
        this.socket.onclose = (e) => {
            this.socket.close()
        }
    }

    onListenHandler(handler) {
        this.socket.onmessage = (e) => {
            handler(e);
        }
    }

    sendMessage(message) {
        this.socket.send(message);
    }

    close() {
        this.socket.close();
    }
}

class SocketClient extends BaseSocket {
    constructor(name) {
        super(`ws://localhost:3001/ws/client?name=${name}`)
        this.socket.onopen = (e) => {
            console.log("socket-client is connected")
        };
    }
}

export default SocketClient;
