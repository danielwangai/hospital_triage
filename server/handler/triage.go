package handler

import (
	"context"
	"github.com/danielwangai/hospital_triage/model"
	"github.com/danielwangai/hospital_triage/storage"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"time"
)

type TriageHandler struct {
	storage *storage.TriageStorage
}

func InitTriageHandler(router fiber.Router, storage *storage.TriageStorage) {
	handler := &TriageHandler{storage}
	router.Get("/", handler.Get)
	router.Post("/", handler.Post)
}

func (h *TriageHandler) Get(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(ctx.Context(), 5*time.Second)
	defer cancel()

	tNodes, oNodes, edges, err := h.storage.Get(context)
	if err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	nodes := model.MergeNodes(tNodes, oNodes)
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"nodes": nodes,
		"edges": edges,
	})
}

func (h *TriageHandler) Post(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(ctx.Context(), 5*time.Second)
	defer cancel()

	var body struct {
		TNodes []*model.TriageNode       `json:"nodes" validate:"required"`
		ONodes []*model.TriageOptionNode `json:"optionNodes" validate:"required"`
		Edges  []*model.Edge             `json:"edges" validate:"required"`
	}

	if err := ctx.BodyParser(&body); err != nil {
		return ctx.SendStatus(fiber.StatusUnprocessableEntity)
	}

	if err := validator.New().Struct(&body); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	if err := h.storage.Post(context, body.TNodes, body.ONodes, body.Edges); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	return ctx.SendStatus(fiber.StatusOK)
}
