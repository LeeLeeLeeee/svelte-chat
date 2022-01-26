package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
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

var upgrader = websocket.Upgrader{
	ReadBufferSize:    1024,
	WriteBufferSize:   1024,
	EnableCompression: false,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Client struct {
	hub        *Hub
	conn       *websocket.Conn
	send       chan []byte
	ClientName string
}

func (c *Client) read() {
	defer func() {
		c.hub.unregister <- c
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
		c.hub.broadcast <- broadCastMessage
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
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			packedMessage := packMessageWithUser(c.ClientName, string(message))
			marshaledMessage, err := json.Marshal(packedMessage)
			fmt.Println(string(marshaledMessage))
			if err != nil {
				return
			}
			w.Write(marshaledMessage)
			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
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

func connectWs(hub *Hub, name string, w *echo.Response, r *http.Request) error {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return errors.New("connect fail")
	}
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256), ClientName: name}
	client.hub.register <- client
	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
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
