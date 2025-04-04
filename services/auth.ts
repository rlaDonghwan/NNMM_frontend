import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL // 환경변수 사용

// 로그인 요청 함수, 이메일과 비밀번호를 서버로 전송
export const login = (data: {email: string; password: string}) =>
  axios.post(`${BASE_URL}/auth/login`, data) // 로그인 요청 함수, 이메일과 비밀번호를 서버로 전송

//----------------------------------------------------------------------------------------------------

// 회원가입 요청 함수, 이메일, 이름, 직책, 비밀번호를 서버로 전송
export const register = (data: {
  email: string
  name: string
  companyName: string
  password: string
}) => axios.post(`${BASE_URL}/auth/signup`, data) // 회원가입 요청 함수, 이메일, 이름, 직책, 비밀번호를 서버로 전송
//----------------------------------------------------------------------------------------------------

export const fetchCurrentUser = async () => {
  const res = await axios.get(`${BASE_URL}/users/me`, {
    withCredentials: true
  })
  return res.data
}
//----------------------------------------------------------------------------------------------------
export const checkLogin = async (): Promise<boolean> => {
  try {
    const res = await axios.get(`${BASE_URL}/users/me`, {
      withCredentials: true
    })
    return !!res.data?._id // 사용자 데이터가 있으면 true
  } catch (error) {
    return false // 에러가 나면 로그인 안 된 상태로 간주
  }
}
//----------------------------------------------------------------------------------------------------
