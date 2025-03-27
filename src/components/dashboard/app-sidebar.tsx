import {
  Sidebar,
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
    <Sidebar
      style={{
        background: 'linear-gradient(to bottom, #88CCE6, #E5E5E5 95%)',
        maxWidth: '200px'
      }}>
      <SidebarHeader />
      <SidebarContent>
        <div className="flex flex-col items-start ml-8 space-y-4">
          <Link href="/dashboard" legacyBehavior passHref>
            <button>
              <img
                src="/images/dsvg.svg"
                alt="Main"
                className="inline-block w-8 h-8 mr-2 mb-1"
              />
              <span
                className={`transition-colors duration-300 ${
                  isD ? 'font-bold text-customBlue' : 'hover:text-customBlue'
                }`}>
                Dashboard
              </span>
            </button>
          </Link>
          <Link href="/dashboard/E" legacyBehavior passHref>
            <button>
              <img
                src="/images/E.png"
                alt="E"
                className="inline-block w-8 h-8 mr-2 mb-1"
              />
              <span
                className={`transition-colors duration-300 ${
                  isE ? 'font-bold text-customBlue' : 'hover:text-customBlue'
                }`}>
                Environment
              </span>
            </button>
          </Link>
          <Link href="/dashboard/S" legacyBehavior passHref>
            <button>
              <img
                src="/images/S.png"
                alt="S"
                className="inline-block w-8 h-8 mr-2 mb-1"
              />
              <span
                className={`transition-colors duration-300 ${
                  isS ? 'font-bold text-customBlue' : 'hover:text-customBlue'
                }`}>
                Social
              </span>
            </button>
          </Link>
          <Link href="/dashboard/G" legacyBehavior passHref>
            <button>
              <img
                src="/images/G.png"
                alt="G"
                className="inline-block w-8 h-8 mr-2 mb-1"
              />
              <span
                className={`transition-colors duration-300 ${
                  isG ? 'font-bold text-customBlue' : 'hover:text-customBlue'
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
    </Sidebar>
  )
}
