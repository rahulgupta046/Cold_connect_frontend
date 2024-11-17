import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import axios from 'axios'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    console.error('Unauthorized: No session or access token')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email_id, company_name, body } = await req.json()

  if (!email_id || !company_name || !body) {
    console.error('Missing required fields', { email_id, company_name, body })
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    console.log('Sending request to backend API')
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/send-email`,
      { email_id, company_name, body },
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('Email sent successfully')
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error sending email:', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios Error Response:', error.response?.data)
    }
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}