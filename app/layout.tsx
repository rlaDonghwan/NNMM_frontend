import './global.css'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body className="w-full h-full">
        <div>{children}</div>
      </body>
    </html>
  )
}
