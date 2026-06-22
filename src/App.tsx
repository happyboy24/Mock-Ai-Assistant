import React, { useState } from 'react'
import type { Mode } from './types'
import { useChat } from './hooks/useChat'
import { Header } from './components/Header'
import { ModeBar } from './components/ModeBar'
import { MessageList } from './components/MessageList'
import { InputBar } from './components/InputBar'
import { ErrorBanner } from './components/ErrorBanner'
import styles from './App.module.css'

export default function App() {
  const [mode, setMode] = useState<Mode>('General')
  const { messages, isLoading, error, tokenUsage, send, clear, clearError } = useChat()

  const handleSend = (text: string) => send(text, mode)

  return (
    <div className={styles.shell}>
      <div className={styles.window}>
        <Header onClear={clear} messages={messages} />
        <ModeBar active={mode} onChange={setMode} />
        {error && (
          <ErrorBanner message={error} onDismiss={clearError} />
        )}
        <MessageList messages={messages} isLoading={isLoading} />
        <InputBar mode={mode} isLoading={isLoading} tokenUsage={tokenUsage} onSend={handleSend} />
      </div>
    </div>
  )
}
