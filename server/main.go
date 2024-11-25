package main

import (
	"fmt"
	"github.com/danielwangai/hospital_triage/handler"
	"github.com/danielwangai/hospital_triage/storage"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	env := EnvConfig()
	db := DBConnection(env)
	pusher := NewPusherClient(env.PUSHER_APP_ID, env.PUSHER_KEY, env.PUSHER_SECRET, env.PUSHER_CLUSTER, env.PUSHER_SECURE)

	server := fiber.New(fiber.Config{
		AppName:      "Emergency Queue",
		ServerHeader: "Fiber V2",
	})

	server.Use(cors.New(cors.Config{AllowOrigins: "*"}))

	triageStorage := storage.InitTriageStorage(db)
	queueStorage := storage.InitQueueStorage(db)

	// handlers
	handler.InitTriageHandler(server.Group("/triage"), triageStorage)
	handler.InitQueueHandler(server.Group("/queue"), queueStorage, pusher)

	server.Listen(fmt.Sprintf(":" + env.PORT))
}
