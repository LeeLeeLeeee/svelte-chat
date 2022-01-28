package main

import (
	"flag"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type responseFormat struct {
	StatusCode int         `json:"status"`
	Message    string      `json:"msg,omitempty"`
	Data       interface{} `json:"data,omitempty"`
}

type userInfo struct {
	Name string `json:"name"`
}

var (
	hub           = newHub()
	room, roomErr = newRoom()
	addr          = flag.String("addr", ":19123", "http service address")
)

func main() {
	go hub.run()
	if roomErr != nil {
		panic("redis server can't connect")
	}
	defer func() {
		room.conn.Do("FLUSHALL")
		room.conn.Close()
	}()
	r := echo.New()
	r.Use(middleware.Logger())
	r.GET("/ws", connectClient)
	r.GET("/api/create", createRoom)
	r.GET("/api/room", getRoomList)
	server := &http.Server{
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		Addr:         *addr,
	}
	fmt.Printf("localhost: %s server on\n", *addr)
	panic(server.ListenAndServe())
}

func connectClient(c echo.Context) error {
	u := new(userInfo)
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "Failed to bind",
		})
	}

	if u.Name == "" {
		return c.JSON(http.StatusBadRequest, responseFormat{
			StatusCode: http.StatusBadRequest,
			Message:    "name and roomName must have a value.",
		})
	}
	err := connectWs(hub, u.Name, c.Response(), c.Request())

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "Failed to create connection",
		})
	}

	return c.JSON(http.StatusOK, responseFormat{
		StatusCode: http.StatusOK,
		Message:    "Success",
	})
}

func createRoom(c echo.Context) error {
	_, err := room.setRoom(c.QueryParam("roomName"))
	if err != nil {
		return err
	}
	return nil
}

func getRoomList(c echo.Context) error {
	roomList, err := room.getRoom()
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, roomList)
}
