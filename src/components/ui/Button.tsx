import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outline-light' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[4px] font-medium tracking-[0.01em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap select-none'

const variants: Record<Variant, string> = {
  primary: 'bg-ink-900 text-paper hover:bg-ink-700',
  secondary: 'border border-ink-900/80 text-ink-900 hover:bg-ink-900 hover:text-paper',
  ghost: 'text-ink-900 hover:bg-ink-900/5',
  light: 'bg-paper text-ink-900 hover:bg-white',
  'outline-light': 'border border-paper/50 text-paper hover:border-paper hover:bg-paper/10',
  danger: 'bg-bad text-white hover:bg-bad/90',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px]',
}

export const btnClass = (variant: Variant = 'primary', size: Size = 'md', extra = '') =>
  `${base} ${variants[variant]} ${sizes[size]} ${extra}`

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', className = '', type = 'button', ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={btnClass(variant, size, className)} {...rest} />
})

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={btnClass(variant, size, className)} {...rest} />
}
