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

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
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
