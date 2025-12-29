// Learn more about clients at https://docs.boundaryml.com/docs/snippets/clients/overview

// OpenRouter clients (recommended - single API for all models)
client<llm> GEMINI_FLASH_2_5 {
  provider "openai-generic"
  retry_policy Constant
  options {
    base_url https://openrouter.ai/api/v1
    api_key env.OPENROUTER_API_KEY
    model "google/gemini-2.5-flash"
    max_tokens 16384
  }
}

client<llm> GEMINI_FLASH_2_5_LITE {
  provider "openai-generic"
  retry_policy Constant
  options {
    base_url https://openrouter.ai/api/v1
    api_key env.OPENROUTER_API_KEY
    model "google/gemini-2.5-flash-lite"
    max_tokens 16384
  }
}

client<llm> GEMINI_FLASH_3 {
  provider "openai-generic"
  retry_policy Constant
  options {
    base_url https://openrouter.ai/api/v1
    api_key env.OPENROUTER_API_KEY
    model "google/gemini-3-flash-preview"
    max_tokens 16384
  }
}

client<llm> CLAUDE_HAIKU_4_5 {
  provider "openai-generic"
  retry_policy Constant
  options {
    base_url https://openrouter.ai/api/v1
    api_key env.OPENROUTER_API_KEY
    model "anthropic/claude-haiku-4.5"
  }
}

client<llm> GPT_OSS_120B {
  provider "openai-generic"
  retry_policy Constant
  options {
    base_url https://openrouter.ai/api/v1
    api_key env.OPENROUTER_API_KEY
    model "openai/gpt-oss-120b"
    max_tokens 16384
  }
}

client<llm> CLAUDE_OPUS_4_5 {
  provider "openai-generic"
  retry_policy Constant
  options {
    base_url https://openrouter.ai/api/v1
    api_key env.OPENROUTER_API_KEY
    model "anthropic/claude-opus-4.5"
    max_tokens 16384
  }
}

// Fallback strategy: try Flash 3 first, then GPT-OSS-120B
client<llm> AdamFallback {
  provider fallback
  options {
    strategy [GEMINI_FLASH_3, GPT_OSS_120B]
  }
}

// https://docs.boundaryml.com/docs/snippets/clients/retry
retry_policy Constant {
  max_retries 3
  strategy {
    type constant_delay
    delay_ms 200
  }
}

retry_policy Exponential {
  max_retries 2
  strategy {
    type exponential_backoff
    delay_ms 300
    multiplier 1.5
    max_delay_ms 10000
  }
}
