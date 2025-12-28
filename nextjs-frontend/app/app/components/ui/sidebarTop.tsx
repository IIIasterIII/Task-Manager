"use client"

import { useAppDispatch, useAppSelector } from "@/app/lib/hook"
import { FC, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/app/features/ui/userSlice"
import { deleteCookie } from "@/app/actions/apiClient"
import { Logs, BookOpen } from "lucide-react"

interface HoverPanelProps {
  close: boolean
  setClose: (x: boolean) => void
}

const HoverPanel : FC<HoverPanelProps> = ({close, setClose}) => {
  const dispath = useAppDispatch()
  const isUserData = useAppSelector((state) => state.ui.profile)
  const router = useRouter()
  const[open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const handleLogout = async () => {
    deleteCookie()
    dispath(logout())
    router.replace("/")
  }

  useEffect(() => {
    console.log(isUserData)
  }, [isUserData])

  const OpenOrCloseSidebar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
    </svg>
  )

  const Setting = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )

  const Logout = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
    </svg>
  )

  const Skeleton = () => (
    <div className="flex flex-row items-center gap-2 w-full animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="w-10 h-10 bg-gray-100 rounded-2xl ml-auto"></div>
      <div className="w-10 h-10 bg-gray-100 rounded-2xl"></div>
    </div>
  );

  return (
  <div className='flex flex-row items-center gap-2 relative px-2'>
  {isUserData && (
    <>
      <div 
        onClick={() => setOpen(!open)} 
        className="flex flex-1 flex-row gap-3 items-center active:scale-95 select-none cursor-pointer duration-300 hover:bg-white/5 p-1.5 rounded-2xl group transition-all border border-transparent hover:border-white/10"
      >
        <div className="relative">
          <img 
            src={isUserData.user_pic || "/default-avatar.png"} 
            className="w-10 h-10 border border-white/10 rounded-xl object-cover shadow-sm group-hover:shadow-accent/20"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-site-bg rounded-full" />
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-sm font-bold truncate text-site-text">{isUserData.username}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <button 
          title="Activity Logs"
          className="w-10 h-10 cursor-pointer border border-white/5 rounded-xl flex items-center justify-center text-second-text hover:text-accent hover:bg-white/5 transition-all active:scale-90" 
          onClick={() => router.push("/app/logs")}
        >
          <Logs/>
        </button>
        
        <button 
          title={close ? "Open Sidebar" : "Close Sidebar"}
          className="w-10 h-10 cursor-pointer border border-white/5 rounded-xl flex items-center justify-center 
          text-second-text hover:text-site-text hover:bg-white/5 transition-all active:scale-90" 
          onClick={() => setClose(!close)}
        >
          <OpenOrCloseSidebar/>
        </button>
      </div>
          {open && (
            <div 
              ref={menuRef} 
              className="absolute left-0 right-0 w-full z-100 p-2 rounded-2xl bg-card-bg/80 backdrop-blur-xl border border-white/10 shadow-2xl top-14 duration-200">
              <button 
                className="flex flex-row items-center gap-3 duration-200 hover:bg-red-500/10 text-red-500 cursor-pointer px-3 py-2.5 rounded-xl w-full font-medium" 
                onClick={handleLogout}><Logout/>
                Sign Out
              </button>
            </div>)
          }
      </>
    )}
  </div>
  )
}

export default HoverPanel