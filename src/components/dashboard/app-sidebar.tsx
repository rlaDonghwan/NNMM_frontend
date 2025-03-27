import {
  SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader
} from '@/components/ui/sidebar'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {useRouter} from 'next/router'

export function AppSidebar() {
  const router = useRouter()
  const isD = router.pathname === '/dashboard'
  const isE = router.pathname === '/dashboard/E'
  const isS = router.pathname === '/dashboard/S'
  const isG = router.pathname === '/dashboard/G'
  return (
    <SidebarInset
      className="flex min-h-full"
      style={{
        background: 'linear-gradient(to bottom, #88CCE6, #E5E5E5 95%)',
        maxWidth: '200px'
      }}>
      <SidebarHeader />
      <SidebarContent>
        <div className="flex flex-col items-center space-y-4">
          <Link href="/dashboard" legacyBehavior passHref>
            <button
              type="submit"
              className="hover:bg-gray-500 hover:bg-opacity-30 w-full rounded-md flex items-center space-x-2">
              <img src="/images/dsvg.svg" alt="Main" className="ml-8 w-8 h-8" />
              <span
                className={`transition-colors duration-300 ${
                  isD ? 'font-bold text-customBlue' : ''
                }`}>
                Dashboard
              </span>
            </button>
          </Link>
          <Link href="/dashboard/E" legacyBehavior passHref>
            <button
              type="submit"
              className="hover:bg-gray-500 hover:bg-opacity-30 w-full rounded-md flex items-center space-x-2">
              <img src="/images/E.png" alt="E" className="ml-8 w-8 h-8" />
              <span
                className={`transition-colors duration-300 ${
                  isE ? 'font-bold text-customBlue' : ''
                }`}>
                Environment
              </span>
            </button>
          </Link>
          <Link href="/dashboard/S" legacyBehavior passHref>
            <button
              type="submit"
              className="hover:bg-gray-500 hover:bg-opacity-30 w-full rounded-md flex items-center space-x-2">
              <img src="/images/S.png" alt="S" className="ml-8 w-8 h-8" />
              <span
                className={`transition-colors duration-300 ${
                  isS ? 'font-bold text-customBlue' : ''
                }`}>
                Social
              </span>
            </button>
          </Link>
          <Link href="/dashboard/G" legacyBehavior passHref>
            <button
              type="submit"
              className="hover:bg-gray-500 hover:bg-opacity-30 w-full rounded-md flex items-center space-x-2">
              <img src="/images/G.png" alt="G" className="ml-8 w-8 h-8" />
              <span
                className={`transition-colors duration-300 ${
                  isG ? 'font-bold text-customBlue' : ''
                }`}>
                Governance
              </span>
            </button>
          </Link>
        </div>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </SidebarInset>
  )
}
