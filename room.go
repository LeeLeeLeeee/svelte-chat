package main

import (
	"github.com/gomodule/redigo/redis"
	"github.com/nitishm/go-rejson"
)

type Room struct {
	conn redis.Conn
	sh   *rejson.Handler
}

func newRoom() (*Room, error) {
	c, err := connectRedis()
	rejson := createRedisJson()
	rejson.SetRedigoClient(c)
	if err != nil {
		return nil, err
	}
	room := &Room{conn: c, sh: rejson}
	return room, nil
}

func (r Room) setRoom(roomName string) (interface{}, error) {
	return r.conn.Do("RPUSH", "ROOM", roomName)
}

func (r Room) getRoom() ([]string, error) {
	return redis.Strings(r.conn.Do("lrange", "ROOM", 0, 10))
}
