"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Folder, MoreVertical, Plus, ListPlus, ChevronRight } from 'lucide-react'
import { useAppDispatch } from '@/app/lib/hook'
import { useRouter, usePathname } from 'next/navigation'
import { toggleModal, toggleCreateProject } from '@/app/features/ui/userSlice'

export interface ProjectProps {
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
  const pathname = usePathname()
  const isActive = pathname === `/app/project/${project.id}`

  const handleOpenPanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenPanel(prev => !prev)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFolder(project.id);
  }

  return (
    <div 
      className="flex flex-col w-full relative" 
      onMouseEnter={() => setShowIcons(true)} 
      onMouseLeave={() => {
        setShowIcons(false)
        setOpenPanel(false)
      }} 
    >
      <AnimatePresence>
        {openPanel && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()} 
            className="absolute right-2 top-10 z-50 min-w-[180] p-1.5 rounded-xl bg-card-bg/90 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <button 
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors text-site-text"
                onClick={() => { dispatch(toggleCreateProject(project.id)); setOpenPanel(false); }}
            >
                <Plus size={14} className="text-accent" />
                Sub-project
            </button>
            <button 
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors text-site-text"
                onClick={() => { dispatch(toggleModal(project.id)); setOpenPanel(false); }}
            >
                <ListPlus size={14} className="text-accent" />
                Add Task
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        onClick={() => router.push(`/app/project/${project.id}`)}
        className={`
          group relative w-full select-none min-h-[38] rounded-xl duration-200 
          flex flex-row items-center gap-2 px-2 cursor-pointer
          ${isActive ? 'bg-accent/10 text-accent' : 'text-site-text hover:bg-white/5'}
        `}
      > 
        {isActive && (
            <motion.div 
                layoutId="activeProject"
                className="absolute left-0 w-1 h-5 bg-accent rounded-r-full"
            />
        )}

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
           <Folder 
             size={16} 
             fill={isActive ? "currentColor" : "none"} 
             className={isActive ? "opacity-100" : "text-second-text"} 
           />
           <span className={`text-sm truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
             {project.name}
           </span>
        </div>

        <div className="flex items-center gap-1">
            <AnimatePresence>
                {showIcons && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleOpenPanel}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-second-text hover:text-site-text transition-colors"
                    >
                        <MoreVertical size={14}/>
                    </motion.button>
                )}
            </AnimatePresence>

            <div className="w-6 h-6 flex items-center justify-center">
                {hasChildren && (
                    <button 
                        onClick={handleToggle}
                        className={`p-0.5 rounded-md hover:bg-white/10 transition-transform duration-200 ${isOpen ? 'rotate-90 text-accent' : 'text-second-text'}`}
                    >
                        <ChevronRight size={14} />
                    </button>
                )}
            </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="ml-5 border-l border-white/5"
          >
            <div className="py-1">
                {children.map(child => (
                <ProjectItem 
                    key={child.id} 
                    project={child} 
                    allProjects={allProjects} 
                    openFolders={openFolders}
                    toggleFolder={toggleFolder}
                />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectItem;