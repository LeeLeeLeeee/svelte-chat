package main

type BroadCastMessage struct {
	To      string
	Message []byte
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan *BroadCastMessage
	register   chan *Client
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan *BroadCastMessage),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) notifyWelcome(client *Client) {
	message := &BroadCastMessage{
		To:      "admin",
		Message: []byte(JoinStrings(client.ClientName, "님이 방에 참여하셨습니다.")),
	}
	for client := range h.clients {
		client.send <- message
	}
}

func (h *Hub) notifyLeave(client *Client) {
	message := &BroadCastMessage{
		To:      "admin",
		Message: []byte(JoinStrings(client.ClientName, "님이 방에서 나가셨습니다.")),
	}
	for client := range h.clients {
		client.send <- message
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.notifyWelcome(client)
			h.clients[client] = true
		case client := <-h.unregister:
			h.notifyLeave(client)
			delete(h.clients, client)
		case message := <-h.broadcast:
			for client := range h.clients {
				if client.ClientName == message.To {
					continue
				}
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
