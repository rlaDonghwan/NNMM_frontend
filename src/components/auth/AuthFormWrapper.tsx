// src/components/auth/AuthFormWrapper.tsx
import {ReactNode} from 'react'

interface Props {
  title: string
  children: ReactNode
}

export default function AuthFormWrapper({title, children}: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800">{title}</h1>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  )
}
