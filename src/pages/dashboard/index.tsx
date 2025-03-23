// // src/pages/dashboard/index.tsx
// import axios from 'axios'
// import {useEffect, useState} from 'react'
// export default function Dashboard() {
//   const [username, setUsername] = useState('') // 사용자 이름 상태와 상태 업데이트 함수 정의

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('token') // 로컬 스토리지에서 토큰 가져오기

//         console.log('토큰 있음?', token) // ✅ 토큰 존재 여부 확인
//         console.log('Authorization Header:', `Bearer ${token}`) // ✅ 실제 전송될 헤더 확인

//         if (!token) {
//           console.warn('토큰이 없습니다. 로그인 필요') // 토큰이 없을 경우 경고 메시지 출력
//           return
//         }

//         const res = await axios.get('http://localhost:4000/users/me', {
//           headers: {
//             Authorization: `Bearer ${token}` // 토큰을 Authorization 헤더에 추가하여 요청
//           }
//         })

//         console.log('사용자 정보:', res.data) // 서버로부터 받은 사용자 정보 출력
//         setUsername(res.data.email || '사용자') // 사용자 이름 상태 업데이트 (백엔드 필드에 맞춰 설정)

//         // 또는 토큰 디코딩 후 유저명 저장 방식
//         // localStorage.setItem('username', res.data.email)
//       } catch (err) {
//         console.error('인증 실패:', err) // 인증 실패 시 에러 메시지 출력
//       }
//     }

//     fetchUser() // 사용자 정보 가져오는 함수 호출
//   }, []) // 컴포넌트가 처음 렌더링될 때만 실행

//   return (
//     <div className="min-h-screen bg-white p-10">
//       <h1 className="text-3xl font-bold mb-4">
//         🎉 대시보드에 오신 걸 환영합니다, {username}!{' '}
//         {/* 사용자 이름을 포함한 환영 메시지 */}
//       </h1>
//       <p className="text-gray-600">
//         이곳에서 ESG 데이터를 입력하고 시각화할 수 있습니다. {/* 대시보드 설명 */}
//       </p>

//       <div className="mt-10 grid grid-cols-13 gap-4">
//         <div className="col-span-4 bg-blue-100 p-6 rounded-xl shadow">📊 E 환경</div>{' '}
//         {/* 환경 데이터 섹션 */}
//         <div className="col-span-4 bg-green-100 p-6 rounded-xl shadow">
//           🤝 S 사회
//         </div>{' '}
//         {/* 사회 데이터 섹션 */}
//         <div className="col-span-5 bg-yellow-100 p-6 rounded-xl shadow">
//           🏢 G 지배구조 {/* 지배구조 데이터 섹션 */}
//         </div>
//       </div>
//     </div>
//   )
// }

// src/pages/dashboard/index.tsx
import {useEffect, useState} from 'react'
import DashboardWelcome from '@/components/dashboard/DashboardWelcome'
import DashboardGrid from '@/components/dashboard/DashboardGrid'
import {fetchCurrentUser} from '@/services/auth'
import {getToken} from '@/utils/auth'

export default function Dashboard() {
  const [username, setUsername] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getToken()
        if (!token) {
          console.warn('토큰이 없습니다. 로그인 필요')
          return
        }
        const user = await fetchCurrentUser(token)
        setUsername(user.email || '사용자')
      } catch (err) {
        console.error('인증 실패:', err)
      }
    }

    loadUser()
  }, [])

  return (
    <div className="min-h-screen bg-white p-10">
      <DashboardWelcome username={username} />
      <DashboardGrid />
    </div>
  )
}
