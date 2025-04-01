'use client'

import Governance from '@/components/dashboard/governance'
import ESGModal from '@/components/modal/ESGModal'
import {ESGModalProvider} from '@/components/modal/ESGModalContext'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

export default function governance() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ESGModalProvider>
        <div className="flex h-full w-full bg-white pl-4 pt-8">
          <Governance />
        </div>
        <ESGModal category="governance" />
      </ESGModalProvider>
    </DndProvider>
  )
}
