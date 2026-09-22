package update

import (
	"context"
	"fmt"
	"os"
	"time"
)

const (
	DefaultCheckTTL  = 24 * time.Hour
	SkipCheckEnv     = "BROWSEROS_SKIP_UPDATE_CHECK"
	InstallMethodEnv = "BROWSEROS_INSTALL_METHOD"
)

type Options struct {
	CurrentVersion string
	CheckTTL       time.Duration
	Automatic      bool
	Now            func() time.Time
}

type Manager struct {
	options Options
	state   *State
}

type CheckResult struct {
	CurrentVersion    string    `json:"current_version"`
	LatestVersion     string    `json:"latest_version"`
	LatestPublishedAt string    `json:"latest_published_at,omitempty"`
	UpdateAvailable   bool      `json:"update_available"`
	CheckedAt         time.Time `json:"checked_at"`
	Asset             *Asset    `json:"asset,omitempty"`
}

func NewManager(options Options) *Manager {
	if options.CheckTTL == 0 {
		options.CheckTTL = DefaultCheckTTL
	}
	if options.Now == nil {
		options.Now = time.Now
	}

	return &Manager{
		options: options,
		state:   &State{},
	}
}

func (m *Manager) CachedNotice() string {
	// No update notices for local deployment
	return ""
}

// AutomaticEnabled always returns false: self-update disabled for local deployment.
func (m *Manager) AutomaticEnabled() bool {
	return false
}

func installedViaPackageManager() bool {
	method := os.Getenv(InstallMethodEnv)
	switch method {
	case "npm", "brew", "homebrew":
		return true
	}
	return false
}

func (m *Manager) ShouldCheck() bool {
	if !m.AutomaticEnabled() {
		return false
	}
	return m.state.IsStale(m.options.Now(), m.options.CheckTTL)
}

func (m *Manager) StartBackgroundCheck(ctx context.Context) <-chan struct{} {
	done := make(chan struct{})
	if !m.ShouldCheck() {
		close(done)
		return done
	}

	go func() {
		defer close(done)
		_, _ = m.CheckNow(ctx)
	}()

	return done
}

// CheckNow never contacts external endpoints: self-update disabled for local deployment.
func (m *Manager) CheckNow(ctx context.Context) (*CheckResult, error) {
	return &CheckResult{
		CurrentVersion: m.options.CurrentVersion,
		LatestVersion:  m.options.CurrentVersion,
		UpdateAvailable: false,
		CheckedAt:      m.options.Now(),
	}, nil
}

func (m *Manager) Apply(ctx context.Context, result *CheckResult) error {
	return fmt.Errorf("self-update is disabled in this build")
}

func FormatNotice(currentVersion, latestVersion string) string {
	return "self-update is disabled in this build"
}
