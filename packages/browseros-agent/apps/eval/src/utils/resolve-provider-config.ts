import type { LLMConfig } from '@browseros/shared/schemas/llm'
import { resolveEnvValue } from './resolve-env'

export interface ResolvedProviderConfig extends LLMConfig {
  upstreamProvider?: string
}

export async function resolveProviderConfig(
  agent: LLMConfig,
): Promise<ResolvedProviderConfig> {
  return {
    ...agent,
    apiKey: resolveEnvValue(agent.apiKey),
    accessKeyId: resolveEnvValue(agent.accessKeyId),
    secretAccessKey: resolveEnvValue(agent.secretAccessKey),
    sessionToken: resolveEnvValue(agent.sessionToken),
    region: resolveEnvValue(agent.region),
  }
}
