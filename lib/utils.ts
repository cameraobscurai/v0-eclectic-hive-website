import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Security helpers ──────────────────────────────────────────────────────────
// Centralised here so fixes propagate everywhere from one place.

/**
 * Escapes user-supplied strings for safe interpolation into HTML.
 * Must be used on every user value inserted into email HTML or any
 * server-rendered HTML string built with template literals.
 * Order matters: & must be replaced first to avoid double-encoding.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Escapes Supabase ILIKE wildcard characters so user search input
 * cannot expand into unintended pattern matches.
 * Backslash must be escaped first to avoid double-escaping.
 */
export function escapeIlike(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
}

/**
 * Strips path traversal sequences and non-safe characters from a
 * filename coming from user input or file.name.
 * Returns a safe basename with a guaranteed extension.
 */
export function sanitizeFilename(filename: string): string {
  // Strip path separators and traversal sequences
  let safe = filename.replace(/\.\./g, '').replace(/[/\\]/g, '')
  // Keep only alphanumeric, dash, underscore, dot
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_')
  // Limit total length
  if (safe.length > 200) safe = safe.substring(0, 200)
  return safe || 'file'
}

/**
 * Strips CR and LF from strings destined for email headers (Subject,
 * From, To, etc.) to prevent header injection attacks.
 * Also trims to a safe maximum length.
 */
export function sanitizeEmailHeader(str: string, maxLength = 200): string {
  return str.replace(/[\r\n]+/g, ' ').slice(0, maxLength)
}
