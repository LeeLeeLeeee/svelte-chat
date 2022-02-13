package main

import (
	"bytes"
	"errors"
	"net/http"
	"reflect"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:    1024,
	WriteBufferSize:   1024,
	EnableCompression: false,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

/* slice lib */
func FindIndex(slice interface{}, f func(value interface{}) bool) int {
	s := reflect.ValueOf(slice)
	if s.Kind() == reflect.Slice {
		for index := 0; index < s.Len(); index++ {
			if f(s.Index(index).Interface()) {
				return index
			}
		}
	}
	return -1
}

func RemoveItemOfSlice(slice interface{}, i int) interface{} {
	s := reflect.ValueOf(slice)
	if s.Kind() == reflect.Slice {
		s = reflect.AppendSlice(s.Slice(0, i), s.Slice(i+1, s.Len()))
	}
	return s.Interface()
}

func ConnectWebSocket(w *echo.Response, r *http.Request) (*websocket.Conn, error) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, errors.New("connect fail")
	}
	return conn, nil
}

func JoinStrings(s ...string) string {
	var result bytes.Buffer
	for _, x := range s {
		result.WriteString(x)
	}
	return result.String()
}
