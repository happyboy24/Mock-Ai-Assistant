import React from 'react'
import type { TokenUsage } from '../hooks/useChat'
import styles from './TokenCounter.module.css'

const CONTEXT_WINDOW = 200_000

interface TokenCounterProps {
  usage: TokenUsage
}

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export function TokenCounter({ usage }: TokenCounterProps) {
  const total = usage.inputTokens + usage.outputTokens
  const pct = Math.min((usage.inputTokens / CONTEXT_WINDOW) * 100, 100)

  const level =
    pct >= 85 ? 'danger' :
    pct >= 60 ? 'warn' :
    'ok'

  return (
    <div className={styles.wrap} title={`Input: ${usage.inputTokens.toLocaleString()} tokens · Output: ${usage.outputTokens.toLocaleString()} tokens · Context window: ${CONTEXT_WINDOW.toLocaleString()} tokens`}>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${styles[level]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`${styles.label} ${styles[level]}`}>
        {fmt(usage.inputTokens)} / {fmt(CONTEXT_WINDOW)} ctx
        {usage.outputTokens > 0 && (
          <span className={styles.out}> · {fmt(usage.outputTokens)} out</span>
        )}
      </span>
    </div>
  )
}
