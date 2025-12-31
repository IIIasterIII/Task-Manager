"use client"
import { useAppDispatch, useAppSelector } from "@/app/lib/hook"
import { deleteCookie } from "@/app/actions/apiClient"
import { logout } from "@/app/features/ui/userSlice"
import { FC, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Logs } from "lucide-react"
import { notify } from "@/app/lib/notifier"

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
    notify({message: "Logged out successfully"}, "Logged out successfully")
    router.replace("/")
  }

  const OpenOrCloseSidebar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
    </svg>
  )

  const Logout = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
    </svg>
  )

  return (
  <div className='flex flex-row items-center gap-2 relative px-2'>
  {isUserData && (
    <>
      <div 
        onClick={() => setOpen(!open)} 
        className="flex flex-1 flex-row gap-3 items-center active:scale-95 select-none cursor-pointer duration-300 p-1.5 rounded-2xl group transition-all"
      >
        <div className="relative">
          <img src={isUserData.user_pic || "/default-avatar.png"} className="w-10 h-10 border border-white/10 rounded-xl object-cover shadow-sm group-hover:shadow-accent"/>
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
                onClick={handleLogout}><Logout/> Sign Out
              </button>
            </div>)
          }
      </>
    )}
  </div>
  )
}

export default HoverPanel