class SocketClient {
    constructor(name, room) {
        const url = `ws://localhost:3000/ws?name=${name}&roomName=${room}`
        this.socket = new WebSocket(url)
        this.socket.onopen = (e) => {
            this.socket.send('Hi!')
        };
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

export default SocketClient;