'use client'

import DashboardGrid from '@/components/dashboard/TotalDashboard'
import {ESGModalProvider} from '@/components/modal/ESGModalContext'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

// 대시보드 페이지
export default function DashboardPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ESGModalProvider>
        <div className="flex h-full w-full bg-white px-4 py-8">
          <DashboardGrid />
        </div>
      </ESGModalProvider>
    </DndProvider>
  )
}
