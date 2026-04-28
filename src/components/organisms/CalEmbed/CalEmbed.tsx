'use client'

import { useEffect } from 'react'
import styles from './CalEmbed.module.css'

type Props = {
  calLink: string // e.g. "brian-francoeur/lead-flow-breakdown"
  namespace?: string
}

export function CalEmbed({ calLink, namespace = 'inline' }: Props) {
  useEffect(() => {
    const existing = document.querySelector('script[data-cal-embed]')
    if (existing) {
      initCal()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://app.cal.com/embed/embed.js'
    script.async = true
    script.setAttribute('data-cal-embed', 'true')
    script.onload = initCal
    document.head.appendChild(script)

    function initCal() {
      const win = window as unknown as Record<string, unknown>
      if (typeof win.Cal !== 'function') return

      const Cal = win.Cal as (action: string, ...args: unknown[]) => void

      Cal('init', namespace, { origin: 'https://app.cal.com' })
      Cal('inline', {
        elementOrSelector: `#cal-embed-${namespace}`,
        calLink,
        layout: 'month_view',
      })
      Cal('ui', {
        theme: 'light',
        styles: { branding: { brandColor: '#42597B' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    }
  }, [calLink, namespace])

  return <div id={`cal-embed-${namespace}`} className={styles.embed} />
}
