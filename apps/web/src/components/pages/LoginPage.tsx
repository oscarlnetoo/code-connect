import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getErrorMessage } from '../../services/apiError'
import { login } from '../../services/auth'
import { saveToken } from '../../services/tokenStorage'
import { TextLink } from '../atoms/TextLink'
import { LoginForm } from '../organisms/LoginForm'
import type { LoginValues } from '../organisms/LoginForm'
import { SocialLogin } from '../organisms/SocialLogin'
import { AuthLayout } from '../templates/AuthLayout'

const providers = [
  { name: 'Github', logo: '/github.png' },
  { name: 'Gmail', logo: '/gmail.png' },
]

const LOGIN_ERRORS = {
  400: 'Informe um email válido',
  401: 'Email ou senha inválidos',
}

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit({ identifier, password, remember }: LoginValues) {
    setError(undefined)
    setSubmitting(true)
    try {
      // The API only accepts emails as the login identifier.
      const { accessToken } = await login({ email: identifier, password })
      saveToken(accessToken, remember)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err, LOGIN_ERRORS))
    } finally {
      setSubmitting(false)
    }
  }

  function handleSocialSelect(name: string) {
    console.info('social login selected', name)
  }

  return (
    <AuthLayout
      banner={{ src: '/banner-login.png', alt: 'Banner do Code Connect' }}
      title="Login"
      subtitle="Boas-vindas! Faça seu login."
      footer={
        <>
          Ainda não tem conta?{' '}
          <TextLink to="/register">Crie seu cadastro!</TextLink>
        </>
      }
    >
      <LoginForm
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      />
      <SocialLogin providers={providers} onSelect={handleSocialSelect} />
    </AuthLayout>
  )
}
