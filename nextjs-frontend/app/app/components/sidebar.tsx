"use client"

import { startTransition, useEffect, useMemo, useState } from "react"
import ActionButton from "./ui/actionButton"
import CreateNewTaskButton from "./ui/createNewTaskButton"
import HoverPanel from "./ui/sidebarTop"
import { useAppDispatch, useAppSelector } from '@/app/lib/hook';
import { setTab, toggleCreateProject } from "@/app/features/ui/userSlice"
import { AnimatePresence, motion } from "motion/react"
import { getProjects } from "@/app/actions/projectActions"
import { useRouter } from "next/navigation"

export const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

export const Glass = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)

export const Inbox = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
  </svg>
)

export const Calender = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
  </svg>
)

export const List = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
  </svg>
)

export const Filters = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
  </svg>
)

export const Check = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const OpenOrCloseSidebar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
  </svg>
)

const Plus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const Folder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </svg>
)

interface ProjectProps {
  id: number
  color: string
  is_favorite: boolean
  name: string
  parent_id: number | null
}

const Sidebar = () => {
  const [selected, setSelected] = useState<number>(0)
  const [close, setClose] = useState(true)
  const dispatch = useAppDispatch()
  const [projects, setProjects] = useState<ProjectProps[]>()
  const isAuthenticated = useAppSelector((state) => state.ui.isAuthenticated)
  const router = useRouter()

  const menuBUttons = [
    {id: 0, title: "Search", icon: <Glass/>},
    {id: 1, title: "Inbox", icon: <Inbox/>},
    {id: 2, title: "Today", icon: <Calender/>},
    {id: 3, title: "Upcoming", icon: <List/>},
    {id: 4, title: "Filters", icon: <Filters/>},
    {id: 5, title: "Completed", icon: <Check/>}
  ]

  useEffect(() => {
    dispatch(setTab(selected))
  }, [selected])
  
  const openClosePanel = () => {
    dispatch(toggleCreateProject()); 
  }

  useEffect(() => {
    if(!isAuthenticated) return

    startTransition(async () => {
        const res = await getProjects()
        setProjects(res)
    })
  }, [isAuthenticated])

  useEffect(() => {
    if(!projects) return
    console.log(projects)
  }, [projects])

  const favoriteProjects = useMemo(() => {
    return Array.isArray(projects) 
      ? projects.filter(p => p.is_favorite === true) 
      : [];
  }, [projects]);
  
  const regularProjects = useMemo(() => {
    return Array.isArray(projects) 
      ? (
        projects.filter(p => p.is_favorite === false) && projects.filter(p1 => p1.parent_id != null) 
      )
      : [];
  }, [projects]);
  
  return (
    <div><AnimatePresence mode="wait">{close ?
    <motion.div
    initial={{width: 350}}
    animate={{}}
    exit={{width: 0}}
     className='flex flex-col bg- p-5'>
        <HoverPanel close={close} setClose={setClose}/>

        <div className="mt-10 flex flex-col gap-5">
          <CreateNewTaskButton/>
          {menuBUttons.map(el => <ActionButton key={el.id} id={el.id} title={el.title} icon={el.icon} selected={selected} setSelected={setSelected}/>)}
        </div>

        <button className="w-full h-10 rounded-xl border flex items-center px-5 justify-between mt-5">My Projects <div className="cursor-pointer" onClick={openClosePanel}><Plus/></div></button>

        <div className="flex flex-col gap-1">
          <h1 className="mb-2">Favorites</h1>
          {favoriteProjects.map(el => <div key={el.id} onClick={() => router.push(`/app/project/${el.id}`)}>{el.name} is {el.is_favorite && "favorite"}</div>)}
        </div>

        <div className="mt-10 flex flex-col gap-5 overflow-y-scroll h-100 overflow-y-screen">
          {regularProjects.map(el =><div key={el.id} className={`${el.parent_id && "bg-amber-200"}`} onClick={() => router.push(`/app/project/${el.id}`)}>{el.name}</div>)}
        </div>
    </motion.div> : <div><div className="w-10 h-10 border rounded-2xl flex items-center justify-center relative" onClick={() => setClose(!close)}><OpenOrCloseSidebar/></div></div>}
    </AnimatePresence>
    </div>
  )
}

export default Sidebar