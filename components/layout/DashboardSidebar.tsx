import {RiDashboardFill} from 'react-icons/ri'
import {GoLaw} from 'react-icons/go'
import {FaUserFriends} from 'react-icons/fa'
import {MdForest} from 'react-icons/md'
import React from 'react'

// components/layout/DashboardSidebar.tsx
export default function DashboardSidebar() {
  return (
    <aside className="group sidebar flex flex-col border-r items-start h-full bg-white text-black transition-all duration-300 ease-in-out hover:w-60 w-16 overflow-hidden">
      <div className="p-4">
        <span className="text-lg font-semibold">NNMM</span>
      </div>
      <nav className="flex flex-col mt-4 space-y-2">
        <a
          href="/dashboard"
          className="flex flex-row px-4 py-2 hover:bg-[#75757D] hover:text-white rounded items-center gap-4 font-apple">
          <RiDashboardFill className="w-8 h-8" />
          Dashboard
        </a>
        <a
          href="/dashboard/environmental"
          className="flex flex-row px-4 py-2 hover:bg-[#75757D] hover:text-white rounded items-center gap-4 font-apple">
          <MdForest className="w-8 h-8" />
          Environmental
        </a>
        <a
          href="/dashboard/social"
          className="flex flex-row px-4 py-2 hover:bg-[#75757D] hover:text-white rounded items-center gap-4 font-apple">
          <FaUserFriends className="w-8 h-8" />
          Social
        </a>
        <a
          href="/dashboard/governance"
          className="flex flex-row px-4 py-2 hover:bg-[#75757D] hover:text-white rounded items-center gap-4 font-apple">
          <GoLaw className="w-8 h-8" />
          governance
        </a>
      </nav>
    </aside>
  )
}
