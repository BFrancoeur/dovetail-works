import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type BaseProps = {
  variant?: 'primary' | 'secondary' | 'outline-light' | 'outline-dark' | 'outline-teal'
  size?: 'md' | 'lg'
  children: React.ReactNode
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }
type ButtonAsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' }
type ButtonProps = ButtonAsButton | ButtonAsAnchor

export function Button({ variant = 'primary', size = 'md', children, as, ...rest }: ButtonProps) {
  const className = [
    styles.btn,
    styles[variant],
    styles[size],
    (rest as { className?: string }).className,
  ]
    .filter(Boolean)
    .join(' ')

  if (as === 'a') {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={className}>
        {children}
      </a>
    )
  }

  return (
    <button {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={className}>
      {children}
    </button>
  )
}
