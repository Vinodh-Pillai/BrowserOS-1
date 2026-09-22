import { describe, expect, it } from 'bun:test'

const { createMcpRoutes } = await import('../../../src/api/routes/mcp')

describe('createMcpRoutes', () => {
  it('creates routes successfully', async () => {
    const app = createMcpRoutes({
      version: '0.0.0-test',
      browser: {} as never,
      browserSession: {} as never,
      browserUseNewTools: true,
    })

    expect(app).toBeDefined()
    expect(typeof app.fetch).toBe('function')
  })
})
