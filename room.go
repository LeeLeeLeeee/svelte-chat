package main

import (
	"errors"
	"fmt"
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
	fmt.Println(room.checkClientIsRegisted(client))
}

func (room *Room) unregister(client *Client) {
	if room.checkClientIsConnected(client) {
		room.hub.unregister <- client
		room.CountParticipant -= 1
		/* roomIndex := FindIndex(client.ParticipatedRoomIDLst, func(value interface{}) bool {
			return room.RoomId == value
		})
		if roomIndex != -1 {
			RemoveItemOfSlice(client.ParticipatedRoomIDLst, roomIndex)
		} */
	}
}

func (room *Room) checkClientIsConnected(client *Client) bool {
	_, ok := room.hub.clients[client]
	return ok
}

func (room *Room) checkClientIsRegisted(client *Client) bool {
	roomIndex := FindIndex(client.ParticipatedRoomIDLst, func(value interface{}) bool {
		return room.RoomId == value
	})
	return roomIndex != -1
}

func (room *Room) getParticipatedClient() []string {
	clientNameList := []string{}
	for client := range room.hub.clients {
		clientNameList = append(clientNameList, client.ClientName)
	}
	return clientNameList
}

func (roomList *RoomList) checkDuplicated(name string) bool {
	_, err := roomList.findRoom(name)
	return err == nil
}

func (roomList *RoomList) createRoom(id string, name string) (*Room, error) {
	if !roomList.checkDuplicated(name) {
		hub := newHub()
		go hub.run()
		room := &Room{RoomId: id, RoomName: name, hub: hub, CountParticipant: 0}
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
		if room.checkClientIsRegisted(client) {
			rooms = append(rooms, room)
		}
	}
	return rooms
}

func (roomList *RoomList) getRoomListHaveNotUser(client *Client) []*Room {
	rooms := []*Room{}
	for _, room := range roomList.list {
		if !room.checkClientIsRegisted(client) {
			rooms = append(rooms, room)
		}
	}
	return rooms
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
