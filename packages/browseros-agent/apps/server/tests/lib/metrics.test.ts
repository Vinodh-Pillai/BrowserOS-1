/**
 * @license
 * Copyright 2025 BrowserOS
 */

import { describe, expect, it } from 'bun:test'

const metricsModule = await import('../../src/lib/metrics')
const { metrics, __internal__ } = metricsModule
const { ROLLUP_INTERVAL_MS, MAX_TOOL_NAME_KEYS, sanitizeToolName } =
  __internal__

describe('sanitizeToolName', () => {
  it('replaces dots with underscores', () => {
    expect(sanitizeToolName('foo.bar.baz')).toBe('foo_bar_baz')
  })

  it('caps length so a pathological name cannot blow up the payload', () => {
    const long = `${'x'.repeat(200)}`
    expect(sanitizeToolName(long).length).toBe(80)
  })
})

describe('MetricsService', () => {
  it('is disabled by default', () => {
    metrics.initialize({ client_id: 'test' })
    expect(metrics.isEnabled()).toBe(false)
  })

  it('getClientId returns null', () => {
    expect(metrics.getClientId()).toBe(null)
  })

  it('log is a no-op', () => {
    metrics.initialize({ client_id: 'test' })
    metrics.log('test.event', { foo: 'bar' })
  })

  it('shutdown is a no-op', async () => {
    await metrics.shutdown()
  })
})

describe('__internal__ exports', () => {
  it('exports ROLLUP_INTERVAL_MS', () => {
    expect(ROLLUP_INTERVAL_MS).toBe(30 * 60 * 1000)
  })

  it('exports MAX_TOOL_NAME_KEYS', () => {
    expect(MAX_TOOL_NAME_KEYS).toBe(200)
  })
})
