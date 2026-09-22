package analytics

import "time"

var svc *service

type service struct{}

func Init(version string) {
  return
}

func Track(command string, success bool, duration time.Duration) {
  return
}

func Close() {
  return
}
