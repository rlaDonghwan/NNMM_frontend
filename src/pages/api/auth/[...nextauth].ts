import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import {Session} from 'next-auth'

// Extend the Session interface to include the id property
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string
      email?: string
      image?: string
    }
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {label: 'Email', type: 'text'},
        password: {label: 'Password', type: 'password'}
      },
      async authorize(credentials) {
        const {email, password} = credentials as {
          email: string
          password: string
        }

        try {
          // 백엔드 API 호출
          const response = await fetch('https://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
          })

          if (!response.ok) {
            throw new Error('Invalid credentials')
          }

          const user = await response.json()

          if (user) {
            // 사용자 객체에 id 포함
            return {
              id: user.id, // 여기에 id를 포함시켜야 오류 해결
              email: user.email,
              name: user.name
            }
          }
          return null
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = user.id // JWT 토큰에 id 추가
      }
      return token
    },
    async session({session, token}) {
      if (token) {
        session.user.id = token.id as string // 세션에 id 추가
      }
      return session
    }
  }
})
