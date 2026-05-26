import { createOpenAI } from "@ai-sdk/openai"

const DEFAULT_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini"
const DEFAULT_NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
const DEFAULT_NVIDIA_MODEL = "deepseek-ai/deepseek-v4-flash"
const DEFAULT_NVIDIA_REASONING_EFFORT = "high"

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

const withNvidiaChatTemplateKwargs =
  (reasoningEffort: string): ChatProviderFetch =>
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
          chat_template_kwargs: {
            thinking: true,
            reasoning_effort: reasoningEffort,
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
    const reasoningEffort = process.env.NVIDIA_REASONING_EFFORT ?? DEFAULT_NVIDIA_REASONING_EFFORT
    const nvidia = createOpenAI({
      name: "nvidia",
      apiKey: requireEnv("NVIDIA_API_KEY", process.env.NVIDIA_API_KEY),
      baseURL: process.env.NVIDIA_BASE_URL ?? DEFAULT_NVIDIA_BASE_URL,
      fetch: isEnabled(process.env.NVIDIA_THINKING_ENABLED)
        ? withNvidiaChatTemplateKwargs(reasoningEffort)
        : undefined,
    })

    return {
      provider,
      model: nvidia.chat(process.env.NVIDIA_MODEL ?? DEFAULT_NVIDIA_MODEL),
      maxOutputTokens: Number(process.env.NVIDIA_MAX_OUTPUT_TOKENS ?? 16384),
      temperature: Number(process.env.NVIDIA_TEMPERATURE ?? 1),
      topP: Number(process.env.NVIDIA_TOP_P ?? 0.95),
      providerOptions: {
        openai: {
          reasoningEffort,
        },
      },
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
  }
}
