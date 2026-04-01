/**
 * Pretext Integration for Eclectic Hive
 * 
 * Text measurement and layout without DOM reflow.
 * Self-contained implementation based on chenglou/pretext.
 */

// =============================================================================
// Types
// =============================================================================

export interface PreparedText {
  text: string
  font: string
  widths: number[] // Width of each grapheme
  graphemes: string[]
  totalWidth: number
}

export interface PreparedTextWithSegments extends PreparedText {
  segments: Segment[]
}

export interface Segment {
  text: string
  graphemes: string[]
  widths: number[]
  start: number // Start index in full grapheme array
  isWhitespace: boolean
}

export interface Cursor {
  segmentIndex: number
  graphemeIndex: number
}

export interface LayoutResult {
  height: number
  lineCount: number
}

export interface Line {
  text: string
  width: number
  start: Cursor
  end: Cursor
}

export interface LayoutWithLinesResult extends LayoutResult {
  lines: Line[]
}

// =============================================================================
// Canvas Context (cached)
// =============================================================================

let canvasCtx: CanvasRenderingContext2D | null = null

function getCanvasContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null
  
  if (!canvasCtx) {
    const canvas = document.createElement('canvas')
    canvasCtx = canvas.getContext('2d')
  }
  return canvasCtx
}

// =============================================================================
// Font Utilities
// =============================================================================

export const FONTS = {
  serif: 'Playfair Display',
  sans: 'Inter',
} as const

export function createFontString(
  size: number,
  family: keyof typeof FONTS | string = 'serif',
  weight: number = 400,
  style: 'normal' | 'italic' = 'normal'
): string {
  const fontFamily = family in FONTS ? FONTS[family as keyof typeof FONTS] : family
  const styleStr = style === 'italic' ? 'italic ' : ''
  return `${styleStr}${weight} ${size}px ${fontFamily}`
}

export async function waitForFonts(): Promise<void> {
  if (typeof document === 'undefined') return
  await document.fonts.ready
}

export function getLineHeightPx(
  element: HTMLElement | null,
  fallbackFontSize: number = 16
): number {
  if (!element || typeof window === 'undefined') {
    return fallbackFontSize * 1.5
  }
  
  const computed = getComputedStyle(element)
  const lineHeight = computed.lineHeight
  
  if (lineHeight === 'normal') {
    return parseFloat(computed.fontSize) * 1.2
  }
  
  return parseFloat(lineHeight)
}

// =============================================================================
// Text Segmentation
// =============================================================================

function segmentText(text: string): string[] {
  // Use Intl.Segmenter for proper grapheme and word segmentation
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return Array.from(segmenter.segment(text), s => s.segment)
  }
  // Fallback: split by character (not ideal for emojis/CJK)
  return [...text]
}

function getWordSegments(text: string): Segment[] {
  const segments: Segment[] = []
  const graphemes = segmentText(text)
  
  let currentSegment: string[] = []
  let currentStart = 0
  let isWhitespace = false
  
  for (let i = 0; i < graphemes.length; i++) {
    const g = graphemes[i]
    const gIsWhitespace = /^\s$/.test(g)
    
    if (currentSegment.length === 0) {
      isWhitespace = gIsWhitespace
    }
    
    if (gIsWhitespace !== isWhitespace && currentSegment.length > 0) {
      // Segment boundary
      segments.push({
        text: currentSegment.join(''),
        graphemes: [...currentSegment],
        widths: [], // Will be filled by measureSegments
        start: currentStart,
        isWhitespace,
      })
      currentStart = i
      currentSegment = [g]
      isWhitespace = gIsWhitespace
    } else {
      currentSegment.push(g)
    }
  }
  
  // Push final segment
  if (currentSegment.length > 0) {
    segments.push({
      text: currentSegment.join(''),
      graphemes: [...currentSegment],
      widths: [],
      start: currentStart,
      isWhitespace,
    })
  }
  
  return segments
}

// =============================================================================
// Text Measurement
// =============================================================================

function measureGraphemes(graphemes: string[], font: string): number[] {
  const ctx = getCanvasContext()
  if (!ctx) return graphemes.map(() => 10) // Fallback
  
  ctx.font = font
  
  return graphemes.map(g => ctx.measureText(g).width)
}

function measureSegments(segments: Segment[], font: string): void {
  const ctx = getCanvasContext()
  if (!ctx) return
  
  ctx.font = font
  
  for (const segment of segments) {
    segment.widths = segment.graphemes.map(g => ctx.measureText(g).width)
  }
}

// =============================================================================
// Core API: prepare
// =============================================================================

