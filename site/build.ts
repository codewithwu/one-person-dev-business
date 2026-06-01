import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { Marked } from 'marked'
import { chapters, parts } from './chapter-order.js'

const ROOT = dirname(import.meta.dirname ?? process.cwd())
const DOCS_DIR = join(ROOT, 'docs')
const SITE_DIR = join(ROOT, 'site')
const DIST_DIR = join(ROOT, 'dist')
const TEMPLATES_DIR = join(SITE_DIR, 'templates')
const STYLES_DIR = join(SITE_DIR, 'styles')
const ASSETS_DIR = join(SITE_DIR, 'assets')

const BASE = '/one-person-dev-business/'

// Initialize marked
const marked = new Marked()

// Custom renderer to add IDs to headings
const renderer = {
  heading({ text, depth }: { text: string; depth: number }) {
    const id = text
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w一-鿿]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
    return `<h${depth} id="${id}">${text}</h${depth}>`
  },
}

marked.use({ renderer })

// Read template files
function readTemplate(name: string): string {
  return readFileSync(join(TEMPLATES_DIR, name), 'utf-8')
}

// Ensure directory exists
function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

// Generate sidebar HTML for a specific chapter
function generateSidebar(currentSlug: string): string {
  let html = ''
  let currentPart = 0

  for (const ch of chapters) {
    if (ch.part !== currentPart) {
      currentPart = ch.part
      const part = parts.find(p => p.id === currentPart)!
      html += `<div class="sidebar-section">\n`
      html += `  <div class="sidebar-part-title">${part.name}</div>\n`
    }

    const isActive = ch.slug === currentSlug ? ' active' : ''
    const isForeword = ch.slug === '00-foreword' ? ' is-foreword' : ''
    html += `  <a href="${BASE}chapters/${ch.slug}/" class="sidebar-chapter${isActive}${isForeword}">${ch.displayTitle}</a>\n`

    // Check if next chapter is in a different part
    const idx = chapters.indexOf(ch)
    if (idx < chapters.length - 1 && chapters[idx + 1].part !== ch.part) {
      html += `</div>\n`
    }
  }
  html += `</div>\n`

  return html
}

// Generate prev/next links
function generateChapterNav(index: number): { prev: string; next: string } {
  let prev = '<div></div>'
  let next = '<div></div>'

  if (index > 0) {
    const ch = chapters[index - 1]
    prev = `
      <a href="${BASE}chapters/${ch.slug}/" class="chapter-nav-link prev">
        <span class="chapter-nav-label">上一章</span>
        <span class="chapter-nav-title">${ch.displayTitle}</span>
      </a>`
  }

  if (index < chapters.length - 1) {
    const ch = chapters[index + 1]
    next = `
      <a href="${BASE}chapters/${ch.slug}/" class="chapter-nav-link next">
        <span class="chapter-nav-label">下一章</span>
        <span class="chapter-nav-title">${ch.displayTitle}</span>
      </a>`
  }

  return { prev, next }
}

// Build chapter pages
function buildChapters() {
  const template = readTemplate('chapter.html')

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i]
    const mdPath = join(DOCS_DIR, ch.filename)

    if (!existsSync(mdPath)) {
      console.warn(`Warning: ${ch.filename} not found, skipping`)
      continue
    }

    const markdown = readFileSync(mdPath, 'utf-8')
    const content = marked.parse(markdown) as string

    const sidebar = generateSidebar(ch.slug)
    const { prev, next } = generateChapterNav(i)

    const html = template
      .replace(/\{\{base\}\}/g, BASE)
      .replace(/\{\{title\}\}/g, ch.displayTitle)
      .replace(/\{\{content\}\}/g, content)
      .replace(/\{\{part_id\}\}/g, String(ch.part))
      .replace(/\{\{part_name\}\}/g, ch.partName)
      .replace(/\{\{sidebar_html\}\}/g, sidebar)
      .replace(/\{\{prev_link\}\}/g, prev)
      .replace(/\{\{next_link\}\}/g, next)

    const outDir = join(DIST_DIR, 'chapters', ch.slug)
    ensureDir(outDir)
    writeFileSync(join(outDir, 'index.html'), html, 'utf-8')
    console.log(`  Built: chapters/${ch.slug}/`)
  }
}

