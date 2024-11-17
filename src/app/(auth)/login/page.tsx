import LoginButton from '@/components/LoginButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login to ColdConnect</h1>
        <LoginButton />
      </div>
    </div>
  )
}