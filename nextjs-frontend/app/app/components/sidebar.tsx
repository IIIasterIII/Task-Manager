"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hook";
import { getProjects } from "@/app/actions/projectActions";
import { useRouter } from "next/navigation";

import HoverPanel from "./ui/sidebarTop";
import { toggleCreateProject, toggleModal } from "@/app/features/ui/userSlice";

const Folder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </svg>
);

const More = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-auto bg-indigo-950 z-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
)

const Chevron = ({ 
  isOpen, 
  onClick 
}: { 
  isOpen: boolean, 
  onClick: (e: React.MouseEvent) => void 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={`size-3 transition-transform duration-200 cursor-pointer hover:text-text-100 ${isOpen ? "rotate-90" : ""}`}
    onClick={onClick}
  >
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);

interface ProjectProps {
  id: number;
  color: string;
  is_favorite: boolean;
  name: string;
  parent_id: number | null;
}

const ProjectItem = ({ 
  project, 
  allProjects, 
  openFolders, 
  toggleFolder 
}: { 
  project: ProjectProps
  allProjects: ProjectProps[]
  openFolders: number[]
  toggleFolder: (id: number) => void
}) => {
  const [showIcons, setShowIcons] = useState(false)
  const isOpen = openFolders.includes(project.id)
  const children = allProjects.filter(p => p.parent_id === project.id)
  const hasChildren = children.length > 0
  const dispatch = useAppDispatch()
  const [openPanel, setOpenPanel] = useState<boolean>(false)
  const router = useRouter()

  const handleOpenPanel = () => {
    setOpenPanel(prev => !prev)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFolder(project.id);
  }

  return (
    <div 
      className="flex flex-col w-full text-text-100 relative" 
      onMouseEnter={() => setShowIcons(true)} 
      onMouseLeave={() => setShowIcons(false)} 
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/app/project/${project.id}`);
      }}
      >
      {openPanel && <div onClick={(e) => e.stopPropagation()} className="bg-background-900 absolute rounded-[5px] translate-y-10 right-0 z-10 text-text-50 flex items-center justify-center flex-col gap-2 p-5">
        <button className="cursor-pointer px-5 py-2 rounded-[5px] bg-violet-900 hover:bg-violet-700" onClick={() => dispatch(toggleCreateProject(project.id)) }>Create new project</button>
        <button className="cursor-pointer px-5 py-2 rounded-[5px] bg-violet-900 hover:bg-violet-700" onClick={() => dispatch(toggleModal(project.id))}>Create new task</button>
        </div>}
      <div 
        className="w-full select-none min-h-10 rounded-[5px] duration-300 hover:bg-violet-950/40 flex flex-row items-center gap-2 px-2"
      > 
        <div className="flex items-center gap-2 flex-1 cursor-pointer">
           <Folder />
           <span className="text-sm truncate">{project.name}</span>
        </div>

        {showIcons && <div onClick={handleOpenPanel}><More/></div>}

        <div className="w-4 flex items-center justify-center">
          {hasChildren && (
            <Chevron 
              isOpen={isOpen} 
              onClick={handleToggle}
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-4 border-l border-background-800 overflow-hidden"
          >
            {children.map(child => (
              <ProjectItem 
                key={child.id} 
                project={child} 
                allProjects={allProjects} 
                openFolders={openFolders}
                toggleFolder={toggleFolder}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = () => {
  const [close, setClose] = useState(true)
  const [projects, setProjects] = useState<ProjectProps[]>([])
  const [openFolders, setOpenFolders] = useState<number[]>([])
  const isAuthenticated = useAppSelector((state) => state.ui.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) return

    startTransition(async () => {
      const res = await getProjects()
      setProjects(res || [])
    });
  }, [isAuthenticated])

  const toggleFolder = (id: number) => {
    setOpenFolders(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const favoriteRoots = useMemo(() => 
    projects.filter(p => p.is_favorite && p.parent_id === null), [projects])
  
  const generalRoots = useMemo(() => 
    projects.filter(p => !p.is_favorite && p.parent_id === null), [projects])

  return (
    <div className="h-screen relative bg-background-950">
      <AnimatePresence mode="wait" initial={false}  >
        {close ? (
          <motion.div
            key="open"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="p-5 flex flex-col h-full border-r border-background-800 overflow-hidden"
          >
            <HoverPanel close={close} setClose={setClose} />
            <div className="flex-1 overflow-y-auto my-5 custom-scrollbar pr-2 flex flex-col gap-2">
              {favoriteRoots.length > 0 && (
                <div className="flex flex-col gap-1">
                  <h1 className="text-text-500 text-xs font-bold uppercase mt-2 px-2">Favorites</h1>
                  {favoriteRoots.map(project => (
                    <ProjectItem 
                      key={project.id} 
                      project={project} 
                      allProjects={projects} 
                      openFolders={openFolders}
                      toggleFolder={toggleFolder}
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <h1 className="text-text-500 text-xs font-bold uppercase mt-4 px-2">My Projects</h1>
                {generalRoots.map(project => (
                  <ProjectItem 
                    key={project.id} 
                    project={project} 
                    allProjects={projects} 
                    openFolders={openFolders}
                    toggleFolder={toggleFolder}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-background-800">

            <button
              onClick={() => router.push("/app/calendar")}
              className="flex w-auto px-5 justify-center items-center rounded-md bg-indigo-500 py-1.5 cursor-pointer text-sm/6 duration-300 
              font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:bg-indigo-300">Calendar</button>
            </div>
            
          </motion.div>
        ) : (
          <motion.div 
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4"
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