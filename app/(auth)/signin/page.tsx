import SignInForm from '@/components/auth/signin'
import React from 'react'

const SignIn = () => {
  return <SignInForm />
}
//prettier-ignore
SignIn.getLayout = (page) => page;

export default SignIn
