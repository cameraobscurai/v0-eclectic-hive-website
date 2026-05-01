'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useInquiryStore } from '@/lib/inquiry-store'

// ─── Types ────────────────────────────────────────────────────────────────────

type ClientType = 'planner' | 'direct' | null
type EventType = 'wedding' | 'corporate' | 'social' | 'nonprofit' | null
type ServiceType = 'full-design' | 'production' | 'rental' | null
type BudgetRange =
  | 'under-10k'
  | '10-25k'
  | '25-50k'
  | '50-100k'
  | 'over-100k'
  | null

interface InquiryState {
  clientType: ClientType
  name: string
  email: string
  phone: string
  eventType: EventType
  serviceType: ServiceType
  eventDate: string
  budgetRange: BudgetRange
  vision: string
}

const TOTAL_STEPS = 3

// Step transition animation
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
  }),
}

const stepTransition = {
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
}

// ─── Honeypot ─────────────────────────────────────────────────────────────────
// Hidden field — bots fill it, humans don't. Silently reject on submit.

function Honeypot({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        position: 'absolute',
        left: '-9999px',
        opacity: 0,
        pointerEvents: 'none',
        height: 0,
        width: 0,
      }}
      aria-hidden="true"
    />
  )
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function StepLabel({ step }: { step: number }) {
  const labels = ['About you', 'Your event', 'Vision']
  return (
    <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40 mb-3">
      {labels[step - 1]}
    </p>
  )
}

function Question({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-light text-charcoal mb-10 leading-[1.1] tracking-[-0.01em]">
      {children}
    </h2>
  )
}

// Pill-style option — replaces the old boxy OptionButton
function PillOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left px-6 py-4 border transition-all duration-300 touch-manipulation rounded-[3px]',
        'text-sm tracking-[0.1em] uppercase',
        selected
          ? 'border-charcoal bg-charcoal text-cream'
          : 'border-charcoal/15 text-charcoal/70 hover:border-charcoal/40 hover:text-charcoal'
      )}
    >
      <span className="flex items-center justify-between gap-4">
        <span>{children}</span>
        {/* Dot indicator */}
        <span
          className={cn(
            'w-[18px] h-[18px] rounded-full border transition-all duration-300 shrink-0 flex items-center justify-center',
            selected
              ? 'border-cream/60 bg-cream/20'
              : 'border-charcoal/20'
          )}
        >
          {selected && (
            <span className="w-[7px] h-[7px] rounded-full bg-cream block" />
          )}
        </span>
      </span>
    </button>
  )
}

// Underline text input — editorial feel
function LineInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  autoFocus = false,
  error,
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  autoFocus?: boolean
  error?: string
  ariaLabel?: string
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={ariaLabel ?? placeholder}
        autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
        className={cn(
          'w-full bg-transparent pb-3 pt-1 min-h-[48px]',
          'font-display text-xl md:text-2xl font-light text-charcoal',
          'placeholder:text-charcoal/25 placeholder:font-light',
          'focus:outline-none transition-colors duration-300 touch-manipulation',
          'border-b',
          error
            ? 'border-red-400 focus:border-red-600'
            : 'border-charcoal/20 focus:border-charcoal'
        )}
      />
      {error && (
        <p className="text-[11px] text-red-500 mt-1.5 tracking-wide">{error}</p>
      )}
    </div>
  )
}

// Progress — three segments
function Progress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-14">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={cn(
            'h-px flex-1 transition-all duration-700 ease-out',
            s < step
              ? 'bg-charcoal'
              : s === step
              ? 'bg-charcoal/50'
              : 'bg-charcoal/10'
          )}
        />
      ))}
      <span className="text-[10px] tracking-[0.2em] text-charcoal/30 tabular-nums ml-2 shrink-0">
        {step} / {TOTAL_STEPS}
      </span>
    </div>
  )
}

