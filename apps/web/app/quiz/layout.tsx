'use client'
import VerticalNav from "@repo/ui/VerticalNav"
import TopNav from "@repo/ui/TopNav"
import SupportBtn from "@repo/ui/SupportBtn"
import { ReactNode, useState } from "react"

function DashboardLayout({children} : {children : ReactNode}) {
  const [showSideBar, setShowSideBar] = useState<boolean>(true)
  return (
    <div className='flex w-screen relative overflow-hidden h-screen'>
        <div className={`transition-all duration-300 ease-in-out z-10 
            max-md:transform max-md:fixed max-md:top-0 max-md:left-0 max-md:h-full
            ${showSideBar 
              ? 'max-md:translate-x-0 max-sm:w-[70%] max-md:w-[50%] md:relative md:w-[30%] lg:w-[20%] opacity-100' 
              : 'max-md:-translate-x-full max-md:w-0 md:w-0 overflow-hidden opacity-0'}`}>
          <VerticalNav setShowSideBar={setShowSideBar} />
        </div>
        <div className={`w-full overflow-y-auto ${showSideBar ? 'md:w-[70%] lg:w-[80%]' : 'w-full'}`}>
          {children}
        </div>
        <div className={`w-full ${!showSideBar ? 'block' : 'hidden'} absolute top-0`}>
          {!showSideBar && <TopNav setShowSideBar={setShowSideBar}/>}
        </div>
        <SupportBtn />
    </div>
  )
}

export default DashboardLayout