package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

type Client struct {
	conn       *websocket.Conn
	send       chan *BroadCastMessage
	ClientName string
	roomList   []*Room
	targetRoom *Room
}

type ClientList struct {
	list []*Client
}

func (c *Client) appendRoom(room *Room) {
	c.roomList = append(c.roomList, room)
}

func (c *Client) enterRoom(room *Room) {
	if !c.checkHasRoom(room) {
		c.appendRoom(room)
	}
	c.targetRoom = room
}

func (c *Client) checkHasRoom(room *Room) bool {
	for _, myRoom := range c.roomList {
		if room.RoomName == myRoom.RoomName {
			return true
		}
	}
	return false
}

func (c *Client) clearTargetRoom() {
	if c.targetRoom != nil {
		c.targetRoom.unregister(c)
		c.targetRoom = nil
	}
}

func (c *Client) exitRoom() error {
	c.clearTargetRoom()
	return nil
}

func (c *Client) removeRoomList(room *Room) {
	roomIndex := FindIndex(c.roomList, func(value interface{}) bool {
		r := value.(*Room)
		return r.RoomId == room.RoomId
	})
	RemoveItemOfSlice(&c.roomList, roomIndex)
}

func (c *Client) read() {
	defer func() {
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		broadCastMessage := &BroadCastMessage{c.ClientName, message}
		c.targetRoom.hub.broadcast <- broadCastMessage
	}
}

func (c *Client) write() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			packedMessage := packMessageWithUser(message.To, string(message.Message))
			marshaledMessage, err := json.Marshal(packedMessage)
			if err != nil {
				return
			}
			w.Write(marshaledMessage)
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				message, ok := <-c.send
				if !ok {
					c.conn.WriteMessage(websocket.CloseMessage, []byte{})
					return
				}
				w.Write(message.Message)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func connectWs(client *Client, w *echo.Response, r *http.Request) error {
	conn, err := ConnectWebSocket(w, r)
	if err != nil {
		return err
	}
	client.conn = conn
	go client.write()
	go client.read()
	return nil
}

func packMessageWithUser(name string, message string) map[string]interface{} {
	packedMessage := make(map[string]interface{})
	packedMessage["To"] = name
	packedMessage["Message"] = message
	return packedMessage
}

func (cli *ClientList) createClient(name string) (*Client, error) {
	if !cli.checkDuplicated(name) {
		client := &Client{conn: nil, send: make(chan *BroadCastMessage), ClientName: name, roomList: []*Room{}, targetRoom: nil}
		cli.insertUser(client)
		return client, nil
	}
	return nil, errors.New("fail to create user")
}

func (cli *ClientList) findUser(name string) (*Client, error) {
	for _, client := range cli.list {
		if client.ClientName == name {
			return client, nil
		}
	}
	return nil, errors.New("not found")
}

func (cli *ClientList) insertUser(client *Client) {
	cli.list = append(cli.list, client)
}

func (cli *ClientList) checkDuplicated(name string) bool {
	_, err := cli.findUser(name)
	return err == nil
}

func (cli *ClientList) getClientUserName() []string {
	clientNameList := []string{}
	for _, client := range cli.list {
		clientNameList = append(clientNameList, client.ClientName)
	}
	return clientNameList
}
