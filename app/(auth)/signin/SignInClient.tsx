'use client'

import {useSearchParams} from 'next/navigation'
import SignInForm from '@/components/auth/signin'

export default function SignInClient() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <>
      <SignInForm />
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
    </>
  )
}
