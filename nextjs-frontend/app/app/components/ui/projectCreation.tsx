"use client"

import { createProject } from '@/app/actions/projectActions'
import { startTransition, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/lib/hook'
import { toggleCreateProject } from '@/app/features/ui/userSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Folder, Plus, Palette, ChevronDown, Star, FolderPlus } from 'lucide-react'
import { confirmProject } from '@/app/features/ui/taskSlice'
useAppSelector

export interface ProjectData {
  name: string
  color: string
  parent_id: number | null
  is_favorite: boolean
}

const ProjectCreation = () => {
  const dispatch = useAppDispatch()
  const parentID = useAppSelector((state) => state.ui.panel_id)

  useEffect(() => {
    console.log(parentID)
  }, [parentID])

  const [project, setProject] = useState<ProjectData>({
    name: '',
    color: 'Blue',
    parent_id: parentID,
    is_favorite: false
  })

  const handleCreate = () => {
    if (!project.name.trim()) return
    startTransition(async () => {
      const res = await createProject(project)
      console.log(res.data)
      if(res?.error) console.log(res.error)
      if(res.success) dispatch(confirmProject(res.data))
      else dispatch(toggleCreateProject(null))
    })
  }

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => dispatch(toggleCreateProject(null))}
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-card-bg/90 backdrop-blur-2xl border border-white/10 rounded-3xl relative flex flex-col overflow-hidden shadow-2xl z-10"
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <FolderPlus size={20} />
            </div>
            <h1 className="font-bold text-lg text-site-text">Create New Project</h1>
          </div>
          <button 
            onClick={() => dispatch(toggleCreateProject(null))}
            className="p-2 hover:bg-white/5 rounded-full text-second-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-second-text px-1">Project Name</label>
            <input 
              type="text" 
              placeholder="e.g. Design System"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-site-text outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-second-text px-1 flex items-center gap-2">
                <Palette size={12} /> Color
              </label>
              <div className="relative">
                <select 
                  value={project.color}
                  onChange={(e) => setProject({ ...project, color: e.target.value })}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl p-3 text-site-text outline-none focus:border-accent/50 transition-all cursor-pointer"
                >
                  <option value="Blue">Blue</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Green">Green</option>
                  <option value="Red">Red</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-second-text pointer-events-none" />
              </div>
            </div>

            {/* Parent Project */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-second-text px-1">Parent Location</label>
              <div className="relative">
                <select 
                  value={project.parent_id || ""}
                  onChange={(e) => setProject({ ...project, parent_id: Number(e.target.value) || null })}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl p-3 text-site-text outline-none focus:border-accent/50 transition-all cursor-pointer"
                >
                  <option value="">Root Level</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-second-text pointer-events-none" />
              </div>
            </div>
          </div>

          <div> <h1>Parent Id: {project.parent_id}</h1> </div>

          <div 
            onClick={() => setProject({ ...project, is_favorite: !project.is_favorite })}
            className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${project.is_favorite ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-zinc-500 group-hover:text-zinc-400'}`}>
                <Star size={18} fill={project.is_favorite ? "currentColor" : "none"} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-site-text">Mark as Favorite</span>
                <span className="text-[11px] text-second-text">Pinned to the top of your sidebar</span>
              </div>
            </div>
            {/* Custom Toggle Switch */}
            <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${project.is_favorite ? 'bg-accent' : 'bg-zinc-700'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${project.is_favorite ? 'left-5' : 'left-1'}`} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/5 flex items-center justify-end gap-3">
          <button 
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-second-text hover:text-site-text hover:bg-white/5 transition-all"
            onClick={() => dispatch(toggleCreateProject(null))}
          >
            Cancel
          </button>
          <button 
            onClick={handleCreate}
            disabled={!project.name.trim()}
            className="px-6 py-2.5 rounded-xl text-sm font-black bg-accent text-white hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
          >
            Create Project
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProjectCreation