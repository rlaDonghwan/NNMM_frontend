'use client'

import Environmental from '@/components/dashboard/environmental'
import ESGModal from '@/components/modal/UnifiedESGModal'
import {ESGModalProvider} from '@/components/modal/ESGModalContext'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

export default function environmental() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ESGModalProvider>
        <div className="flex h-full w-full px-4 py-8 bg-[#E5F0F9]">
          {/* className="flex h-full w-full bg-white px-4 py-8"로 수정------------------------------ */}
          <Environmental />
        </div>
        <ESGModal category="environmental" />
      </ESGModalProvider>
    </DndProvider>
  )
}
