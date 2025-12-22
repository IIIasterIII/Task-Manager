"use client"

import { useAppDispatch, useAppSelector } from "@/app/lib/hook"
import { FC, useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/app/features/ui/userSlice"
import { deleteCookie } from "@/app/actions/apiClient"

interface HoverPanelProps {
  close: boolean
  setClose: (x: boolean) => void
}

const HoverPanel : FC<HoverPanelProps> = ({close, setClose}) => {
  const dispath = useAppDispatch()
  const isUserData = useAppSelector((state) => state.ui.profile)
  const router = useRouter()
  const[open, setOpen] = useState(false)

  const handleLogout = async () => {
    deleteCookie()
    dispath(logout())
    router.replace("/")
  }

  const Notification = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  )

  const NotificationNone = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  )

  const OpenOrCloseSidebar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
    </svg>
  )

  const More = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
    <div className='flex flex-row items-center gap-2 min-h-10 relative'>
     {isUserData ? (
        <>
        <div onClick={() => setOpen(!open)} className="flex flex-row gap-2 items-center active:scale-95 select-none cursor-pointer duration-300 hover:bg-indigo-500 p-1 rounded-xl">
          <img src={isUserData.user_pic} alt="avatar" className="w-10 h-10 border rounded-xl"/>
          <p className="">{isUserData && isUserData.username}</p>
          <More/>
        </div>

        <div className="w-10 h-10 border rounded-xl ml-auto flex items-center justify-center" onClick={() => router.push("/app/notifications")}><Notification/></div>
        <div className="w-10 h-10 border rounded-2xl flex items-center justify-center" onClick={() => setClose(!close)}><OpenOrCloseSidebar/></div>
      </>
      ) : <Skeleton/>}
      {open && <div className="absolute w-80 z-10 p-5 rounded-xl bg-indigo-50 top-0 translate-y-15 text-gray-600">
          <button className="flex flex-row items-center gap-2 duration-300 hover:bg-gray-300 cursor-pointer px-2 py-2 rounded-xl w-full"><Setting/>Setting</button>
          <hr className="my-1"/>
          <button className="flex flex-row items-center gap-2 duration-300 hover:bg-gray-300 cursor-pointer px-2 py-2 rounded-xl w-full" onClick={handleLogout}><Logout/> Log out</button>
        </div>}
      </div>
  )
}

export default HoverPanel