// Build landing page
function buildLanding() {
  const template = readTemplate('index.html')

  // Generate parts overview
  let partsHtml = ''
  for (const part of parts) {
    const partChapters = chapters.filter(ch => ch.part === part.id)
    partsHtml += `<div class="part-section part-${part.id}">\n`
    partsHtml += `  <div class="part-header">\n`
    partsHtml += `    <span class="part-number">${part.id === 1 ? '壹' : part.id === 2 ? '贰' : part.id === 3 ? '叁' : '肆'}</span>\n`
    partsHtml += `    <div>\n`
    partsHtml += `      <div class="part-name">第${['一', '二', '三', '四'][part.id - 1]}部分：${part.name}</div>\n`
    partsHtml += `      <div class="part-subtitle">${part.subtitle}</div>\n`
    partsHtml += `    </div>\n`
    partsHtml += `  </div>\n`

    for (const ch of partChapters) {
      partsHtml += `  <a href="${BASE}chapters/${ch.slug}/" class="chapter-card">\n`
      partsHtml += `    <div class="chapter-card-title">${ch.displayTitle}</div>\n`
      partsHtml += `  </a>\n`
    }

    partsHtml += `</div>\n`
  }

  const html = template
    .replace(/\{\{base\}\}/g, BASE)
    .replace(/\{\{parts_html\}\}/g, partsHtml)

  writeFileSync(join(DIST_DIR, 'index.html'), html, 'utf-8')
  console.log('  Built: index.html')
}

// Build TOC page
function buildToc() {
  const template = readTemplate('toc.html')

  let tocHtml = ''
  for (const part of parts) {
    const partChapters = chapters.filter(ch => ch.part === part.id)
    tocHtml += `<div class="toc-part part-${part.id}">\n`
    tocHtml += `  <div class="toc-part-header">\n`
    tocHtml += `    <span class="toc-part-number">${['壹', '贰', '叁', '肆'][part.id - 1]}</span>\n`
    tocHtml += `    <span class="toc-part-name">第${['一', '二', '三', '四'][part.id - 1]}部分：${part.name}</span>\n`
    tocHtml += `  </div>\n`

    for (const ch of partChapters) {
      tocHtml += `  <a href="${BASE}chapters/${ch.slug}/" class="toc-chapter-link">\n`
      tocHtml += `    <span class="toc-chapter-title">${ch.displayTitle}</span>\n`
      tocHtml += `  </a>\n`
    }

    tocHtml += `</div>\n`
  }

  const html = template
    .replace(/\{\{base\}\}/g, BASE)
    .replace(/\{\{toc_html\}\}/g, tocHtml)

  writeFileSync(join(DIST_DIR, 'toc', 'index.html'), html, 'utf-8')
  console.log('  Built: toc/index.html')
}

// Copy and bundle CSS
function buildStyles() {
  const mainCss = readFileSync(join(STYLES_DIR, 'main.css'), 'utf-8')
  const typographyCss = readFileSync(join(STYLES_DIR, 'typography.css'), 'utf-8')
  const layoutCss = readFileSync(join(STYLES_DIR, 'layout.css'), 'utf-8')
  const componentsCss = readFileSync(join(STYLES_DIR, 'components.css'), 'utf-8')

  const combined = [mainCss, typographyCss, layoutCss, componentsCss].join('\n\n')

  ensureDir(join(DIST_DIR, 'assets'))
  writeFileSync(join(DIST_DIR, 'assets', 'main.css'), combined, 'utf-8')
  console.log('  Built: assets/main.css')
}

// Copy static assets
function copyAssets() {
  ensureDir(join(DIST_DIR, 'assets'))

  if (existsSync(join(ASSETS_DIR, 'favicon.svg'))) {
    cpSync(join(ASSETS_DIR, 'favicon.svg'), join(DIST_DIR, 'assets', 'favicon.svg'))
  }

  // Copy main.js
  if (existsSync(join(SITE_DIR, 'main.js'))) {
    cpSync(join(SITE_DIR, 'main.js'), join(DIST_DIR, 'assets', 'main.js'))
  }

  console.log('  Copied: assets/')
}

// Main build
console.log('Building site...\n')

ensureDir(DIST_DIR)
ensureDir(join(DIST_DIR, 'chapters'))
ensureDir(join(DIST_DIR, 'toc'))

buildStyles()
copyAssets()
buildChapters()
buildLanding()
buildToc()

console.log('\nDone! Output in dist/')
