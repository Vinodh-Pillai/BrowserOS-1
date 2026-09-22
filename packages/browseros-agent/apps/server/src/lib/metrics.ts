/**
 * @license
 * Copyright 2025 BrowserOS
 */

interface MetricsConfig {
  client_id?: string
  install_id?: string
  browseros_version?: string
  chromium_version?: string
  server_version?: string
  [key: string]: string | undefined
}

class MetricsService {
  private config: MetricsConfig | null = null

  initialize(config: MetricsConfig): void {
    this.config = { ...this.config, ...config }
  }

  isEnabled(): boolean {
    return false
  }

  getClientId(): string | null {
    return null
  }

  /** Records one metrics event (no-op in local-hardened builds). */
  log(
    _eventName: string,
    _properties: Record<string, unknown> = {},
    _sampling = 0.2,
  ): void {
    return
  }

  async shutdown(): Promise<void> {}
}

export const metrics = new MetricsService()

export const __internal__ = {
  ROLLUP_INTERVAL_MS: 30 * 60 * 1000,
  MAX_TOOL_NAME_KEYS: 200,
  sanitizeToolName: (name: string) => name.replace(/\./g, '_').slice(0, 80),
}
