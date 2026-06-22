import type { Mode, ModeConfig } from './types'

export const MODES: Record<Mode, ModeConfig> = {
  General: {
    label: 'General',
    emoji: '💬',
    placeholder: 'Ask me anything...',
    system:
      'You are a helpful, concise AI assistant. Answer clearly and helpfully. Use markdown formatting where appropriate.',
  },
  Code: {
    label: 'Code',
    emoji: '⌨️',
    placeholder: 'Describe what you want to build...',
    system:
      'You are an expert software engineer. Write clean, modern code. Prefer TypeScript, React, and modern JavaScript patterns. Always use fenced code blocks with language labels. Be concise and add brief comments where needed.',
  },
  Debug: {
    label: 'Debug',
    emoji: '🐛',
    placeholder: 'Paste your error or broken code...',
    system:
      'You are a debugging expert. Analyze the code or error message provided. Identify the root cause clearly, then provide a working fix with an explanation. Use code blocks for all code.',
  },
  Review: {
    label: 'Review',
    emoji: '🔍',
    placeholder: 'Paste the code you want reviewed...',
    system:
      'You are a senior engineer doing a thorough code review. Evaluate the code for: bugs, performance, security issues, readability, and adherence to best practices. Structure feedback with clear sections. Be specific and constructive.',
  },
  Explain: {
    label: 'Explain',
    emoji: '📖',
    placeholder: 'What do you want explained?',
    system:
      'You are a patient, clear teacher. Explain concepts in plain language, use analogies and real-world examples, and break things into digestible steps. Avoid unnecessary jargon. Use markdown for structure.',
  },
  Docs: {
    label: 'Docs',
    emoji: '📝',
    placeholder: 'Paste a function or module to document...',
    system:
      'You are a technical writer. Generate clear, well-structured documentation. Include: description, parameters with types, return values, and usage examples. Use markdown. Be thorough but concise.',
  },
}

export const MODE_KEYS = Object.keys(MODES) as Mode[]
