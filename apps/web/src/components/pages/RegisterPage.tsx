import { TextLink } from '../atoms/TextLink'
import { RegisterForm } from '../organisms/RegisterForm'
import type { RegisterValues } from '../organisms/RegisterForm'
import { SocialLogin } from '../organisms/SocialLogin'
import { AuthLayout } from '../templates/AuthLayout'

const providers = [
  { name: 'Github', logo: '/github.png' },
  { name: 'Gmail', logo: '/gmail.png' },
]

export function RegisterPage() {
  function handleSubmit(values: RegisterValues) {
    console.info('register submitted', values)
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
      <RegisterForm onSubmit={handleSubmit} />
      <SocialLogin providers={providers} onSelect={handleSocialSelect} />
    </AuthLayout>
  )
}
