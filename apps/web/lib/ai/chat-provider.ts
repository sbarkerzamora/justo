import { createOpenAI } from "@ai-sdk/openai"

const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini"
const DEFAULT_NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
const DEFAULT_NVIDIA_MODEL = "nvidia/nemotron-3-super-120b-a12b"
const DEFAULT_NVIDIA_REASONING_BUDGET = 16384

const chatProviders = ["openrouter", "nvidia"] as const

type ChatProvider = (typeof chatProviders)[number]
type ChatProviderFetch = NonNullable<NonNullable<Parameters<typeof createOpenAI>[0]>["fetch"]>

const resolveChatProvider = (): ChatProvider => {
  const provider = process.env.AI_PROVIDER?.toLowerCase()
  return chatProviders.includes(provider as ChatProvider) ? (provider as ChatProvider) : "openrouter"
}

const requireEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const isEnabled = (value: string | undefined): boolean => value === "1" || value?.toLowerCase() === "true"

const numberFromEnv = (
  value: string | undefined,
  fallback: number,
  options: { min: number; max?: number; integer?: boolean },
): number => {
  const parsed = Number(value ?? fallback)
  const isValid =
    Number.isFinite(parsed) &&
    parsed >= options.min &&
    (options.max === undefined || parsed <= options.max) &&
    (!options.integer || Number.isInteger(parsed))

  return isValid ? parsed : fallback
}

const withNvidiaThinking =
  (reasoningBudget: number): ChatProviderFetch =>
  (async (input, init) => {
    if (typeof init?.body !== "string") {
      return fetch(input, init)
    }

    try {
      const body = JSON.parse(init.body) as Record<string, unknown>

      return fetch(input, {
        ...init,
        body: JSON.stringify({
          ...body,
          reasoning_budget: reasoningBudget,
          chat_template_kwargs: {
            enable_thinking: true,
          },
        }),
      })
    } catch {
      return fetch(input, init)
    }
  }) as ChatProviderFetch

export const getChatModelConfig = () => {
  const provider = resolveChatProvider()

  if (provider === "nvidia") {
    const reasoningBudget = numberFromEnv(process.env.NVIDIA_REASONING_BUDGET, DEFAULT_NVIDIA_REASONING_BUDGET, {
      min: 1,
      integer: true,
    })
    const nvidia = createOpenAI({
      name: "nvidia",
      apiKey: requireEnv("NVIDIA_API_KEY", process.env.NVIDIA_API_KEY),
      baseURL: process.env.NVIDIA_BASE_URL ?? DEFAULT_NVIDIA_BASE_URL,
      fetch: isEnabled(process.env.NVIDIA_THINKING_ENABLED)
        ? withNvidiaThinking(reasoningBudget)
        : undefined,
    })

    return {
      provider,
      model: nvidia.chat(process.env.NVIDIA_MODEL ?? DEFAULT_NVIDIA_MODEL),
      maxOutputTokens: numberFromEnv(process.env.NVIDIA_MAX_OUTPUT_TOKENS, 16384, { min: 1, integer: true }),
      temperature: numberFromEnv(process.env.NVIDIA_TEMPERATURE, 1, { min: 0, max: 2 }),
      topP: numberFromEnv(process.env.NVIDIA_TOP_P, 0.95, { min: 0, max: 1 }),
      providerOptions: undefined,
    }
  }

  const openrouter = createOpenAI({
    name: "openrouter",
    apiKey: requireEnv("OPENROUTER_API_KEY", process.env.OPENROUTER_API_KEY),
    baseURL: process.env.OPENROUTER_BASE_URL ?? DEFAULT_OPENROUTER_BASE_URL,
  })

  return {
    provider,
    model: openrouter.chat(process.env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL),
    providerOptions: undefined,
  }
}
