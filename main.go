package main

import (
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
	hub = newHub()
)

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
	if u.Name == "" {
		return c.JSON(400, responseFormat{
			StatusCode: 400,
			Message:    "name and roomName must have a vlaue.",
		})
	}
	err := connectWs(hub, c.Response(), c.Request())

	if err != nil {
		return c.JSON(500, responseFormat{
			StatusCode: 500,
			Message:    "Failed to create connection",
		})
	}

	return c.JSON(200, responseFormat{
		StatusCode: 200,
		Message:    "Success",
	})
}
