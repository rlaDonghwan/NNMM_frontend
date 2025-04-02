'use client'

import Social from '@/components/dashboard/Social'
import ESGModal from '@/components/modal/ESGModal'
import {ESGModalProvider} from '@/components/modal/ESGModalContext'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

export default function SocialPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ESGModalProvider>
        <div className="flex h-full w-full bg-white px-4 py-8">
          {/* 대시보드 화면 위치 잡기 */}
          <Social />
        </div>
        <ESGModal category="social" />
      </ESGModalProvider>
    </DndProvider>
  )
}
