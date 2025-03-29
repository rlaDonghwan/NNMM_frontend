// app/your-page/layout.tsx
import '../global.css'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <html>
      <body className="flex w-full h-full">{children}</body>
    </html>
  )
}
