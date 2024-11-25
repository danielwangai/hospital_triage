package main

import (
	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
	"log"
)

type Env struct {
	PORT           string `env:"PORT,required"`
	MONGO_URI      string `env:"MONGO_URI,required"`
	MONGO_DATABASE string `env:"MONGO_DATABASE,required"`

	//	pusher
	PUSHER_APP_ID  string `env:"PUSHER_APP_ID,required"`
	PUSHER_KEY     string `env:"PUSHER_KEY,required"`
	PUSHER_SECRET  string `env:"PUSHER_SECRET,required"`
	PUSHER_CLUSTER string `env:"PUSHER_CLUSTER,required"`
	PUSHER_SECURE  bool   `env:"PUSHER_SECURE,required"`
}

func EnvConfig() *Env {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Unable to load .env file: %v\n", err)
	}

	envConfig := &Env{}
	if err := env.Parse(envConfig); err != nil {
		log.Fatalf("unable to parse environment variables: %v\n", err)
	}

	return envConfig
}
