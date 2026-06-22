# Dev Assistant

An AI-powered coding assistant built with React + TypeScript, powered by the Claude API.

## Features

- 6 modes: General, Code, Debug, Review, Explain, Docs
- Full conversation history per session
- Markdown + syntax-highlighted code block rendering
- Dark mode support (follows system preference)
- Mobile responsive

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env.local
# Edit .env.local and set VITE_ANTHROPIC_API_KEY

# 3. Run dev server
npm run dev

# 4. Build for production
npm run build
```

## Get your API Key

Visit https://console.anthropic.com to get your Anthropic API key.

## Stack

- React 18 + TypeScript
- Vite
- CSS Modules
- Claude claude-sonnet-4-6 via Anthropic API
# Mock-Ai-Assistant
