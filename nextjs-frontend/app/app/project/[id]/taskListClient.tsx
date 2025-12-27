"use client"

import { startTransition, useEffect, useState } from 'react'
import { TaskDTO } from '@/app/types/task'
import { useAppSelector } from '@/app/lib/hook'
import Task from '../../components/ui/task'
import { motion } from "motion/react"
import { deleteTask, togglePinTask } from '@/app/actions/taskActions'

interface Props {
  initialTasks: TaskDTO[],
  initialPinnedTasks: TaskDTO[],
  projectId: number
}

export default function TaskListClient({ initialTasks, initialPinnedTasks, projectId }: Props) {
  const [tasks, setTasks] = useState<TaskDTO[]>(initialTasks)
  const taskDataCreation = useAppSelector((state) => state.task.task)
  const [pinned, setPinned] = useState<TaskDTO[]>(initialPinnedTasks)

  useEffect(() => {
    if (!taskDataCreation || taskDataCreation.parent_id !== projectId) return
    setTasks(prev => {
      if (prev.some(t => t.id === taskDataCreation.id)) return prev
      return [...prev, taskDataCreation]
    })
  }, [taskDataCreation, projectId])

  const handlePinTask = (taskToPin: TaskDTO) => {
    const isAlreadyPinned = pinned.some(x => x.id === taskToPin.id);
    
    if (isAlreadyPinned) {
      setPinned((prev) => prev.filter(x => x.id !== taskToPin.id));
      setTasks((prev) => [...prev, taskToPin]);
    } else {
      setTasks((prev) => prev.filter(x => x.id !== taskToPin.id));
      setPinned((prev) => [...prev, taskToPin]);
    }

    startTransition(async () => {
        await togglePinTask(taskToPin.id, !isAlreadyPinned);
    });
};

  const handleDelete = (x: TaskDTO) => {
    setTasks(prev => prev.filter(el => el.id != x.id))
    startTransition(async () => {
        await deleteTask(x.id);
    });
  };

  if (tasks.length === 0) {
    return <p className="text-zinc-500 italic">No tasks found in this project.</p>
  }

  return (
    <div className="grid gap-4 relative h-full overflow-hidden">
      <div className='overflow-y-auto flex flex-col h-full gap-3 pb-20 scroll-smooth custom-scrollbar relative'>
        <div className="flex flex-col gap-5 relative h-full p-5">
          {pinned.length > 0 && (
            <div className="flex flex-col border-b border-zinc-800 pb-4 mb-5 h-100">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Pinned</p>
              {pinned.map((task, i) => (
                <Task key={`pinned-${task.id}`} data={task} index={i} tasks={pinned} setTasks={setPinned} setPinned={setPinned} pinned={pinned} handlePinTask={handlePinTask} handleDelete={handleDelete} parentId={projectId}/>
              ))}
            </div>
          )}

          {tasks.map((task, i) => (
            <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
            >
              <Task data={task} index={i} tasks={tasks} setTasks={setTasks} setPinned={setPinned} pinned={pinned} handlePinTask={handlePinTask} handleDelete={handleDelete} parentId={projectId}/>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}