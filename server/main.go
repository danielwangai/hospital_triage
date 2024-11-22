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

	server := fiber.New(fiber.Config{
		AppName:      "Emergency Queue",
		ServerHeader: "Fiber V2",
	})

	server.Use(cors.New(cors.Config{AllowOrigins: "*"}))

	triageStorage := storage.InitTriageStorage(db)
	queueStorage := storage.InitQueueStorage(db)

	// handlers
	handler.InitTriageHandler(server.Group("/triage"), triageStorage)
	handler.InitQueueHandler(server.Group("/queue"), queueStorage)

	server.Listen(fmt.Sprintf(":" + env.PORT))
}
