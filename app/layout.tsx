'user client'
import {Toaster} from 'react-hot-toast'
import './global.css'
import {Avatar} from '@radix-ui/react-avatar'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body className="flex flex-col w-full h-full">
        <div className="flex flex-1">{children}</div>
        <Toaster />
      </body>
    </html>
  )
}
