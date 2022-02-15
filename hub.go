package main

type BroadCastMessage struct {
	To      string
	Message []byte
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan *BroadCastMessage
	register   chan *Client
	disconnect chan *Client
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan *BroadCastMessage),
		register:   make(chan *Client),
		disconnect: make(chan *Client),
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
