package main

import (
	"errors"
	"strconv"
)

type Room struct {
	RoomId           string `json:"id"`
	RoomName         string `json:"name"`
	CountParticipant int    `json:"countParticipant"`
	hub              *Hub
}

type RoomQuery struct {
	username        string `json:"username"`
	ableParticipate string `json:"ableParticipate"`
}

type RoomList struct {
	list []*Room
}

func newRoomList() *RoomList {
	return new(RoomList)
}

func (room *Room) register(client *Client) {

	if !room.checkClientIsConnected(client) {
		room.hub.register <- client
		room.CountParticipant += 1
		client.ParticipatedRoomIDLst = append(client.ParticipatedRoomIDLst, room.RoomId)
	}
}

func (room *Room) disconnect(client *Client) {
	if room.checkClientIsConnected(client) {
		room.hub.disconnect <- client
		room.CountParticipant -= 1
	}
}

func (room *Room) checkClientIsConnected(client *Client) bool {
	is := room.hub.clients[client]
	return is
}

func (room *Room) checkClientIsRegisted(client *Client) (bool, int) {
	roomIndex := FindIndex(client.ParticipatedRoomIDLst, func(value interface{}) bool {
		return room.RoomId == value
	})
	return roomIndex != -1, roomIndex
}

func (room *Room) getParticipatedClient() []string {
	clientNameList := []string{}
	for client := range room.hub.clients {
		if room.hub.clients[client] {
			clientNameList = append(clientNameList, client.ClientName)
		}
	}
	return clientNameList
}

func (room *Room) run() {
	h := room.hub
	for {
		select {
		case client := <-h.register:
			h.notifyWelcome(client)
			h.clients[client] = true
		case client := <-h.disconnect:
			h.notifyLeave(client)
			if _, ok := h.clients[client]; ok {
				h.clients[client] = false
			}
		case client := <-h.unregister:
			delete(h.clients, client)
		case message := <-h.broadcast:
			for client := range h.clients {
				if client.ClientName == message.To {
					continue
				}
				if !h.clients[client] {
					client.receiveNotice(room.RoomName, room.RoomId)
				} else {
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
}

func (roomList *RoomList) checkDuplicated(name string) bool {
	_, err := roomList.findRoom(name)
	return err == nil
}

func (roomList *RoomList) createRoom(id string, name string) (*Room, error) {
	if !roomList.checkDuplicated(name) {
		hub := newHub()
		room := &Room{RoomId: id, RoomName: name, hub: hub, CountParticipant: 0}
		go room.run()
		roomList.insertRoom(room)
		return room, nil
	}
	return nil, errors.New("fail to create room")
}

func (roomList *RoomList) findRoom(id string) (*Room, error) {
	for _, room := range roomList.list {
		if room.RoomId == id {
			return room, nil
		}
	}
	return nil, errors.New("not found")
}

func (roomList *RoomList) insertRoom(room *Room) {
	roomList.list = append(roomList.list, room)
}

func (roomList *RoomList) get(query *RoomQuery) []*Room {
	if query.username != "" {
		ok, err := strconv.ParseBool(query.ableParticipate)
		if err != nil {
			return roomList.list
		}
		client, _ := clientList.findUser(query.username)

		if ok {
			return roomList.getRoomListHaveNotUser(client)
		} else {
			return roomList.getRoomListHaveUser(client)
		}
	} else {
		return roomList.list
	}

}

func (roomList *RoomList) findRoomHaveUser(client *Client) *Room {
	for _, room := range roomList.list {
		if room.checkClientIsConnected(client) {
			return room
		}
	}
	return nil
}

func (roomList *RoomList) getRoomListHaveUser(client *Client) []*Room {
	rooms := []*Room{}
	for _, room := range roomList.list {
		if ok, _ := room.checkClientIsRegisted(client); ok {
			rooms = append(rooms, room)
		}
	}
	return rooms
}

func (roomList *RoomList) getRoomListHaveNotUser(client *Client) []*Room {
	rooms := []*Room{}
	for _, room := range roomList.list {
		if ok, _ := room.checkClientIsRegisted(client); !ok {
			rooms = append(rooms, room)
		}
	}
	return rooms
}
