import type { Message } from '../types'

export function exportAsMarkdown(messages: Message[]): void {
  const lines: string[] = ['# Dev Assistant — Conversation Export', '']
  for (const msg of messages) {
    const role = msg.role === 'user' ? '**You**' : '**Assistant**'
    const time = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    lines.push(`### ${role} · ${time}`, '', msg.content, '')
  }
  download(lines.join('\n'), 'conversation.md', 'text/markdown')
}

export function exportAsJSON(messages: Message[]): void {
  const data = messages.map(m => ({
    role: m.role,
    content: m.content,
    timestamp: m.timestamp.toISOString(),
  }))
  download(JSON.stringify(data, null, 2), 'conversation.json', 'application/json')
}

function download(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
