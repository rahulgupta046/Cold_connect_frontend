'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'

export default function EmailForm() {
  const [email_id, setEmailId] = useState('')
  const [company_name, setCompanyName] = useState('')
  const [body, setEmailBody] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== 'authenticated') {
      alert('You must be logged in to send emails')
      return
    }
    setIsLoading(true)
    try {
      const response = await axios.post('/api/send-email', 
        { email_id, company_name, body },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
      alert('Email sent successfully!')
      setEmailId('')
      setCompanyName('')
      setEmailBody('')
    } catch (error) {
      console.error('Failed to send email:', error)
      alert('Failed to send email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in to send emails</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email_id" className="block mb-1">Email ID:</label>
        <input
          type="email"
          id="email_id"
          value={email_id}
          onChange={(e) => setEmailId(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="company_name" className="block mb-1">Company Name:</label>
        <input
          type="text"
          id="company_name"
          value={company_name}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="body" className="block mb-1">Email Body:</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setEmailBody(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
          rows={4}
        ></textarea>
      </div>
      <button 
        type="submit" 
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sending...' : 'Send Email'}
      </button>
    </form>
  )
}