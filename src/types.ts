export type Role = 'user' | 'assistant'

export interface Message {
  id: string
  role: Role
  content: string
  timestamp: Date
}

export type Mode = 'General' | 'Code' | 'Debug' | 'Review' | 'Explain' | 'Docs'

export interface ModeConfig {
  label: string
  emoji: string
  system: string
  placeholder: string
}
