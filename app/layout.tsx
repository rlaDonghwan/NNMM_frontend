import './global.css'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body>
        <div className="w-full h-full">{children}</div>
      </body>
    </html>
  )
}
