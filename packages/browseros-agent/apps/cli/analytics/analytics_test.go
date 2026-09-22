package analytics

import (
	"testing"
	"time"
)

func TestInitNoopsWithoutAPIKey(t *testing.T) {
	Init("1.0.0")
	if svc != nil {
		t.Error("Init() created service")
	}
}

func TestTrackAndCloseNoopWithoutInit(t *testing.T) {
	svc = nil

	Track("test", true, time.Second)
	Close()
}
