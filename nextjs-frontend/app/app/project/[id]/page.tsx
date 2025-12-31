"use client"
import { getPinnedTaskIds, getTasks } from '@/app/actions/taskActions'
import BackdropLoading from '@/app/components/ui/backdropLoading'
import { useEffect, useState, use } from 'react'
import TaskListClient from './taskListClient'
import { TaskDTO } from '@/app/types/task'

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const projectId = Number(resolvedParams.id)

  const [initialTasks, setInitialTasks] = useState<TaskDTO[]>([])
  const [initialPinnedTasks, setInitialPinnedTasks] = useState<TaskDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [res, resPinnedIds] = await Promise.all([
          getTasks(projectId),
          getPinnedTaskIds()
        ])

        const allTasks: TaskDTO[] = res.success && res.data ? res.data : []
        const pinnedIds: number[] = resPinnedIds?.data?.pinned_ids || []

        setInitialPinnedTasks(allTasks.filter(task => pinnedIds.includes(task.id)))
        setInitialTasks(allTasks.filter(task => !pinnedIds.includes(task.id)))
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [projectId])

  return (
    loading ? <BackdropLoading open={true}/> :
    <div className="h-screen relative w-full p-5">
      <TaskListClient 
        initialTasks={initialTasks} 
        initialPinnedTasks={initialPinnedTasks} 
        projectId={projectId} 
      />
    </div>
  )
}