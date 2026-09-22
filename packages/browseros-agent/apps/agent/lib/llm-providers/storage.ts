import { storage } from '@wxt-dev/storage'
import { getBrowserOSAdapter } from '@/lib/browseros/adapter'
import { BROWSEROS_PREFS } from '@/lib/browseros/prefs'
import {
  DEFAULT_PROVIDER_ID,
  DEFAULT_PROVIDER_NAME,
} from './provider-selection'
import type { LlmProviderConfig, LlmProvidersBackup } from './types'

export { DEFAULT_PROVIDER_ID } from './provider-selection'

/** Storage key for LLM providers array */
export const providersStorage = storage.defineItem<LlmProviderConfig[]>(
  'local:llm-providers',
  {
    version: 2,
    migrations: {
      2: (
        providers: LlmProviderConfig[] | null,
      ): LlmProviderConfig[] | null => {
        if (!providers) return providers
        return providers.map((provider) => {
          if (
            provider.id === DEFAULT_PROVIDER_ID &&
            provider.type === 'browseros'
          ) {
            return { ...provider, contextWindow: 200000 }
          }
          return provider
        })
      },
    },
  },
)

/** Backup providers to BrowserOS prefs (write-only, best-effort) */
async function backupToBrowserOS(backup: LlmProvidersBackup): Promise<void> {
  try {
    const adapter = getBrowserOSAdapter()
    await adapter.setPref(BROWSEROS_PREFS.PROVIDERS, JSON.stringify(backup))
  } catch {
    // BrowserOS API not available - ignore
  }
}

/**
 * Setup one-way sync of LLM providers to BrowserOS prefs
 * @public
 */
export function setupLlmProvidersBackupToBrowserOS(): () => void {
  const unsubscribe = providersStorage.watch(async (providers) => {
    if (providers) {
      const defaultProviderId = await defaultProviderIdStorage.getValue()
      await backupToBrowserOS({ defaultProviderId, providers })
    }
  })
  return unsubscribe
}

export async function syncLlmProviders(): Promise<void> {
  // Disabled: no data leaves this machine
}

/**
 * Setup one-way sync of LLM providers to GraphQL backend
 * Watches for storage changes and uploads non-sensitive provider data
 * @public
 */
export function setupLlmProvidersSyncToBackend(): () => void {
  syncLlmProviders().catch(() => {})

  const unsubscribe = providersStorage.watch(async () => {
    try {
      await syncLlmProviders()
    } catch {
      // Sync failed silently - will retry on next storage change
    }
  })
  return unsubscribe
}

/** Load providers from storage */
export async function loadProviders(): Promise<LlmProviderConfig[]> {
  const providers = (await providersStorage.getValue()) || []
  const normalizedProviders = normalizeProviderNames(providers)

  // Keep storage consistent so every consumer sees the same provider name.
  if (
    normalizedProviders.some((provider, index) => provider !== providers[index])
  ) {
    await providersStorage.setValue(normalizedProviders)
  }

  return normalizedProviders
}

/** Creates the default Ram provider configuration */
export function createDefaultRamProvider(): LlmProviderConfig {
  const timestamp = Date.now()
  return {
    id: DEFAULT_PROVIDER_ID,
    type: 'openai-compatible',
    name: DEFAULT_PROVIDER_NAME,
    baseUrl: 'http://192.168.4.103:8000/v1',
    modelId: 'Qwen/Qwen3.6-27B-FP8',
    supportsImages: true,
    contextWindow: 128000,
    temperature: 0.2,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

/** Creates the default providers configuration. Only call when storage is empty. */
export function createDefaultProvidersConfig(): LlmProviderConfig[] {
  return [createDefaultRamProvider()]
}

/**
 * Normalize built-in provider names back to "BrowserOS" (e.g. from "Kimi K2.5"
 * which was set during a previous partnership launch).
 */
function normalizeProviderNames(
  providers: LlmProviderConfig[],
): LlmProviderConfig[] {
  return providers.map((provider) => {
    if (
      provider.id === DEFAULT_PROVIDER_ID &&
      provider.type === 'browseros' &&
      provider.name !== DEFAULT_PROVIDER_NAME
    ) {
      return {
        ...provider,
        name: DEFAULT_PROVIDER_NAME,
      }
    }
    return provider
  })
}

/** Storage key for the default provider ID */
export const defaultProviderIdStorage = storage.defineItem<string>(
  'local:default-provider-id',
  {
    fallback: DEFAULT_PROVIDER_ID,
  },
)
