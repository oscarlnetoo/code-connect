import { TextLink } from '../atoms/TextLink'
import { LoginForm } from '../organisms/LoginForm'
import type { LoginValues } from '../organisms/LoginForm'
import { SocialLogin } from '../organisms/SocialLogin'
import { AuthLayout } from '../templates/AuthLayout'

const providers = [
  { name: 'Github', logo: '/github.png' },
  { name: 'Gmail', logo: '/gmail.png' },
]

export function LoginPage() {
  function handleSubmit(values: LoginValues) {
    console.info('login submitted', values)
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
      <LoginForm onSubmit={handleSubmit} />
      <SocialLogin providers={providers} onSelect={handleSocialSelect} />
    </AuthLayout>
  )
}
