import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { AlertCircle, ChevronDown } from 'lucide-react'

const control =
  'w-full rounded-[4px] border bg-white px-3.5 text-[15px] text-ink-900 placeholder:text-steel-400 transition-colors focus:outline-none focus:ring-2 focus:ring-ink-900/10 disabled:bg-paper-2'
const ok = 'border-line hover:border-steel-300 focus:border-ink-900'
const bad = 'border-bad focus:border-bad'

interface Wrap {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  className?: string
  children: (id: string, describedBy?: string) => ReactNode
}

export function FieldWrap({ label, error, hint, optional, className = '', children }: Wrap) {
  const id = useId()
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-ink-800">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-steel-500">Optional</span>}
      </label>
      {children(id, describedBy)}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-[13px] text-bad">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-steel-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type Common = { label: string; error?: string; hint?: string; optional?: boolean; wrapClass?: string }

export function TextField({ label, error, hint, optional, wrapClass, className = '', ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldWrap label={label} error={error} hint={hint} optional={optional} className={wrapClass}>
      {(id, d) => (
        <input id={id} aria-invalid={!!error} aria-describedby={d} className={`${control} h-12 ${error ? bad : ok} ${className}`} {...rest} />
      )}
    </FieldWrap>
  )
}

export function TextArea({ label, error, hint, optional, wrapClass, className = '', ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldWrap label={label} error={error} hint={hint} optional={optional} className={wrapClass}>
      {(id, d) => (
        <textarea id={id} aria-invalid={!!error} aria-describedby={d} rows={4} className={`${control} py-3 leading-relaxed ${error ? bad : ok} ${className}`} {...rest} />
      )}
    </FieldWrap>
  )
}

export function SelectField({
  label,
  error,
  hint,
  optional,
  wrapClass,
  className = '',
  options,
  placeholder,
  ...rest
}: Common & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly (string | { value: string; label: string })[]; placeholder?: string }) {
  return (
    <FieldWrap label={label} error={error} hint={hint} optional={optional} className={wrapClass}>
      {(id, d) => (
        <div className="relative">
          <select id={id} aria-invalid={!!error} aria-describedby={d} className={`${control} h-12 appearance-none pr-10 ${error ? bad : ok} ${className}`} {...rest}>
            {placeholder !== undefined && <option value="">{placeholder}</option>}
            {options.map((o) => {
              const v = typeof o === 'string' ? o : o.value
              const l = typeof o === 'string' ? o : o.label
              return (
                <option key={v} value={v}>
                  {l}
                </option>
              )
            })}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-steel-500" />
        </div>
      )}
    </FieldWrap>
  )
}

/** Segmented radio group */
export function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
  error,
  className = '',
}: {
  label: string
  value: T | ''
  onChange: (v: T) => void
  options: readonly T[]
  error?: string
  className?: string
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-1.5 text-[13px] font-medium text-ink-800">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={`h-10 rounded-[4px] border px-3.5 text-sm transition-colors ${
              value === o ? 'border-ink-900 bg-ink-900 text-paper' : 'border-line bg-white text-ink-800 hover:border-steel-400'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-bad">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}
    </fieldset>
  )
}
