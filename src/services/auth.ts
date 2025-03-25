import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL // 환경변수 사용

// 로그인 요청 함수, 이메일과 비밀번호를 서버로 전송
export const login = (data: {email: string; password: string}) =>
  axios.post(`${API}/auth/login`, data) // 로그인 요청 함수, 이메일과 비밀번호를 서버로 전송

//----------------------------------------------------------------------------------------------------

// 회원가입 요청 함수, 이메일, 이름, 직책, 비밀번호를 서버로 전송
export const register = (data: {
  email: string
  name: string
  companyName: string
  password: string
}) => axios.post(`${API}/auth/signup`, data) // 회원가입 요청 함수, 이메일, 이름, 직책, 비밀번호를 서버로 전송
//----------------------------------------------------------------------------------------------------

// 현재 사용자 정보 요청 함수
export const fetchCurrentUser = async (token: string) => {
  const res = await axios.get(`${API}/users/me`, {
    headers: {Authorization: `Bearer ${token}`} // 인증 토큰을 헤더에 포함하여 현재 사용자 정보 요청
  })
  return res.data // 서버에서 반환된 사용자 데이터를 반환
}
//----------------------------------------------------------------------------------------------------
