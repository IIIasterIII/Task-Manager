"use client"

import { createProject } from '@/app/actions/projectActions'
import { startTransition, useState } from 'react'
import { useAppDispatch } from '@/app/lib/hook'
import { toggleCreateProject } from '@/app/features/ui/userSlice'
import { useAppSelector } from '@/app/lib/hook'

export interface ProjectData {
  name: string
  color: string
  parent_id: string | null
  is_favorite: boolean
}

const ProjectCreation = () => {
  const dispath = useAppDispatch()
  const [project, setProject] = useState<ProjectData>({
    name: '',
    color: 'Blue',
    parent_id: null,
    is_favorite: false
  })

  const handleCreate = () => {
    startTransition(async () => {
      const res = await createProject(project)
      
      if(res?.error){
        console.log(res.error)
      }
    })
  }

  return (
    <div className="fixed inset-0 w-screen z-50 pointer-events-none flex items-center justify-center">
      <div className="flex min-h-full items-start translate-y-50 pointer-events-auto text-center">
        <div className="w-150 max-h-300 min-h-50 bg-indigo-50 text-black rounded-xl relative flex flex-col p-5">
          <h1 className='text-start font-bold'>Add Project</h1>
          <hr className='my-2'/>
          
          <p className="text-start text-sm mb-1">Name</p>
          <input 
            type="text" 
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            className='border rounded-md p-2 outline-0 bg-white mb-4'
          />

          <p className="text-start text-sm mb-1">Color</p>
          <select 
            value={project.color}
            onChange={(e) => setProject({ ...project, color: e.target.value })}
            className='border rounded-md p-2 outline-0 bg-white mb-4'
          >
            <option value="Blue">Blue</option>
            <option value="Yellow">Yellow</option>
            <option value="Green">Green</option>
            <option value="Red">Red</option>
          </select>

          <p className="text-start text-sm mb-1">Parent Project</p>
          <select 
            value={project.parent_id || ""}
            onChange={(e) => setProject({ ...project, parent_id: e.target.value || null })}
            className='border rounded-md p-2 outline-0 bg-white mb-4'
          >
            <option value="">No parent</option>
          </select>

          <div className='flex gap-4 flex-row items-center my-2'>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={project.is_favorite}
                onChange={(e) => setProject({ ...project, is_favorite: e.target.checked })}
                className="sr-only peer"
              />
              <div className="group peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-20 h-10 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:h-8 after:w-8 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-10 peer-checked:after:content-['✔️']">
              </div>
            </label>
            <p className="text-sm font-medium">Add to favorite</p>
          </div>

          <hr className='my-2'/>
          
          <div className='flex items-center flex-row justify-end gap-5'>
            <button className='cursor-pointer text-gray-600 hover:text-black' onClick={() => dispath(toggleCreateProject(null))}>Close</button>
            <button 
              onClick={handleCreate}
              className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Project
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCreation