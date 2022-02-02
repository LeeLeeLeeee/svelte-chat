package main

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type ManagerResponseType int64

const (
	CREATE_ROOM ManagerResponseType = iota + 1
)

type Manager struct {
	conn *websocket.Conn
	send chan *ManagerResponseFormat
}

type ManagerResponseFormat struct {
	messageType ManagerResponseType
}

type PubSubManager struct {
	list []*Manager
}

func (psm *PubSubManager) createManager(w *echo.Response, r *http.Request) {
	manager := new(Manager)
	manager.ConnectWs(w, r)
	go manager.run()
	psm.list = append(psm.list, manager)

}

func (m *Manager) ConnectWs(w *echo.Response, r *http.Request) error {
	conn, err := ConnectWebSocket(w, r)
	if err != nil {
		return err
	}
	m.conn = conn
	return nil
}

func (m *Manager) run() {
	defer func() {
		m.conn.Close()
	}()
	for {
		response, ok := <-m.send
		if !ok {
			return
		}
		m.response(response.messageType)
	}
}

func (m *Manager) response(res ManagerResponseType) {
	m.conn.SetWriteDeadline(time.Now().Add(writeWait))
	switch res {
	case CREATE_ROOM:
		if message, err := json.Marshal(res); err == nil {
			m.conn.WriteJSON(message)
		}
	}
}
