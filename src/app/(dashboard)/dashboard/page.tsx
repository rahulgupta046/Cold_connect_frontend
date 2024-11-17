import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import EmailForm from '@/components/EmailForm'

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ColdConnect Dashboard</h1>
      <EmailForm />
    </div>
  )
}