export function prepare(text: string, font: string): PreparedText {
  const graphemes = segmentText(text)
  const widths = measureGraphemes(graphemes, font)
  const totalWidth = widths.reduce((sum, w) => sum + w, 0)
  
  return {
    text,
    font,
    widths,
    graphemes,
    totalWidth,
  }
}

export function prepareWithSegments(text: string, font: string): PreparedTextWithSegments {
  const base = prepare(text, font)
  const segments = getWordSegments(text)
  measureSegments(segments, font)
  
  return {
    ...base,
    segments,
  }
}

// =============================================================================
// Core API: layout
// =============================================================================

export function layout(
  prepared: PreparedText,
  maxWidth: number,
  lineHeight: number
): LayoutResult {
  const { graphemes, widths } = prepared
  
  if (graphemes.length === 0) {
    return { height: lineHeight, lineCount: 1 }
  }
  
  let lineCount = 1
  let currentLineWidth = 0
  let wordWidth = 0
  let wordStart = 0
  
  for (let i = 0; i < graphemes.length; i++) {
    const g = graphemes[i]
    const w = widths[i]
    const isWhitespace = /^\s$/.test(g)
    
    if (isWhitespace) {
      // End of word - check if word fits
      if (currentLineWidth + wordWidth > maxWidth && currentLineWidth > 0) {
        // Word doesn't fit, start new line
        lineCount++
        currentLineWidth = wordWidth + w
      } else {
        currentLineWidth += wordWidth + w
      }
      wordWidth = 0
      wordStart = i + 1
    } else {
      wordWidth += w
      
      // Check for forced break (word longer than line)
      if (wordWidth > maxWidth && currentLineWidth === 0) {
        // Break inside word
        lineCount++
        wordWidth = w
      }
    }
  }
  
  // Handle last word
  if (wordWidth > 0) {
    if (currentLineWidth + wordWidth > maxWidth && currentLineWidth > 0) {
      lineCount++
    }
  }
  
  return {
    height: lineCount * lineHeight,
    lineCount,
  }
}

export function layoutWithLines(
  prepared: PreparedTextWithSegments,
  maxWidth: number,
  lineHeight: number
): LayoutWithLinesResult {
  const { segments } = prepared
  const lines: Line[] = []
  
  if (segments.length === 0) {
    return { height: lineHeight, lineCount: 1, lines: [] }
  }
  
  let currentLine: string[] = []
  let currentLineWidth = 0
  let lineStartCursor: Cursor = { segmentIndex: 0, graphemeIndex: 0 }
  
  for (let si = 0; si < segments.length; si++) {
    const segment = segments[si]
    const segmentWidth = segment.widths.reduce((sum, w) => sum + w, 0)
    
    if (segment.isWhitespace) {
      // Add whitespace to current line if it fits
      if (currentLineWidth + segmentWidth <= maxWidth) {
        currentLine.push(segment.text)
        currentLineWidth += segmentWidth
      }
      // Otherwise skip trailing whitespace
      continue
    }
    
    // Non-whitespace segment (word)
    if (currentLineWidth + segmentWidth <= maxWidth) {
      // Word fits
      currentLine.push(segment.text)
      currentLineWidth += segmentWidth
    } else if (currentLineWidth === 0) {
      // Word is longer than maxWidth, force it on its own line
      currentLine.push(segment.text)
      currentLineWidth = segmentWidth
      
      // End this line
      lines.push({
        text: currentLine.join(''),
        width: currentLineWidth,
        start: lineStartCursor,
        end: { segmentIndex: si + 1, graphemeIndex: 0 },
      })
      currentLine = []
      currentLineWidth = 0
      lineStartCursor = { segmentIndex: si + 1, graphemeIndex: 0 }
    } else {
      // Word doesn't fit, start new line
      lines.push({
        text: currentLine.join('').trimEnd(),
        width: currentLineWidth,
        start: lineStartCursor,
        end: { segmentIndex: si, graphemeIndex: 0 },
      })
      
      currentLine = [segment.text]
      currentLineWidth = segmentWidth
      lineStartCursor = { segmentIndex: si, graphemeIndex: 0 }
    }
  }
  
  // Push final line
  if (currentLine.length > 0) {
    lines.push({
      text: currentLine.join('').trimEnd(),
      width: currentLineWidth,
      start: lineStartCursor,
      end: { segmentIndex: segments.length, graphemeIndex: 0 },
    })
  }
  
  return {
    height: lines.length * lineHeight,
    lineCount: lines.length,
    lines,
  }
}

// =============================================================================
// Advanced Layout: layoutNextLine
// =============================================================================

