package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:    1024,
		WriteBufferSize:   1024,
		EnableCompression: false,
		CheckOrigin: func(r *http.Request) bool {
			myLogger.Println(r)
			return true
		},
	}
	myLogger = log.New(os.Stdout, "INFO: ", log.LstdFlags)
)

type responseFormat struct {
	StatusCode int         `json:"status"`
	Message    string      `json:"msg,omitempty"`
	Data       interface{} `json:"data,omitempty"`
}

type clientInfo struct {
	Conn       *websocket.Conn
	ClientName string
	RoomName   string
}

type userInfo struct {
	Name     string `json:"name"`
	RoomName string `json:"roomName"`
}

func main() {

	r := echo.New()
	r.Use(middleware.Logger())
	r.GET("/ws", connectClient)
	server := &http.Server{
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		Addr:         ":19123",
	}
	fmt.Println("localhost:19123 server on")
	panic(server.ListenAndServe())
}

func connectClient(c echo.Context) error {
	u := new(userInfo)
	if err := c.Bind(u); err != nil {
		return c.JSON(500, responseFormat{
			StatusCode: 500,
			Message:    "Failed to bind",
		})
	}
	if u.Name == "" || u.RoomName == "" {
		return c.JSON(400, responseFormat{
			StatusCode: 400,
			Message:    "name and roomName must have a vlaue.",
		})
	}
	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		fmt.Println(err)
		return c.JSON(500, responseFormat{
			StatusCode: 500,
			Message:    "Failed to create connection",
		})
	}
	client := &clientInfo{
		Conn:       conn,
		ClientName: u.Name,
		RoomName:   u.RoomName,
	}

	go client.Start()
	return c.JSON(200, responseFormat{
		StatusCode: 200,
		Message:    "Success",
	})
}

func (c clientInfo) Start() {
	defer func() {

	}()
	for {
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		if err := c.Conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}

}
