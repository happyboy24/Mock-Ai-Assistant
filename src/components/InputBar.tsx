import React, { useRef, useState, useCallback } from 'react'
import type { Mode } from '../types'
import type { TokenUsage } from '../hooks/useChat'
import { MODES } from '../modes'
import { TokenCounter } from './TokenCounter'
import styles from './InputBar.module.css'

interface InputBarProps {
  mode: Mode
  isLoading: boolean
  tokenUsage: TokenUsage | null
  onSend: (text: string) => void
}

export function InputBar({ mode, isLoading, tokenUsage, onSend }: InputBarProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const text = value.trim()
    if (!text || isLoading) return
    onSend(text)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, isLoading, onSend])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={MODES[mode].placeholder}
          rows={1}
          aria-label="Message input"
          disabled={isLoading}
        />
        <button
          className={styles.send}
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
      <div className={styles.footer}>
        <p className={styles.hint}>Enter to send · Shift+Enter for new line</p>
        {tokenUsage && <TokenCounter usage={tokenUsage} />}
      </div>
    </div>
  )
}
