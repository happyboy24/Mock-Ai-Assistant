import { useState, useCallback } from 'react'
import type { Message, Mode } from '../types'
import { MODES } from '../modes'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string

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
      role: m.role,
      content: m.content,
    }))

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: MODES[mode].system,
          messages: history,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error?.message || `API error ${res.status}`)
      }

      const data = await res.json()
      const reply =
        data.content?.find((b: { type: string }) => b.type === 'text')?.text ??
        'No response received.'

      if (data.usage) {
        setTokenUsage({
          inputTokens: data.usage.input_tokens ?? 0,
          outputTokens: data.usage.output_tokens ?? 0,
        })
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMsg])
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

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { messages, isLoading, error, tokenUsage, send, clear, clearError }
}
