'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

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
  company: string
  eventType: EventType
  serviceType: ServiceType
  eventDate: string
  location: string
  budgetRange: BudgetRange
  vision: string
  email: string
  phone: string
}

const TOTAL_STEPS = 7

// ─── Primitives ───────────────────────────────────────────────────────────────

function Question({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-light uppercase tracking-[0.2em] text-charcoal mb-10 leading-tight text-balance">
      {children}
    </h2>
  )
}

function OptionButton({
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
        'w-full text-left px-6 py-5 border transition-all duration-300',
        'text-sm uppercase tracking-[0.15em]',
        selected
          ? 'border-charcoal bg-charcoal text-cream'
          : 'border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal/5'
      )}
    >
      <span className="flex items-center justify-between">
        {children}
        <span
          className={cn(
            'w-4 h-4 rounded-full border transition-all duration-300 shrink-0',
            selected
              ? 'border-cream bg-cream/20'
              : 'border-charcoal/30 hover:border-charcoal'
          )}
        />
      </span>
    </button>
  )
}

function LineInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  autoFocus = false,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  autoFocus?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={cn(
        'w-full bg-transparent border-b border-charcoal/30 pb-3',
        'font-display text-xl font-normal text-charcoal placeholder:text-charcoal/30',
        'focus:outline-none focus:border-charcoal transition-colors duration-300'
      )}
    />
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs tracking-[0.2em] uppercase text-charcoal/40 hover:text-charcoal transition-colors"
    >
      Back
    </button>
  )
}

function NextButton({
  onClick,
  disabled,
  label = 'Continue',
}: {
  onClick: () => void
  disabled: boolean
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-4 text-sm uppercase tracking-[0.2em] transition-all duration-300',
        disabled
          ? 'text-charcoal/20 cursor-not-allowed'
          : 'text-charcoal hover:gap-6'
      )}
    >
      {label}
      <span className="w-8 h-px bg-current" />
    </button>
  )
}

