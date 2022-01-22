class SocketClient {
    constructor(name, room) {
        const url = `ws://localhost:3000/ws?name=${name}&roomName=${room}`
        this.socket = new WebSocket(url)
    }

    connect() {
        this.socket.onopen = function (e) {
            console.log('hi')
        };
    }
}

export default SocketClient;