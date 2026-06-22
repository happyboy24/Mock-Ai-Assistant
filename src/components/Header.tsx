import React, { useState, useRef, useEffect } from 'react'
import type { Message } from '../types'
import { exportAsMarkdown, exportAsJSON } from '../utils/export'
import styles from './Header.module.css'

interface HeaderProps {
  onClear: () => void
  messages: Message[]
}

export function Header({ onClear, messages }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleExport = (format: 'md' | 'json') => {
    setOpen(false)
    if (format === 'md') exportAsMarkdown(messages)
    else exportAsJSON(messages)
  }

  return (
    <header className={styles.header}>
      <span className={styles.dot} aria-hidden="true" />
      <div className={styles.info}>
        <h1 className={styles.title}>Dev Assistant</h1>
        <p className={styles.sub}>Powered by Claude · Ask me anything</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.exportWrap} ref={menuRef}>
          <button
            className={styles.exportBtn}
            onClick={() => setOpen(o => !o)}
            disabled={messages.length === 0}
            title="Export conversation"
            aria-label="Export conversation"
          >
            ↓ Export
          </button>
          {open && (
            <div className={styles.menu} role="menu">
              <button className={styles.menuItem} role="menuitem" onClick={() => handleExport('md')}>
                📄 Markdown (.md)
              </button>
              <button className={styles.menuItem} role="menuitem" onClick={() => handleExport('json')}>
                🗂 JSON (.json)
              </button>
            </div>
          )}
        </div>

        <button
          className={styles.clearBtn}
          onClick={onClear}
          title="Clear conversation"
          aria-label="Clear conversation"
        >
          ↺ Clear
        </button>
      </div>
    </header>
  )
}
