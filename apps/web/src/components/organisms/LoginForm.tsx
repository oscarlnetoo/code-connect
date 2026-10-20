import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Button } from '../atoms/Button'
import { Checkbox } from '../atoms/Checkbox'
import { TextLink } from '../atoms/TextLink'
import { FormField } from '../molecules/FormField'

export type LoginValues = {
  identifier: string
  password: string
  remember: boolean
}

type LoginFormProps = {
  onSubmit: (values: LoginValues) => void
}

type Errors = Partial<Record<'identifier' | 'password', string>>

const REQUIRED = 'Campo obrigatório'

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: Errors = {}
    if (!identifier.trim()) nextErrors.identifier = REQUIRED
    if (!password) nextErrors.password = REQUIRED
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ identifier: identifier.trim(), password, remember })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FormField
        label="Email ou usuário"
        name="identifier"
        autoComplete="username"
        placeholder="Digite seu email ou usuário"
        value={identifier}
        onChange={(event) => setIdentifier(event.target.value)}
        error={errors.identifier}
      />
      <FormField
        label="Senha"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.password}
      />
      <div className="flex items-center justify-between">
        <Checkbox
          label="Lembrar-me"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
        />
        <TextLink to="/forgot-password" className="text-sm">
          Esqueci a senha
        </TextLink>
      </div>
      <Button type="submit" icon={<span aria-hidden="true">→</span>}>
        Login
      </Button>
    </form>
  )
}
