// src/pages/dashboard/index.tsx
import {useEffect, useState} from 'react'

export default function Dashboard() {
  const [username, setUsername] = useState('')

  useEffect(() => {
    // 예시: 로컬 스토리지나 쿠키, API로 유저 정보 가져오기
    const name = localStorage.getItem('username') || '사용자'
    setUsername(name)
  }, [])

  return (
    <div className="min-h-screen bg-white p-10">
      <h1 className="text-3xl font-bold mb-4">
        🎉 대시보드에 오신 걸 환영합니다, {username}!
      </h1>
      <p className="text-gray-600">
        이곳에서 ESG 데이터를 입력하고 시각화할 수 있습니다.
      </p>

      <div className="mt-10 grid grid-cols-13 gap-4">
        <div className="col-span-4 bg-blue-100 p-6 rounded-xl shadow">📊 E 환경</div>
        <div className="col-span-4 bg-green-100 p-6 rounded-xl shadow">🤝 S 사회</div>
        <div className="col-span-5 bg-yellow-100 p-6 rounded-xl shadow">
          🏢 G 지배구조
        </div>
      </div>
    </div>
  )
}