export function layoutNextLine(
  prepared: PreparedTextWithSegments,
  cursor: Cursor,
  maxWidth: number
): { text: string; width: number; end: Cursor } | null {
  const { segments } = prepared
  
  if (cursor.segmentIndex >= segments.length) {
    return null
  }
  
  const lineWords: string[] = []
  let lineWidth = 0
  let si = cursor.segmentIndex
  
  // Skip leading whitespace at start of line
  while (si < segments.length && segments[si].isWhitespace) {
    si++
  }
  
  while (si < segments.length) {
    const segment = segments[si]
    
    if (segment.isWhitespace) {
      const spaceWidth = segment.widths.reduce((sum, w) => sum + w, 0)
      if (lineWidth + spaceWidth <= maxWidth) {
        lineWords.push(segment.text)
        lineWidth += spaceWidth
      }
      si++
      continue
    }
    
    const wordWidth = segment.widths.reduce((sum, w) => sum + w, 0)
    
    if (lineWidth + wordWidth <= maxWidth) {
      lineWords.push(segment.text)
      lineWidth += wordWidth
      si++
    } else if (lineWidth === 0) {
      // Word too long, force it
      lineWords.push(segment.text)
      lineWidth = wordWidth
      si++
      break
    } else {
      // Word doesn't fit, end line
      break
    }
  }
  
  if (lineWords.length === 0) {
    return null
  }
  
  return {
    text: lineWords.join('').trimEnd(),
    width: lineWidth,
    end: { segmentIndex: si, graphemeIndex: 0 },
  }
}

// =============================================================================
// Utility: walkLineRanges
// =============================================================================

export function walkLineRanges(
  prepared: PreparedTextWithSegments,
  maxWidth: number,
  callback: (line: { text: string; start: Cursor; end: Cursor }) => void
): void {
  let cursor: Cursor = { segmentIndex: 0, graphemeIndex: 0 }
  
  while (cursor.segmentIndex < prepared.segments.length) {
    const line = layoutNextLine(prepared, cursor, maxWidth)
    if (!line) break
    
    callback({
      text: line.text,
      start: cursor,
      end: line.end,
    })
    
    cursor = line.end
  }
}

// =============================================================================
// Utility: findShrinkwrapWidth
// =============================================================================

export function findShrinkwrapWidth(
  prepared: PreparedText,
  maxWidth: number,
  lineHeight: number,
  targetLineCount?: number
): number {
  const initial = layout(prepared, maxWidth, lineHeight)
  const target = targetLineCount ?? initial.lineCount
  
  let lo = 1
  let hi = maxWidth
  
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    const result = layout(prepared, mid, lineHeight)
    
    if (result.lineCount <= target) {
      hi = mid
    } else {
      lo = mid + 1
    }
  }
  
  return lo
}

// =============================================================================
// Utility: findAdaptiveFontSize
// =============================================================================

export async function findAdaptiveFontSize(
  text: string,
  fontFamily: keyof typeof FONTS | string,
  maxWidth: number,
  lineHeight: number,
  minSize: number = 16,
  maxSize: number = 200,
  weight: number = 400,
  style: 'normal' | 'italic' = 'normal'
): Promise<{ fontSize: number; lineCount: number; height: number }> {
  await waitForFonts()
  
  let lo = minSize
  let hi = maxSize
  let bestResult = { fontSize: minSize, lineCount: 1, height: lineHeight }
  
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    const font = createFontString(mid, fontFamily, weight, style)
    const prepared = prepare(text, font)
    const scaledLineHeight = mid * (lineHeight / 16)
    const result = layout(prepared, maxWidth, scaledLineHeight)
    
    if (result.lineCount <= 3) {
      bestResult = { fontSize: mid, lineCount: result.lineCount, height: result.height }
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  
  return bestResult
}

// =============================================================================
// Async helpers
// =============================================================================

export async function prepareText(text: string, font: string): Promise<PreparedText> {
  await waitForFonts()
  return prepare(text, font)
}

export async function prepareTextWithSegments(text: string, font: string): Promise<PreparedTextWithSegments> {
  await waitForFonts()
  return prepareWithSegments(text, font)
}

export function layoutText(
  prepared: PreparedText,
  maxWidth: number,
  lineHeight: number
): LayoutResult {
  return layout(prepared, maxWidth, lineHeight)
}

export function layoutTextWithLines(
  prepared: PreparedTextWithSegments,
  maxWidth: number,
  lineHeight: number
): LayoutWithLinesResult {
  return layoutWithLines(prepared, maxWidth, lineHeight)
}

export async function preCalculateHeight(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number
): Promise<number> {
  const prepared = await prepareText(text, font)
  const result = layout(prepared, maxWidth, lineHeight)
  return result.height
}

// =============================================================================
// Cache management (simplified)
// =============================================================================

export function clearCache(): void {
  // Canvas context is lightweight, no need to clear
  canvasCtx = null
}
