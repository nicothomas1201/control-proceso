import { LoginForm } from '@/components/login-form'

export default function Home() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="w-full max-w-xl">
        <h2 className="mb-3 text-2xl font-bold leading-snug text-foreground">
          Inicia Sesión
        </h2>
        <LoginForm />
      </div>
    </div>
  )
}