// Nav row at bottom of each step
function StepNav({
  onBack,
  onNext,
  disabled,
  isFirst = false,
  isLast = false,
  submitting = false,
}: {
  onBack: () => void
  onNext: () => void
  disabled: boolean
  isFirst?: boolean
  isLast?: boolean
  submitting?: boolean
}) {
  return (
    <div className="flex items-center justify-between mt-12 pt-8 border-t border-charcoal/8">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className={cn(
          'text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 min-h-[44px] px-1 touch-manipulation',
          isFirst ? 'opacity-0 pointer-events-none' : 'text-charcoal/35 hover:text-charcoal'
        )}
      >
        Back
      </button>

      {/* Continue / Send */}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled || submitting}
        className={cn(
          'flex items-center gap-5 group transition-all duration-300 min-h-[44px] touch-manipulation',
          disabled || submitting
            ? 'opacity-25 cursor-not-allowed'
            : 'opacity-100'
        )}
      >
        <span className="flex items-center gap-2">
          {submitting && (
            <svg 
              className="w-3 h-3 animate-spin" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="3"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          <span
            className={cn(
              'text-[10px] uppercase tracking-[0.22em] text-charcoal transition-all duration-300',
              !disabled && !submitting && 'group-hover:tracking-[0.28em]'
            )}
          >
            {isLast
              ? submitting
                ? 'Sending'
                : 'Send inquiry'
              : 'Continue'}
          </span>
        </span>

        {/* Animated line */}
        <span className="flex items-center gap-0">
          <span
            className={cn(
              'h-px bg-charcoal transition-all duration-500',
              disabled || submitting
                ? 'w-6'
                : 'w-8 group-hover:w-12'
            )}
          />
          {/* Arrow tip */}
          <svg
            className="w-3 h-3 text-charcoal -ml-0.5"
            fill="none"
            viewBox="0 0 12 12"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2 6h8M6 2l4 4-4 4"
            />
          </svg>
        </span>
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export type InquiryItem = {
  id: string
  name: string
  quantity: number
  category?: string
  imageUrl?: string
}

interface InquiryFlowProps {
  onSuccess?: () => void
  preselectedItems?: InquiryItem[]
}

export function InquiryFlow({
  onSuccess,
  preselectedItems = [],
}: InquiryFlowProps) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0) // -1 = back, 1 = forward
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryState, string>>>({})
  const topRef = useRef<HTMLDivElement>(null)
  const lastSubmitRef = useRef<number>(0)

  // Format phone number as user types
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const { items: storeItems, clear: clearStore } = useInquiryStore()
  const cartItems = preselectedItems.length > 0 ? preselectedItems : storeItems

  const [state, setState] = useState<InquiryState>({
    clientType: null,
    name: '',
    email: '',
    phone: '',
    eventType: null,
    serviceType: null,
    eventDate: '',
    budgetRange: null,
    vision: '',
  })

  const set = <K extends keyof InquiryState>(key: K, value: InquiryState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }))

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  // ── Validation ──────────────────────────────────────────────────────────────

  function validateStep(s: number): boolean {
    const e: Partial<Record<keyof InquiryState, string>> = {}

    if (s === 1) {
      if (!state.name.trim() || state.name.trim().length < 2)
        e.name = 'Please enter your name'
      if (!state.email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        e.email = 'Valid email required'
      if (!state.phone.trim())
        e.phone = 'Phone number required'
    }

    if (s === 3) {
      if (state.vision.trim().length < 10)
        e.vision = 'Tell us a little more'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function advance() {
    if (!validateStep(step)) return
    if (step < TOTAL_STEPS) {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  function back() {
    if (step > 1) {
      setErrors({})
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!validateStep(step)) return

    // Honeypot check - silently reject bots
    if (honeypot) return

    // Client-side rate limit
    const now = Date.now()
    if (now - lastSubmitRef.current < 30_000) {
      setSubmitError('Please wait a moment before resubmitting.')
      return
    }
    lastSubmitRef.current = now

    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientType: state.clientType,
          name: state.name,
          email: state.email,
          phone: state.phone,
          eventType: state.eventType,
          serviceType: state.serviceType,
          eventDate: state.eventDate,
          budgetRange: state.budgetRange,
          vision: state.vision,
          company: '',
          location: '',
          items: cartItems.map((i) => ({
            id: i.id,
            name: i.name,
            category: i.category ?? '',
            quantity: i.quantity,
          })),
        }),
      })

      if (!res.ok) throw new Error('Failed')

      setSubmitted(true)
      clearStore()
      onSuccess?.()
    } catch {
      setSubmitError(
        'There was a problem sending your inquiry. Please email us directly at info@eclectichive.com'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success state ───────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <motion.div 
        className="min-h-[55vh] flex flex-col items-start justify-center max-w-2xl mx-auto px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated checkmark */}
        <motion.div 
          className="w-16 h-16 rounded-full border-2 border-charcoal/20 flex items-center justify-center mb-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <motion.svg 
            className="w-7 h-7 text-charcoal" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <motion.path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            />
          </motion.svg>
        </motion.div>

        <motion.p 
          className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Inquiry received
        </motion.p>

        <motion.h2 
          className="font-display text-4xl md:text-5xl font-light text-charcoal mb-6 leading-[1.05]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          We&apos;ll be<br />in touch.
        </motion.h2>

        <motion.p 
          className="text-charcoal/55 leading-relaxed mb-2 max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Thank you, {state.name.split(' ')[0]}. Every inquiry is reviewed personally —
          expect to hear from us within one business day.
        </motion.p>

        <motion.p 
          className="text-charcoal/35 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          In the meantime —{' '}
          <a
            href="/collection"
            className="underline underline-offset-4 hover:text-charcoal/70 transition-colors"
          >
            explore the collection
          </a>
          .
        </motion.p>
      </motion.div>
    )
  }

  // ── Steps ───────────────────────────────────────────────────────────────────

  return (
    <div
      ref={topRef}
      className={cn(
        'w-full max-w-2xl mx-auto px-6 py-16 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      )}
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <Progress step={step} />

      <AnimatePresence mode="wait" custom={direction}>
        {/* ── Step 1 — About you ─────────────────────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step-1"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={stepTransition}
          >
          <StepLabel step={1} />
          <Question>Who&apos;s reaching out?</Question>

          {/* Name + contact */}
          <div className="flex flex-col gap-8 mb-10">
            <LineInput
              value={state.name}
              onChange={(v) => set('name', v)}
              placeholder="Full name"
              autoFocus
              error={errors.name}
            />
            <LineInput
              value={state.email}
              onChange={(v) => set('email', v)}
              placeholder="Email address"
              type="email"
              error={errors.email}
            />
            <LineInput
              value={state.phone}
              onChange={(v) => set('phone', formatPhone(v))}
              placeholder="Phone"
              type="tel"
              error={errors.phone}
              ariaLabel="Phone number"
            />
          </div>

          {/* Planner / direct — optional context */}
          <div className="mb-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/35 mb-4">
              Are you an event planner?
            </p>
            <div className="flex gap-3">
              <PillOption
                selected={state.clientType === 'planner'}
                onClick={() => set('clientType', 'planner')}
              >
                Yes, I&apos;m a planner
              </PillOption>
              <PillOption
                selected={state.clientType === 'direct'}
                onClick={() => set('clientType', 'direct')}
              >
                No, direct client
              </PillOption>
            </div>
          </div>

          <StepNav
            onBack={back}
            onNext={advance}
            disabled={false}
            isFirst
          />
        </motion.div>
      )}

      {/* ── Step 2 — Your event ────────────────────────────────────────────── */}
      {step === 2 && (
        <motion.div
          key="step-2"
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={stepTransition}
        >
          <StepLabel step={2} />
          <Question>Tell us about the event.</Question>

          {/* Event type */}
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/35 mb-4">
              Type of event
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  ['wedding', 'Wedding'],
                  ['corporate', 'Corporate'],
                  ['social', 'Social celebration'],
                  ['nonprofit', 'Non-profit'],
                ] as [EventType, string][]
              ).map(([value, label]) => (
                <PillOption
                  key={value!}
                  selected={state.eventType === value}
                  onClick={() => set('eventType', value)}
                >
                  {label}
                </PillOption>
              ))}
            </div>
          </div>

          {/* Service */}
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/35 mb-4">
              What are you looking for?
            </p>
            <div className="flex flex-col gap-2.5">
              {(
                [
                  ['full-design', 'Full design + production'],
                  ['production', 'Production management only'],
                  ['rental', 'Rental collection access'],
                ] as [ServiceType, string][]
              ).map(([value, label]) => (
                <PillOption
                  key={value!}
                  selected={state.serviceType === value}
                  onClick={() => set('serviceType', value)}
                >
                  {label}
                </PillOption>
              ))}
            </div>
          </div>

          {/* Date + budget — inline, lighter weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-2">
            <LineInput
              value={state.eventDate}
              onChange={(v) => set('eventDate', v)}
              placeholder="Event date or timeframe"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/35 mb-3">
                Anticipated budget
              </p>
              <div className="flex flex-col gap-2">
                {(
                  [
                    ['under-10k', 'Under $10k'],
                    ['10-25k', '$10k – $25k'],
                    ['25-50k', '$25k – $50k'],
                    ['50-100k', '$50k – $100k'],
                    ['over-100k', '$100k+'],
                  ] as [BudgetRange, string][]
                ).map(([value, label]) => (
                  <button
                    key={value!}
                    type="button"
                    onClick={() => set('budgetRange', value)}
                    className={cn(
                      'text-left text-sm py-1.5 transition-all duration-200 tracking-[0.06em]',
                      state.budgetRange === value
                        ? 'text-charcoal font-medium'
                        : 'text-charcoal/35 hover:text-charcoal/70'
                    )}
                  >
                    {state.budgetRange === value ? '→ ' : ''}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <StepNav onBack={back} onNext={advance} disabled={false} />
        </motion.div>
      )}

      {/* ── Step 3 — Vision ────────────────────────────────────────────────── */}
      {step === 3 && (
        <motion.div
          key="step-3"
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={stepTransition}
        >
          <StepLabel step={3} />
          <Question>Describe your vision.</Question>

          {/* Cart summary if present */}
          {cartItems.length > 0 && (
            <div className="mb-10 border-l-2 border-charcoal/15 pl-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/40 mb-3">
                Selected from collection
              </p>
              <div className="flex flex-col gap-1.5">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-baseline gap-3">
                    {item.quantity > 1 && (
                      <span className="text-[10px] tracking-wide text-charcoal/40 tabular-nums w-6 shrink-0">
                        {item.quantity}×
                      </span>
                    )}
                    <span className="text-sm text-charcoal/65 tracking-[0.04em]">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vision textarea */}
          <div className="mb-2 relative">
            <textarea
              value={state.vision}
              onChange={(e) => set('vision', e.target.value)}
              placeholder="The feeling you're after, references, aesthetic direction — anything that helps us understand your world…"
              rows={5}
              autoFocus
              className={cn(
                'w-full bg-transparent border-b pb-3 resize-none',
                'font-display text-xl md:text-2xl font-light text-charcoal leading-relaxed',
                'placeholder:text-charcoal/20 placeholder:font-light placeholder:text-lg',
                'focus:outline-none transition-colors duration-300',
                errors.vision
                  ? 'border-red-400 focus:border-red-600'
                  : 'border-charcoal/20 focus:border-charcoal'
              )}
            />
            {errors.vision && (
              <p className="text-[11px] text-red-500 mt-1.5">{errors.vision}</p>
            )}
          </div>

          {/* Character count — light guidance */}
          <p className="text-[10px] text-charcoal/25 tracking-wide mt-2 text-right">
            {state.vision.length} / 2000
          </p>

          {/* Submit error */}
          {submitError && (
            <div className="mt-6 p-4 border border-red-200 rounded-sm bg-red-50">
              <p className="text-sm text-red-700 leading-relaxed">{submitError}</p>
            </div>
          )}

          <StepNav
            onBack={back}
            onNext={handleSubmit}
            disabled={state.vision.trim().length < 10}
            isLast
            submitting={submitting}
          />
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}
