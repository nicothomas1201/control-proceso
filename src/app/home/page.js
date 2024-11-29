import { HomeForm } from './components/home-form'

export default function Page() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="w-full max-w-lg">
        <h2 className="mb-3 text-3xl font-bold">Bienvenido</h2>
        <HomeForm />
      </div>
    </div>
  )
}
