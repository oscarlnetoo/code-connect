import { Divider } from '../atoms/Divider'
import { SocialLoginButton } from '../molecules/SocialLoginButton'

export type SocialProvider = {
  name: string
  logo: string
}

type SocialLoginProps = {
  providers: SocialProvider[]
  onSelect: (name: string) => void
}

export function SocialLogin({ providers, onSelect }: SocialLoginProps) {
  return (
    <div className="flex flex-col gap-6">
      <Divider>ou entre com outras contas</Divider>
      <ul className="flex gap-4">
        {providers.map(({ name, logo }) => (
          <li key={name} className="flex-1">
            <SocialLoginButton
              src={logo}
              alt={name}
              className="w-full"
              onClick={() => onSelect(name)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
