import { Link } from 'react-router-dom'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <Link
      to={href}
      className={`skip-link ${className}`}
    >
      {children}
    </Link>
  )
}
