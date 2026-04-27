'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './DiagnosticsForm.module.css'

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  {
    label: 'Your Business',
    questions: [
      {
        id: 'workType',
        label: 'Type of Work',
        type: 'radio-grid' as const,
        options: ['Kitchens', 'Bathrooms', 'Additions', 'Whole Home Remodels'],
        cols: 3,
      },
      {
        id: 'projectSize',
        label: 'Typical Project Size',
        type: 'radio-grid' as const,
        options: ['Under $25,000', '$25–75,000', '$75–150,000', '$150,000+'],
        cols: 2,
      },
      {
        id: 'monthlyLeads',
        label: 'Approx. Monthly Leads',
        type: 'radio-grid' as const,
        options: ['< 10', '10–20', '20–50', '50+'],
        cols: 4,
      },
    ],
  },
  {
    label: 'Your Lead Sources',
    questions: [
      {
        id: 'leadSource',
        label: 'Where do most of your leads come from?',
        type: 'radio-grid' as const,
        options: ['Website / SEO', 'Referrals', 'Google Ads', 'Angi / HomeAdvisor', 'Social Media'],
        cols: 2,
      },
      {
        id: 'responseTime',
        label: 'How quickly do you typically respond to new leads?',
        type: 'radio-grid' as const,
        options: ['Within 1 hour', 'Same day', '1–2 days', '3+ days'],
        cols: 2,
      },
    ],
  },
  {
    label: 'Your Challenges',
    questions: [
      {
        id: 'biggestProblem',
        label: "What's your biggest lead problem?",
        type: 'radio-grid' as const,
        options: ['Too many tire-kickers', 'Not enough leads', 'Hard to follow up', "Leads don't respond"],
        cols: 2,
      },
      {
        id: 'followUp',
        label: 'What typically happens after a lead contacts you?',
        type: 'radio-grid' as const,
        options: ['We respond same day', 'We respond next day', 'Follow-up is inconsistent', 'We often miss leads'],
        cols: 2,
      },
    ],
  },
  {
    label: 'Your Contact Info',
    questions: [
      {
        id: 'firstName',
        label: 'First Name',
        type: 'text' as const,
        placeholder: 'John',
      },
      {
        id: 'companyName',
        label: 'Company Name',
        type: 'text' as const,
        placeholder: 'Acme Remodeling',
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email' as const,
        placeholder: 'john@acmeremodeling.com',
      },
    ],
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

type Answers = Record<string, string>

export function DiagnosticsForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitting, setSubmitting] = useState(false)

  const current = STEPS[step]
  const totalSteps = STEPS.length
  const isLastStep = step === totalSteps - 1

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function stepIsComplete() {
    return current.questions.every((q) => {
      if (q.type === 'radio-grid') return !!answers[q.id]
      return (answers[q.id] ?? '').trim().length > 0
    })
  }

  async function handleNext() {
    if (!stepIsComplete()) return
    if (isLastStep) {
      setSubmitting(true)
      // Store answers in sessionStorage for the results page
      sessionStorage.setItem('diagnosticAnswers', JSON.stringify(answers))
      router.push('/diagnostics/results')
      return
    }
    setStep((s) => s + 1)
  }

  return (
    <div className={styles.card}>
      {/* Card header */}
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>📋</span>
        <span className={styles.cardTitle}>Lead Flow Breakdown</span>
      </div>

      {/* Step indicator */}
      <div className={styles.stepBar}>
        <div
          className={styles.stepProgress}
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>
      <p className={styles.stepLabel}>
        Step {step + 1} of {totalSteps} — {current.label}
      </p>

      {/* Questions */}
      <div className={styles.questions}>
        {current.questions.map((q) => (
          <div key={q.id} className={styles.questionGroup}>
            <p className={styles.questionLabel}>{q.label}</p>

            {q.type === 'radio-grid' && (
              <div
                className={styles.radioGrid}
                style={{ '--cols': q.cols } as React.CSSProperties}
              >
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className={`${styles.radioOption} ${answers[q.id] === opt ? styles.selected : ''}`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswer(q.id, opt)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioCircle} />
                    <span className={styles.radioLabel}>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {(q.type === 'text' || q.type === 'email') && (
              <input
                type={q.type}
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder={(q as { placeholder?: string }).placeholder}
                className={styles.textInput}
              />
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className={styles.cta}
        onClick={handleNext}
        disabled={!stepIsComplete() || submitting}
      >
        {submitting ? 'Preparing your breakdown…' : 'See My Lead Flow Breakdown →'}
      </button>
      <p className={styles.ctaNote}>Takes 2–3 minutes. No spam. Just clarity.</p>
    </div>
  )
}
