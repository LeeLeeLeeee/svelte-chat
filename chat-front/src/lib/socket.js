class SocketClient {
    constructor(name, room) {
        const url = `ws://localhost:3000/ws?name=${name}&roomName=${room}`
        this.socket = new WebSocket(url)
        this.socket.onopen = function (e) {
            console.log('hi')
        };
        this.socket.onclose = (e) => {
            console.log('close');
            this.socket.close()
        }
        this.socket.onmessage = (e) => {
            console.log(e);
        }
    }

    sendMessage(message) {
        this.socket.send(message);
    }
}

export default SocketClient;