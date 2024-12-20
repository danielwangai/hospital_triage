package handler

import (
	"context"
	"github.com/danielwangai/hospital_triage/model"
	"github.com/danielwangai/hospital_triage/storage"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"log"
	"time"
)

type TriageHandler struct {
	storage *storage.TriageStorage
}

func InitTriageHandler(router fiber.Router, storage *storage.TriageStorage) {
	handler := &TriageHandler{storage}
	router.Get("/", handler.Get)
	router.Post("/", handler.Post)
	router.Get("/decision-tree", handler.GetTriageDecisionTree)
	//router.Get("/decision-tree-v2", handler.GetTriageDecisionTreeV2)
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

func (h *TriageHandler) GetTriageDecisionTree(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(ctx.Context(), 5*time.Second)
	defer cancel()

	tNodes, oNodes, edges, err := h.storage.Get(context)
	if err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	nextStepID := ctx.Query("nextStepId", "")
	currentNodeStep := &model.TriageNode{}
	var step string
	options := []map[string]string{}

	for _, node := range tNodes {
		if (nextStepID == "" && node.Data.IsRoot) || node.Id == nextStepID {
			currentNodeStep = node
			step = node.Data.Value
			break
		}
	}

	for _, ONode := range oNodes {
		if ONode.ParentId == currentNodeStep.Id {
			// current node is the parent of the current oNode in the iteration
			option := make(map[string]string)
			option["value"] = ONode.Data.Value

			for _, edge := range edges {
				if edge.Source == ONode.Id {
					for _, node := range tNodes {
						if edge.Target == node.Id {
							if node.Data.StepType == "label" {
								option["assignedLabel"] = node.Data.AssignedLabel
							} else {
								option["nextStep"] = node.Id
							}
							break
						}
					}
					break
				}
			}

			options = append(options, option)
		}
	}
	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"step":    step,
		"options": options,
	})
}

// GetTriageDecisionTreeV2 => TODO: Work on this to improve performance.
func (h *TriageHandler) GetTriageDecisionTreeV2(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(ctx.Context(), 5*time.Second)
	defer cancel()

	tNodes, oNodes, _, err := h.storage.Get(context)
	if err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	nextStepID := ctx.Query("nextStepId", "")
	currentNodeStep := &model.TriageNode{}
	var step string
	options := []map[string]string{}

	for _, node := range tNodes {
		if (nextStepID == "" && node.Data.IsRoot) || node.Id == nextStepID {
			currentNodeStep = node
			step = node.Data.Value
			break
		}
	}

	var childNodes []*model.TriageOptionNode

	for _, ONode := range oNodes {
		if ONode.ParentId == currentNodeStep.Id {
			childNodes = append(childNodes, ONode)
			// current node is the parent of the current oNode in the iteration
			//option := make(map[string]string)
			//option["value"] = ONode.Data.Value
			//
			//for _, edge := range edges {
			//	if edge.Source == ONode.Id {
			//		for _, node := range tNodes {
			//			if edge.Target == node.Id {
			//				if node.Data.StepType == "label" {
			//					option["assignedLabel"] = node.Data.AssignedLabel
			//				} else {
			//					option["nextStep"] = node.Id
			//				}
			//				break
			//			}
			//		}
			//		break
			//	}
			//}
			//
			//options = append(options, option)
		}
	}

	log.Printf("childNodes>>>: %v\n", childNodes)
	for _, v := range childNodes {
		log.Printf("v>>>: %v\n", v)
	}

	for _, node := range tNodes {
		for _, child := range childNodes {
			if child.Id == node.Id {
				option := make(map[string]string)
				option["value"] = child.Data.Value
				if node.Data.StepType == "label" {
					option["assignedLabel"] = node.Data.AssignedLabel
				} else {
					option["nextStep"] = node.Id
				}
				options = append(options, option)
			}
			log.Printf("child.Id == node.Id>>>: %v\n%s, %s", child.Id == node.Id, child.Id, node.Id)
		}
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"step":    step,
		"options": options,
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
