package main

import (
	"github.com/gomodule/redigo/redis"
	"github.com/nitishm/go-rejson"
)

func connectRedis() (redis.Conn, error) {
	c, err := redis.Dial("tcp", ":6379")
	if err != nil {
		return nil, err
	}
	return c, nil
}

func createRedisJson() *rejson.Handler {
	return rejson.NewReJSONHandler()
}
