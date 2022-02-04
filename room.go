package main

import (
	"errors"
)

type Room struct {
	RoomId           string `json:"id"`
	RoomName         string `json:"name"`
	CountParticipant int    `json:"countParticipant"`
	hub              *Hub
}

type RoomList struct {
	list []*Room
}

func newRoomList() *RoomList {
	return new(RoomList)
}

func (room *Room) register(client *Client) {
	if !room.checkClientIsRegisted(client) {
		room.hub.register <- client
		room.CountParticipant += 1
	}
}

func (room *Room) unregister(client *Client) {
	if room.checkClientIsRegisted(client) {
		room.hub.unregister <- client
		room.CountParticipant -= 1
	}
}

func (room *Room) checkClientIsRegisted(client *Client) bool {
	_, ok := room.hub.clients[client]
	return ok
}

func (roomList *RoomList) checkDuplicated(name string) bool {
	_, err := roomList.findRoom(name)
	return err == nil
}

func (roomList *RoomList) createRoom(id string, name string) (*Room, error) {
	if !roomList.checkDuplicated(name) {
		hub := newHub()
		go hub.run()
		room := &Room{RoomId: id, RoomName: name, hub: hub, CountParticipant: 1}
		roomList.insertRoom(room)
		return room, nil
	}
	return nil, errors.New("fail to create room")
}

func (roomList *RoomList) findRoom(name string) (*Room, error) {
	for _, room := range roomList.list {
		if room.RoomName == name {
			return room, nil
		}
	}
	return nil, errors.New("not found")
}

func (roomList *RoomList) insertRoom(room *Room) {
	roomList.list = append(roomList.list, room)
}

func (roomList *RoomList) get() []*Room {
	return roomList.list
}

// type Room struct {
// 	conn redis.Conn
// 	sh   *rejson.Handler
// }

// func newRoom() (*Room, error) {
// 	c, err := connectRedis()
// 	rejson := createRedisJson()
// 	rejson.SetRedigoClient(c)
// 	if err != nil {
// 		return nil, err
// 	}
// 	room := &Room{conn: c, sh: rejson}
// 	return room, nil
// }

// func (r Room) setRoom(roomName string) (interface{}, error) {
// 	return r.conn.Do("RPUSH", "ROOM", roomName)
// }

// func (r Room) getRoom() ([]string, error) {
// 	return redis.Strings(r.conn.Do("lrange", "ROOM", 0, 10))
// }
