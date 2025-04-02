'use client'

import Environment from '@/components/dashboard/Environmental'
import ESGModal from '@/components/modal/ESGModal'
import {ESGModalProvider} from '@/components/modal/ESGModalContext'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

export default function environmental() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ESGModalProvider>
        <div className="flex h-full w-full bg-white px-4 py-8">
          {/* className="flex h-full w-full bg-white px-4 py-8"로 수정------------------------------ */}
          <Environment />
        </div>
        <ESGModal category="environmental" />
      </ESGModalProvider>
    </DndProvider>
  )
}
