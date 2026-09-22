import { describe, expect, it } from 'bun:test'
import {
  visibleProviderTemplates,
  visibleProviderTypeOptions,
} from './provider-visibility'
import { providerTemplates, providerTypeOptions } from './providerTemplates'

describe('provider visibility', () => {
  it('returns all templates', () => {
    const templates = visibleProviderTemplates(providerTemplates, () => true)
    expect(templates.length).toBeGreaterThan(0)
    expect(templates.map((t) => t.id)).toContain('openai')
  })

  it('returns all options', () => {
    const options = visibleProviderTypeOptions(providerTypeOptions, () => true)
    expect(options.length).toBeGreaterThan(0)
  })
})
