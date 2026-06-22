import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import diff from 'highlight.js/lib/languages/diff'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import python from 'highlight.js/lib/languages/python'
import rust from 'highlight.js/lib/languages/rust'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('c', c)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('diff', diff)
hljs.registerLanguage('go', go)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('tsx', typescript)
hljs.registerLanguage('jsx', javascript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)

function highlightCode(lang: string, code: string): string {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
    } catch {
      // fall through to auto
    }
  }
  try {
    return hljs.highlightAuto(code).value
  } catch {
    return escapeHtml(code)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Markdown → HTML renderer with syntax-highlighted code blocks.
 */
export function renderMarkdown(text: string): string {
  // --- Step 1: Extract fenced code blocks before any escaping ---
  const blocks: string[] = []
  let src = text.replace(/```(\w*)\r?\n?([\s\S]*?)```/g, (_, lang, code) => {
    const langLabel = lang || ''
    const raw = code.trim()
    const highlighted = highlightCode(langLabel.toLowerCase(), raw)
    // Encode raw code safely for an HTML attribute (no backtick or NUL issues)
    const attrCode = raw
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    const langSpan = langLabel
      ? `<span class="code-lang">${escapeHtml(langLabel)}</span>`
      : '<span class="code-lang"></span>'
    const copyBtn = `<button class="code-copy-btn" data-code="${attrCode}" aria-label="Copy code">Copy</button>`
    const header = `<div class="code-header">${langSpan}${copyBtn}</div>`
    const block = `${header}<pre><code class="hljs${langLabel ? ` language-${escapeHtml(langLabel)}` : ''}">${highlighted}</code></pre>`
    blocks.push(block)
    return `\x00CODE${blocks.length - 1}\x00`
  })

  // --- Step 2: Escape remaining HTML ---
  src = escapeHtml(src)

  // --- Step 3: Restore highlighted code blocks ---
  src = src.replace(/\x00CODE(\d+)\x00/g, (_, i) => blocks[Number(i)])

  // --- Step 4: Inline code ---
  src = src.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>')

  // --- Step 5: Headings ---
  src = src.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  src = src.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  src = src.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // --- Step 6: Bold & italic ---
  src = src.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
  src = src.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  src = src.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  // --- Step 7: Unordered lists ---
  src = src.replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')
  src = src.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
  src = src.replace(/<\/ul>\s*<ul>/g, '')

  // --- Step 8: Ordered lists ---
  src = src.replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>')
  src = src.replace(/(<oli>[\s\S]*?<\/oli>)/g, '<ol>$1</ol>')
  src = src.replace(/<\/ol>\s*<ol>/g, '')
  src = src.replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>')

  // --- Step 9: Links ---
  src = src.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>'
  )

  // --- Step 10: Paragraphs ---
  const lines = src.split('\n')
  const result: string[] = []
  let inBlock = false

  for (const line of lines) {
    const isBlock = /^<(pre|ul|ol|h[1-6]|li|div)/.test(line.trim())
    if (isBlock) {
      inBlock = true
      result.push(line)
    } else if (line.trim() === '') {
      inBlock = false
      result.push('')
    } else {
      result.push(inBlock ? line : `<p>${line}</p>`)
    }
  }

  return result.join('\n')
}
