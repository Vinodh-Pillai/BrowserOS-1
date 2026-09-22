import { getBrowserOSAdapter } from '@/lib/browseros/adapter'
import { BROWSEROS_PREFS } from '@/lib/browseros/prefs'

/** @public */
export interface LlmHubProvider {
  name: string
  url: string
}

export async function loadProviders(): Promise<LlmHubProvider[]> {
  try {
    const adapter = getBrowserOSAdapter()
    const providersPref = await adapter.getPref(
      BROWSEROS_PREFS.THIRD_PARTY_LLM_PROVIDERS,
    )
    return (providersPref?.value as LlmHubProvider[]) || []
  } catch {
    return []
  }
}

export async function saveProviders(
  providers: LlmHubProvider[],
): Promise<boolean> {
  try {
    const adapter = getBrowserOSAdapter()
    return await adapter.setPref(
      BROWSEROS_PREFS.THIRD_PARTY_LLM_PROVIDERS,
      providers,
    )
  } catch {
    return false
  }
}

export function getFaviconUrl(_url: string, _size = 128): string | undefined {
  return undefined
}
