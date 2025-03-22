// src/services/auth.ts
import axios from 'axios'

const API = 'http://localhost:4000' // ✅ 백엔드 주소

export const login = (data: {email: string; password: string}) =>
  axios.post(`${API}/auth/login`, data)

export const register = (data: {
  email: string
  name: string
  position: string
  password: string
}) => axios.post(`${API}/auth/signup`, data)
