import {useState} from 'react'

const PasswordInput = ({label}: {label: string}) => {
  const [showPassword, setShowPassword] = useState(false)
  const labelStyle = 'w-32 text-gray-600 flex items-center justify-between'
  return (
    <div className="flex items-center">
      <label className="w-32 text-gray-600 flex items-center">
        <span>{label}</span>
        <input
          type={showPassword ? 'text' : 'password'}
          className="flex-1 bg-gray-100 rounded-lg px-4 py-2"
        />
        <button onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? '🙈' : '👁️'}
        </button>
      </label>
    </div>
  )
}

export default PasswordInput
