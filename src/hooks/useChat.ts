import { useState, useCallback } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import type { Message, Mode } from '../types'
import { MODES } from '../modes'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY as string,
  defaultHeaders: { 'anthropic-dangerous-direct-browser-access': 'true' },
})

export interface TokenUsage {
  inputTokens: number
  outputTokens: number
}

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  error: string | null
  tokenUsage: TokenUsage | null
  send: (text: string, mode: Mode) => Promise<void>
  clear: () => void
  clearError: () => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null)

  const send = useCallback(async (text: string, mode: Mode) => {
    if (!text.trim() || isLoading) return
    setError(null)

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    const history = [...messages, userMsg].map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: MODES[mode].system,
        messages: history,
      })

      const reply =
        response.content.find(b => b.type === 'text')?.text ?? 'No response received.'

      if (response.usage) {
        setTokenUsage({
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        })
      }

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  const clear = useCallback(() => {
    setMessages([])
    setError(null)
    setTokenUsage(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { messages, isLoading, error, tokenUsage, send, clear, clearError }
}
