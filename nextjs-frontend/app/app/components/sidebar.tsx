"use client";
import { startTransition, useEffect, useMemo, useState } from "react";
import { toggleCreateProject } from "@/app/features/ui/userSlice";
import ProjectItem, { ProjectProps } from "./ui/projectItem";
import { getProjects } from "@/app/actions/projectActions";
import { AnimatePresence, motion } from "motion/react";
import { useAppSelector } from "@/app/lib/hook";
import { ThemePicker } from "./ui/themePicker";
import { useRouter } from "next/navigation";
import HoverPanel from "./ui/sidebarTop";
import { useDispatch } from "react-redux";
import Button from "./ui/buttons/button";

const Sidebar = () => {
  const [close, setClose] = useState(true)
  const [projects, setProjects] = useState<ProjectProps[]>([])
  const [openFolders, setOpenFolders] = useState<number[]>([])
  const isAuthenticated = useAppSelector((state) => state.ui.isAuthenticated)
  const router = useRouter()
  const dispath = useDispatch()
  const projectDataCreation = useAppSelector((state) => state.task.project)

  useEffect(() => {
    if (!isAuthenticated) return
    startTransition(async () => {
      const res = await getProjects()
      setProjects(res)
    });
  }, [isAuthenticated])

  useEffect(() => {
    if (!projectDataCreation) return
    setProjects(prev => {
      if (prev.some(p => p.id === projectDataCreation.id)) return prev
      return [...prev, projectDataCreation]
    })
    if (projectDataCreation.parent_id) setOpenFolders(prev => prev.includes(Number(projectDataCreation.parent_id)) ? prev : [...prev, Number(projectDataCreation.parent_id)])
  }, [projectDataCreation])

  const toggleFolder = (id: number) => setOpenFolders(prev => prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id])
  const favoriteRoots = useMemo(() => Array.isArray(projects) ? projects.filter(p => p.is_favorite && p.parent_id === null) : [], [projects]);
  
  const generalRoots = useMemo(() => Array.isArray(projects) ? projects.filter(p => !p.is_favorite && p.parent_id === null) : [], [projects]);

  return (
    <div className="h-screen relative bg-background-950">
      <AnimatePresence mode="wait" initial={false}  >
        {close ? (
          <motion.div
            key="open"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 100, opacity: 0 }}
            className="p-5 flex flex-col h-full border-r border-r-accent border-background-800 w-[350] overflow-hidden">
            <HoverPanel close={close} setClose={setClose} />
            <div className="flex-1 overflow-y-auto my-5 custom-scrollbar pr-2 flex flex-col gap-2">
              {favoriteRoots.length > 0 && (
                <div className="flex flex-col gap-1">
                  <h1 className="text-text-500 text-xs font-bold uppercase mt-2 px-2">Favorites</h1>
                  {favoriteRoots.map(project => <ProjectItem key={project.id} project={project} allProjects={projects} openFolders={openFolders} toggleFolder={toggleFolder}/>)}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <h1 className="text-text-500 text-xs font-bold uppercase mt-4 px-2">My Projects</h1>
                {generalRoots.map(project => <ProjectItem key={project.id} project={project} allProjects={projects} openFolders={openFolders} toggleFolder={toggleFolder}/>)}
                <div onClick={() => dispath(toggleCreateProject(null))} className="text-text-500 text-xs 
                font-bold mt-1 cursor-pointer hover:bg-background-900 p-2 rounded-[5] duration-300 select-none active:bg-background-800 border border-dashed border-accent/40 hover:bg-accent/5">Create new project</div>
              </div>
            </div>
            <ThemePicker/>
            <div className="flex flex-col gap-2 pt-4 border-t border-accent">
              <Button title={"Goals"} func={() => router.push("/app/goals")}/>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="closed"
            animate={{ opacity: 1, width: 100 }}
            className="p-5 w-[100] h-full flex flex-col"
          >
            <div
              className="w-10 h-10 border border-background-800 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-background-900 transition-colors"
              onClick={() => setClose(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-text-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;