import React, { useEffect, useRef } from 'react'
import type { Message } from '../types'
import { renderMarkdown } from '../utils/markdown'
import styles from './MessageList.module.css'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

function TypingIndicator() {
  return (
    <div className={`${styles.msg} ${styles.ai}`}>
      <div className={`${styles.avatar} ${styles.avatarAi}`}>AI</div>
      <div className={`${styles.bubble} ${styles.bubbleAi}`}>
        <span className={styles.typing}>
          <span /><span /><span />
        </span>
      </div>
    </div>
  )
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Event delegation: handle all .code-copy-btn clicks in one listener
  useEffect(() => {
    const el = listRef.current
    if (!el) return

    const handler = (e: MouseEvent) => {
      const btn = (e.target as Element).closest('.code-copy-btn') as HTMLButtonElement | null
      if (!btn) return

      const code = btn.dataset.code ?? ''
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '✓ Copied'
        btn.classList.add('code-copy-btn--copied')
        setTimeout(() => {
          btn.textContent = 'Copy'
          btn.classList.remove('code-copy-btn--copied')
        }, 2000)
      }).catch(() => {
        btn.textContent = 'Failed'
        setTimeout(() => { btn.textContent = 'Copy' }, 2000)
      })
    }

    el.addEventListener('click', handler)
    return () => el.removeEventListener('click', handler)
  }, [])

  return (
    <div ref={listRef} className={styles.list} role="log" aria-live="polite" aria-label="Conversation">
      {messages.length === 0 && (
        <div className={styles.empty}>
          <p>👋 Hey! Ask me to write code, debug, review, or explain anything.</p>
        </div>
      )}

      {messages.map(msg => (
        <div
          key={msg.id}
          className={`${styles.msg} ${msg.role === 'user' ? styles.user : styles.ai}`}
        >
          <div className={`${styles.avatar} ${msg.role === 'user' ? styles.avatarUser : styles.avatarAi}`}>
            {msg.role === 'user' ? 'You' : 'AI'}
          </div>
          <div
            className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}
            dangerouslySetInnerHTML={
              msg.role === 'assistant'
                ? { __html: renderMarkdown(msg.content) }
                : undefined
            }
          >
            {msg.role === 'user' ? msg.content : undefined}
          </div>
        </div>
      ))}

      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