function StepActions({
  onBack,
  onNext,
  disabled,
  isLast = false,
  submitting = false,
}: {
  onBack: () => void
  onNext: () => void
  disabled: boolean
  isLast?: boolean
  submitting?: boolean
}) {
  return (
    <div className="flex items-center gap-6 mt-10">
      <BackButton onClick={onBack} />
      <NextButton
        onClick={onNext}
        disabled={disabled || submitting}
        label={
          isLast ? (submitting ? 'Sending…' : 'Send inquiry') : 'Continue'
        }
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InquiryFlow({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<InquiryState>({
    clientType: null,
    name: '',
    company: '',
    eventType: null,
    serviceType: null,
    eventDate: '',
    location: '',
    budgetRange: null,
    vision: '',
    email: '',
    phone: '',
  })

  const set = <K extends keyof InquiryState>(
    key: K,
    value: InquiryState[K]
  ) => setState((prev) => ({ ...prev, [key]: value }))

  // Scroll form top into view on each step change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return state.clientType !== null
      case 2: return state.name.trim().length > 1
      case 3: return state.eventType !== null
      case 4: return state.serviceType !== null
      case 5:
        return (
          state.eventDate.trim().length > 0 &&
          state.location.trim().length > 0
        )
      case 6: return state.budgetRange !== null
      case 7:
        return (
          state.email.trim().includes('@') &&
          state.vision.trim().length > 10
        )
      default: return false
    }
  }

  const advance = () => {
    if (canAdvance() && step < TOTAL_STEPS) setStep((s) => s + 1)
  }

  const back = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  // Enter key advances from any text step
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canAdvance() && step < TOTAL_STEPS) advance()
  }

  const handleSubmit = async () => {
    if (!canAdvance()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
      onSuccess?.()
    } catch {
      setError(
        'Something went wrong — please email hello@eclectichive.com directly.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ── Progress bar ──────────────────────────────────────────────────────────

  const ProgressBar = () => (
    <div className="flex items-center gap-3 mb-16">
      <div className="flex-1 h-px bg-charcoal/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-charcoal transition-all duration-700 ease-out"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
      <span className="text-xs tracking-[0.2em] text-charcoal/40 tabular-nums">
        {step}/{TOTAL_STEPS}
      </span>
    </div>
  )

  // ── Success ───────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-px h-16 bg-charcoal/20 mb-12" />
        <h2 className="font-display text-3xl md:text-4xl font-light uppercase tracking-[0.2em] text-charcoal mb-6">
          We&apos;ll Be In Touch
        </h2>
        <p className="text-charcoal/60 max-w-md mb-4">
          Thank you, {state.name.split(' ')[0]}. We review every inquiry
          personally and typically respond within one business day.
        </p>
        <p className="text-charcoal/40 text-sm">
          In the meantime, explore{' '}
          <a
            href="/gallery"
            className="underline underline-offset-4 hover:text-charcoal transition-colors"
          >
            The Gallery
          </a>
          .
        </p>
      </div>
    )
  }

  // ── Steps ─────────────────────────────────────────────────────────────────

  return (
    <div
      ref={topRef}
      className="w-full max-w-2xl mx-auto px-6 py-16"
      onKeyDown={handleKeyDown}
    >
      <ProgressBar />

      {/* Step 1 — Who's reaching out */}
      {step === 1 && (
        <div>
          <Question>Who&apos;s reaching out?</Question>
          <div className="flex flex-col gap-3">
            <OptionButton
              selected={state.clientType === 'planner'}
              onClick={() => set('clientType', 'planner')}
            >
              I&apos;m an event planner or creative partner
            </OptionButton>
            <OptionButton
              selected={state.clientType === 'direct'}
              onClick={() => set('clientType', 'direct')}
            >
              I&apos;m planning my own event
            </OptionButton>
          </div>
          <div className="mt-10">
            <NextButton onClick={advance} disabled={!canAdvance()} />
          </div>
        </div>
      )}

      {/* Step 2 — Name (+ company for planners) */}
      {step === 2 && (
        <div>
          <Question>
            {state.clientType === 'planner'
              ? 'Your name and studio.'
              : 'Your name.'}
          </Question>
          <div className="flex flex-col gap-8">
            <LineInput
              value={state.name}
              onChange={(v) => set('name', v)}
              placeholder="Full name"
              autoFocus
            />
            {state.clientType === 'planner' && (
              <LineInput
                value={state.company}
                onChange={(v) => set('company', v)}
                placeholder="Studio or company name"
              />
            )}
          </div>
          <StepActions
            onBack={back}
            onNext={advance}
            disabled={!canAdvance()}
          />
        </div>
      )}

      {/* Step 3 — Event type */}
      {step === 3 && (
        <div>
          <Question>What kind of event?</Question>
          <div className="flex flex-col gap-3">
            {(
              [
                ['wedding', 'Wedding'],
                ['corporate', 'Corporate / Incentive Travel'],
                ['social', 'Social Celebration'],
                ['nonprofit', 'Non-Profit / Fundraiser'],
              ] as [EventType, string][]
            ).map(([value, label]) => (
              <OptionButton
                key={value}
                selected={state.eventType === value}
                onClick={() => set('eventType', value)}
              >
                {label}
              </OptionButton>
            ))}
          </div>
          <StepActions
            onBack={back}
            onNext={advance}
            disabled={!canAdvance()}
          />
        </div>
      )}

      {/* Step 4 — Service type */}
      {step === 4 && (
        <div>
          <Question>What are you looking for?</Question>
          <div className="flex flex-col gap-3">
            <OptionButton
              selected={state.serviceType === 'full-design'}
              onClick={() => set('serviceType', 'full-design')}
            >
              Full design + production
            </OptionButton>
            <OptionButton
              selected={state.serviceType === 'production'}
              onClick={() => set('serviceType', 'production')}
            >
              Production management only
            </OptionButton>
            <OptionButton
              selected={state.serviceType === 'rental'}
              onClick={() => set('serviceType', 'rental')}
            >
              Rental collection access
            </OptionButton>
          </div>
          <StepActions
            onBack={back}
            onNext={advance}
            disabled={!canAdvance()}
          />
        </div>
      )}

      {/* Step 5 — Date + location */}
      {step === 5 && (
        <div>
          <Question>When and where?</Question>
          <div className="flex flex-col gap-10">
            <LineInput
              value={state.eventDate}
              onChange={(v) => set('eventDate', v)}
              placeholder="Event date or general timeframe"
              autoFocus
            />
            <LineInput
              value={state.location}
              onChange={(v) => set('location', v)}
              placeholder="City, venue, or destination"
            />
          </div>
          <StepActions
            onBack={back}
            onNext={advance}
            disabled={!canAdvance()}
          />
        </div>
      )}

      {/* Step 6 — Budget */}
      {step === 6 && (
        <div>
          <Question>Investment range?</Question>
          <p className="text-charcoal/50 text-sm -mt-6 mb-8">
            This helps us understand scope. All ranges are welcome.
          </p>
          <div className="flex flex-col gap-3">
            {(
              [
                ['under-10k', 'Under $10,000'],
                ['10-25k', '$10,000 – $25,000'],
                ['25-50k', '$25,000 – $50,000'],
                ['50-100k', '$50,000 – $100,000'],
                ['over-100k', '$100,000+'],
              ] as [BudgetRange, string][]
            ).map(([value, label]) => (
              <OptionButton
                key={value}
                selected={state.budgetRange === value}
                onClick={() => set('budgetRange', value)}
              >
                {label}
              </OptionButton>
            ))}
          </div>
          <StepActions
            onBack={back}
            onNext={advance}
            disabled={!canAdvance()}
          />
        </div>
      )}

      {/* Step 7 — Vision + contact details */}
      {step === 7 && (
        <div>
          <Question>Tell us about your vision.</Question>
          <div className="flex flex-col gap-10">
            <textarea
              value={state.vision}
              onChange={(e) => set('vision', e.target.value)}
              placeholder="The feeling you're after, references, anything that helps us understand your world…"
              rows={4}
              autoFocus
              className={cn(
                'w-full bg-transparent border-b border-charcoal/30 pb-3 resize-none',
                'text-charcoal placeholder:text-charcoal/30',
                'focus:outline-none focus:border-charcoal transition-colors duration-300'
              )}
            />
            <LineInput
              value={state.email}
              onChange={(v) => set('email', v)}
              placeholder="Email address"
              type="email"
            />
            <LineInput
              value={state.phone}
              onChange={(v) => set('phone', v)}
              placeholder="Phone (optional)"
              type="tel"
            />
          </div>

          {error && (
            <p className="mt-6 text-sm text-red-700">{error}</p>
          )}

          <StepActions
            onBack={back}
            onNext={handleSubmit}
            disabled={!canAdvance()}
            isLast
            submitting={submitting}
          />
        </div>
      )}
    </div>
  )
}
