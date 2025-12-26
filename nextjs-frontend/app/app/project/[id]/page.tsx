"use client"

import { useEffect, useState, useTransition } from 'react'
import { Suspense } from "react";
import { useParams, useRouter } from 'next/navigation'
import { getTasks } from '@/app/actions/taskActions'
import { TaskDTO } from '@/app/types/task';
import { useAppSelector } from '@/app/lib/hook';
import Task from '../../components/ui/task';
import BackdropLoading from '@/app/components/ui/backdropLoading';

const Page = () => {
  const [tasks, setTasks] = useState<TaskDTO[]>([])
  const [isPending, startTransition] = useTransition()
  const taskDataCreation = useAppSelector((state) => state.task.task)
  const params = useParams()
  const projectId = Number(params.id)

  useEffect(() => {
    if (!projectId) return
  
    startTransition(() => {
      getTasks(projectId).then(res => {
        if (res.success && res.data) 
          setTasks(res.data)
      })
    })
  }, [projectId])

  useEffect(() => {
    console.log(tasks)
  }, [tasks])

  useEffect(() => {
    if(taskDataCreation?.parent_id != projectId) return

    setTasks(prev => [...prev, taskDataCreation])
  }, [taskDataCreation])

  return (
    <div className="h-screen relative w-full p-5">
      <BackdropLoading open={isPending} />
      <h1 className="text-2xl font-bold mb-4 w-full">Project Tasks</h1>
      {tasks.length > 0 ? (
        <div className="grid gap-4 relative h-full overflow-hidden p-10">
          <div className='overflow-y-visible flex flex-col h-auto overflow-hidden gap-10 scroll-smooth'>
            {tasks.map(task => <Task key={task.id} data={task}/>)}
          </div>
        </div>
      ) : (
        <p>No tasks found in this project.</p>
      )}
    </div>
  )
}

export default Page