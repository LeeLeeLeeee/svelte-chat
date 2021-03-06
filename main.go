package main

import (
	"flag"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type responseFormat struct {
	StatusCode int         `json:"status"`
	Message    string      `json:"msg,omitempty"`
	Data       interface{} `json:"data,omitempty"`
}

type userParam struct {
	Name string `json:"name"`
}

type roomParam struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type userRoomParam struct {
	UserName string `json:"name"`
	RoomId   string `json:"roomId"`
}

var (
	roomList   = newRoomList()
	addr       = flag.String("addr", ":19123", "http service address")
	clientList = new(ClientList)
)

func main() {
	r := echo.New()
	r.Use(middleware.Logger())
	r.GET("/ws/client", connectClient)
	r.POST("/api/room/create", createRoom)
	r.GET("/api/room/connect", connectRoom)
	r.GET("/api/room", getRoomList)
	r.PATCH("/api/user/leave", leaveRoom)
	r.PATCH("/api/user/exit", exitRoom)
	r.POST("/api/user/create", createUser)
	r.GET("/api/user", getUser)
	r.DELETE("/api/user", deleteUser)
	server := &http.Server{
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		Addr:         *addr,
	}
	fmt.Printf("localhost: %s server on\n", *addr)
	panic(server.ListenAndServe())
}

func connectRoom(c echo.Context) error {
	userName := c.QueryParam("userName")
	roomId := c.QueryParam("roomId")
	client, err := clientList.findUser(userName)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "client not found",
		})
	}

	room, err := roomList.findRoom(roomId)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "room not found",
		})
	}

	room.register(client)

	return c.JSON(http.StatusOK, responseFormat{
		StatusCode: http.StatusOK,
		Message:    "ok",
	})
}

func connectClient(c echo.Context) error {
	userName := c.QueryParam("name")
	client, err := clientList.findUser(userName)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "this user isn't registed",
		})
	}

	if err := connectWs(client, c.Response(), c.Request()); err != nil {
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
	r := new(roomParam)
	if err := c.Bind(r); err != nil {
		return c.JSON(http.StatusBadRequest, responseFormat{
			StatusCode: http.StatusBadRequest,
			Message:    "bad request",
		})
	}

	room, err := roomList.createRoom(r.Id, r.Name)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "Fail to created",
		})
	}
	return c.JSON(http.StatusCreated, responseFormat{
		StatusCode: http.StatusCreated,
		Message:    "ok",
		Data:       room,
	})
}

func getRoomList(c echo.Context) error {
	urlValue := c.QueryParams()
	query := &RoomQuery{username: urlValue.Get("username"), ableParticipate: urlValue.Get("ableParticipate")}
	roomList := roomList.get(query)

	return c.JSON(http.StatusOK, responseFormat{
		StatusCode: http.StatusOK,
		Message:    "ok",
		Data:       roomList,
	})
}

func createUser(c echo.Context) error {
	u := new(userParam)
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

	client, err := clientList.createClient(u.Name)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "Fail to create",
		})
	}
	return c.JSON(http.StatusCreated, responseFormat{
		StatusCode: http.StatusCreated,
		Message:    "ok",
		Data:       client,
	})
}

func getUser(c echo.Context) error {
	isNotAssigned := c.QueryParam("notAssigned")
	roomId := c.QueryParam("roomId")
	var cliList []string
	if ok, _ := strconv.ParseBool(isNotAssigned); ok {
		cliList = clientList.getClientNotAssignedUserName()
	} else if roomId != "" {
		if room, err := roomList.findRoom(roomId); err == nil {
			cliList = room.getParticipatedClient()
		}
	} else {
		cliList = clientList.getClientUserName()
	}

	return c.JSON(http.StatusOK, responseFormat{
		StatusCode: http.StatusOK,
		Message:    "ok",
		Data:       cliList,
	})
}

func leaveRoom(c echo.Context) error {
	param := new(userRoomParam)
	if err := c.Bind(param); err != nil {
		return c.JSON(http.StatusBadRequest, responseFormat{
			StatusCode: http.StatusBadRequest,
			Message:    "bad request",
		})
	}
	if param.UserName == "" {
		return c.JSON(http.StatusBadRequest, responseFormat{
			StatusCode: http.StatusBadRequest,
			Message:    "userName is blanck",
		})
	}
	user, err := clientList.findUser(param.UserName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "can't find user",
		})
	}

	room := roomList.findRoomHaveUser(user)

	if room == nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "can't find matched room for delete",
		})
	}

	if room.RoomId != param.RoomId {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "can't find matched room for delete",
		})
	}

	room.disconnect(user)

	return c.JSON(http.StatusOK, responseFormat{
		StatusCode: http.StatusOK,
		Message:    "ok",
	})
}

func exitRoom(c echo.Context) error {
	param := new(userRoomParam)
	if err := c.Bind(param); err != nil {
		return c.JSON(http.StatusBadRequest, responseFormat{
			StatusCode: http.StatusBadRequest,
			Message:    "bad request",
		})
	}
	if param.UserName == "" {
		return c.JSON(http.StatusBadRequest, responseFormat{
			StatusCode: http.StatusBadRequest,
			Message:    "userName is blanck",
		})
	}

	user, err := clientList.findUser(param.UserName)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "can't find user",
		})
	}
	room, err := roomList.findRoom(param.RoomId)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "can't find room",
		})
	}

	if ok, roomIndex := room.checkClientIsRegisted(user); ok {
		user.exitRoom(roomIndex)
	}

	return c.JSON(http.StatusOK, responseFormat{
		StatusCode: http.StatusOK,
		Message:    "ok",
	})
}

func deleteUser(c echo.Context) error {
	u := new(userParam)
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusInternalServerError, responseFormat{
			StatusCode: http.StatusInternalServerError,
			Message:    "Failed to bind",
		})
	}

	if u.Name == "" {
		return c.JSON(http.StatusBadRequest, responseFormat{
			StatusCode: http.StatusBadRequest,
			Message:    "name must have a value.",
		})
	}

	if err := clientList.delete(u.Name); err != nil {
		return c.JSON(http.StatusBadRequest, responseFormat{
			StatusCode: http.StatusBadRequest,
			Message:    "Fail to delete user.",
		})
	}

	return c.JSON(http.StatusOK, responseFormat{
		StatusCode: http.StatusOK,
		Message:    "ok",
	})
}
