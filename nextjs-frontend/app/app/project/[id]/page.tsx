import { getPinnedTaskIds, getTasks } from '@/app/actions/taskActions'
import TaskListClient from './taskListClient'
import { TaskDTO } from '@/app/types/task';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }>}) {
  const resolvedParams = await params;
  const projectId = Number(resolvedParams.id);
  const [res, resPinnedIds] = await Promise.all([ getTasks(projectId), getPinnedTaskIds() ]);
  const allTasks: TaskDTO[] = res.success && res.data ? res.data : [];
  const pinnedIds: number[] = resPinnedIds?.data?.pinned_ids || [];
  const initialPinnedTasks = allTasks.filter(task => pinnedIds.includes(task.id));
  const initialTasks = allTasks.filter(task => !pinnedIds.includes(task.id))

  return (
    <div className="h-screen relative w-full p-5">
      <TaskListClient 
        initialTasks={initialTasks} 
        initialPinnedTasks={initialPinnedTasks} 
        projectId={projectId} 
      />
    </div>
  )
}