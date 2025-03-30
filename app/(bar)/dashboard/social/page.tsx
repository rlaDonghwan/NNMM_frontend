// import Social from '@/components/dashboard/social'

// export default function social() {
//   return (
//     <div className="flex h-full w-full bg-white pl-4 pt-8">
//       <Social />
//     </div>
//   )
// }

'use client'

import Social from '@/components/dashboard/social'
import ESGModal from '@/components/modal/ESGModal'
import {ESGModalProvider} from '@/components/modal/ESGModalContext'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

export default function SocialPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ESGModalProvider>
        <div className="flex h-full w-full bg-white pl-4 pt-8">
          <Social />
        </div>
        <ESGModal category="social" />
      </ESGModalProvider>
    </DndProvider>
  )
}
