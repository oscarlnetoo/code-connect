import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Button } from '../atoms/Button'
import { Checkbox } from '../atoms/Checkbox'
import { FormField } from '../molecules/FormField'

export type RegisterValues = {
  name: string
  email: string
  password: string
  remember: boolean
}

type RegisterFormProps = {
  onSubmit: (values: RegisterValues) => void
  /** Form-level error, e.g. returned by the API. */
  error?: string
  submitting?: boolean
}

type Errors = Partial<Record<'name' | 'email' | 'password', string>>

const REQUIRED = 'Campo obrigatório'
const INVALID_EMAIL = 'Email inválido'
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
// Mirrors the API's CreateUserDto password rule.
const PASSWORD_MIN_LENGTH = 8
const SHORT_PASSWORD = `A senha deve ter ao menos ${PASSWORD_MIN_LENGTH} caracteres`

export function RegisterForm({
  onSubmit,
  error,
  submitting = false,
}: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    const nextErrors: Errors = {}
    if (!trimmedName) nextErrors.name = REQUIRED
    if (!trimmedEmail) nextErrors.email = REQUIRED
    else if (!EMAIL_PATTERN.test(trimmedEmail)) nextErrors.email = INVALID_EMAIL
    if (!password) nextErrors.password = REQUIRED
    else if (password.length < PASSWORD_MIN_LENGTH)
      nextErrors.password = SHORT_PASSWORD
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ name: trimmedName, email: trimmedEmail, password, remember })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FormField
        label="Nome"
        name="name"
        autoComplete="name"
        placeholder="Nome completo"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={errors.name}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={errors.email}
      />
      <FormField
        label="Senha"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.password}
      />
      <Checkbox
        label="Lembrar-me"
        checked={remember}
        onChange={(event) => setRemember(event.target.checked)}
      />
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={submitting}
        aria-busy={submitting || undefined}
        icon={<span aria-hidden="true">→</span>}
      >
        Cadastrar
      </Button>
    </form>
  )
}
