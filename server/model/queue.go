package model

type QueueEntry struct {
	AssignedLabel string `json:"assignedLabel" validate:"required"`
	Number        int    `json:"number"`
}

// QueueEntryToInterfaces maps []TriageNode and []TriageOptionNode to []interface{
func QueueEntryToInterfaces[T any](queue []T) []interface{} {
	result := make([]interface{}, len(queue))
	for k, v := range queue {
		result[k] = v
	}

	return result
}
