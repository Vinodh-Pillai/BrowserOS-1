import type { Feature } from '../browseros/capabilities'
import type { ProviderTemplate } from './providerTemplates'
import type { ProviderType } from './types'

export type FeatureSupport = (feature: Feature) => boolean

function isProviderTypeVisible(
  _type: ProviderType,
  _supports: FeatureSupport,
): boolean {
  return true
}

export function visibleProviderTemplates(
  templates: ProviderTemplate[],
  supports: FeatureSupport,
): ProviderTemplate[] {
  return templates.filter((template) =>
    isProviderTypeVisible(template.id, supports),
  )
}

export function visibleProviderTypeOptions<
  T extends { value: ProviderType; label: string },
>(options: T[], supports: FeatureSupport): T[] {
  return options.filter((option) =>
    isProviderTypeVisible(option.value, supports),
  )
}
