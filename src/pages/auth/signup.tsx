import {useState} from 'react'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [position, setPosition] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'email') setEmail(e.target.value)
    if (field === 'name') setName(e.target.value)
    if (field === 'position') setPosition(e.target.value)
    if (field === 'password') setPassword(e.target.value)
    if (field === 'confirmPassword') setConfirmPassword(e.target.value)
  }

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, name, position, password})
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account created successfully')
        setError('')
        // 추가적인 후속 작업 (e.g., 로그인 페이지로 이동)
      } else {
        setError(data.message || 'Failed to create account')
        setSuccess('')
      }
    } catch (err) {
      console.error('Error creating account:', err)
      setError('An unexpected error occurred')
      setSuccess('')
    }
  }

  return (
    <div className="flex flex-col min-h-screen border-gray-300 rounded-xl shadow-xl bg-gray-100 border">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm px-2 mx-auto">
        <div className="w-full px-6 py-8 text-black bg-white rounded shadow-md">
          <h1 className="mb-8 text-2xl text-center text-primary">Sign Up</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <form onSubmit={createAccount}>
            <input
              type="email"
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange('email')}
            />
            <input
              type="name"
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              name="name"
              placeholder="Name"
              value={name}
              onChange={handleChange('name')}
            />
            <input
              type="position"
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              name="position"
              placeholder="Position"
              value={position}
              onChange={handleChange('position')}
            />
            <input
              type="password"
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange('password')}
            />
            <input
              type="password"
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              name="confirm_password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange('confirmPassword')}
            />
            <button
              type="submit"
              className="w-full py-3 text-white bg-blue-500 rounded hover:bg-blue-700">
              Create Account
            </button>
          </form>
        </div>
        <div className="mt-6 text-gray-600">
          Already have an account?
          <Link href="/" className="text-blue-500 underline hover:text-blue-700">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
