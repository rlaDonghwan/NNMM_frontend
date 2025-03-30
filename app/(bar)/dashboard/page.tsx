import DashboardGrid from '@/components/dashboard/TotalDashboard'
import {fetchCurrentUser} from 'services/auth'
import {toast} from 'react-hot-toast'
import {GetServerSideProps} from 'next'

// 대시보드 페이지
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white p-10">
      <DashboardGrid />
    </div>
  )
}
