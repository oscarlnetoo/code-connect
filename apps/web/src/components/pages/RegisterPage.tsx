import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getErrorMessage } from '../../services/apiError'
import { login, registerUser } from '../../services/auth'
import { saveToken } from '../../services/tokenStorage'
import { TextLink } from '../atoms/TextLink'
import { RegisterForm } from '../organisms/RegisterForm'
import type { RegisterValues } from '../organisms/RegisterForm'
import { SocialLogin } from '../organisms/SocialLogin'
import { AuthLayout } from '../templates/AuthLayout'

const providers = [
  { name: 'Github', logo: '/github.png' },
  { name: 'Gmail', logo: '/gmail.png' },
]

const REGISTER_ERRORS = {
  400: 'Verifique os dados informados',
  409: 'Este email já está cadastrado',
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit({ remember, ...user }: RegisterValues) {
    setError(undefined)
    setSubmitting(true)
    try {
      await registerUser(user)
      // Sign the new user in right away instead of making them log in again.
      const { accessToken } = await login({
        email: user.email,
        password: user.password,
      })
      saveToken(accessToken, remember)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err, REGISTER_ERRORS))
    } finally {
      setSubmitting(false)
    }
  }

  function handleSocialSelect(name: string) {
    console.info('social login selected', name)
  }

  return (
    <AuthLayout
      banner={{
        src: '/banner-register.png',
        alt: 'Banner do Code Connect',
        className: 'object-[60%_50%]',
      }}
      title="Cadastro"
      subtitle="Olá! Preencha seus dados."
      footer={
        <>
          Já tem conta? <TextLink to="/login">Faça seu login!</TextLink>
        </>
      }
    >
      <RegisterForm
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      />
      <SocialLogin providers={providers} onSelect={handleSocialSelect} />
    </AuthLayout>
  )
}
