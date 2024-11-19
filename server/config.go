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
