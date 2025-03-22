// import {signIn} from 'next-auth/react'
// import {useState} from 'react'
// import Link from 'next/link'

// export default function SignIn() {
//   const [email, setEmail] = useState<string>('')
//   const [password, setPassword] = useState<string>('')
//   const [error, setError] = useState<string>('')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const res = await signIn('credentials', {
//       redirect: false, // 리디렉션을 수동으로 처리
//       email,
//       password
//     })

//     if (res?.error) {
//       setError('Invalid email or password')
//     } else {
//       // 로그인 성공 시 리디렉션
//       window.location.href = '/'
//     }
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100 border border-gray-300 shadow-xl rounded-xl">
//       <div className="flex flex-col items-center justify-center flex-1 max-w-sm px-2 mx-auto">
//         <div className="w-full px-6 py-8 text-black bg-white rounded shadow-md">
//           <h1 className="mb-8 text-2xl text-center text-primary">Login</h1>

//           {error && <p className="mb-4 text-center text-red-500">{error}</p>}

//           <form onSubmit={handleSubmit}>
//             <input
//               type="email"
//               className="w-full p-3 mb-4 border border-gray-300 rounded"
//               placeholder="Email"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//             />

//             <input
//               type="password"
//               className="w-full p-3 mb-4 border border-gray-300 rounded"
//               placeholder="Password"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//             />

//             <button
//               type="submit"
//               className="w-full py-3 text-white bg-blue-500 rounded hover:bg-blue-700">
//               Login
//             </button>
//           </form>
//         </div>

//         <div className="mt-6 text-gray-600">
//           Create account?
//           <Link
//             href="/auth/signup"
//             className="text-blue-500 underline hover:text-blue-700">
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }
import SignInForm from '../../components/auth/SignInForm'

export default function SignInPage() {
  return <SignInForm />
}
