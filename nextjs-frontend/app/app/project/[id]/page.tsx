import { getTasks } from '@/app/actions/taskActions'
import TaskListClient from './taskListClient'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }>}) {
  const resolvedParams = await params;
  const projectId = Number(resolvedParams.id);
  const res = await getTasks(projectId);
  const initialTasks = res.success && res.data ? res.data : [];

  return (
    <div className="h-screen relative w-full p-5">
      <h1 className="text-2xl font-bold mb-4 w-full">Project Tasks</h1>
      <TaskListClient initialTasks={initialTasks} projectId={projectId} />
    </div>
  )
}