import React from 'react'
import type { Mode } from '../types'
import { MODES, MODE_KEYS } from '../modes'
import styles from './ModeBar.module.css'

interface ModeBarProps {
  active: Mode
  onChange: (mode: Mode) => void
}

export function ModeBar({ active, onChange }: ModeBarProps) {
  return (
    <nav className={styles.bar} aria-label="Assistant mode">
      {MODE_KEYS.map(key => (
        <button
          key={key}
          className={`${styles.btn} ${active === key ? styles.active : ''}`}
          onClick={() => onChange(key)}
          aria-pressed={active === key}
        >
          {MODES[key].emoji} {MODES[key].label}
        </button>
      ))}
    </nav>
  )
}
