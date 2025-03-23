interface DashboardWelcomeProps {
  username: string
}
//----------------------------------------------------------------------------------------------------

export default function DashboardWelcome({username}: DashboardWelcomeProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        🎉 대시보드에 오신 걸 환영합니다, {username}!
      </h1>
      <p className="text-gray-600">
        이곳에서 ESG 데이터를 입력하고 시각화할 수 있습니다.
      </p>
    </div>
  )
}
//----------------------------------------------------------------------------------------------------
