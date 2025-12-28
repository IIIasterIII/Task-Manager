"use client"
import { deleteTask, togglePinTask, getTasks, getPinnedTaskIds } from '@/app/actions/taskActions'
import { startTransition, useEffect, useState } from 'react'
import { useAppSelector } from '@/app/lib/hook'
import Task from '../../components/ui/task'
import { TaskDTO } from '@/app/types/task'
import { motion, AnimatePresence } from "motion/react"
import { Pin, Inbox } from 'lucide-react'

interface Props {
  initialTasks: TaskDTO[],
  initialPinnedTasks: TaskDTO[],
  projectId: number
}

export default function TaskListClient({ initialTasks, initialPinnedTasks, projectId }: Props) {
  const [tasks, setTasks] = useState<TaskDTO[]>(initialTasks)
  const [pinned, setPinned] = useState<TaskDTO[]>(initialPinnedTasks)
  const [isLoading, setIsLoading] = useState(false)
  const taskDataCreation = useAppSelector((state) => state.task.task)

  // 1. СИНХРОНИЗАЦИЯ С СЕРВЕРОМ (Решает проблему 401/Refresh Token)
  useEffect(() => {
    // Если сервер вернул пустоту, но мы видим в логах, что токен обновился,
    // делаем повторный запрос на клиенте.
    const syncData = async () => {
      if (initialTasks.length === 0 && initialPinnedTasks.length === 0) {
        setIsLoading(true)
        const [res, resPinnedIds] = await Promise.all([ 
          getTasks(projectId), 
          getPinnedTaskIds() 
        ]);

        if (res.success && res.data) {
          const all = res.data as TaskDTO[];
          const pinnedIds = resPinnedIds?.data?.pinned_ids || [];
          setPinned(all.filter(t => pinnedIds.includes(t.id)));
          setTasks(all.filter(t => !pinnedIds.includes(t.id)));
        }
        setIsLoading(false)
      } else {
        // Если пропсы пришли нормальные, просто обновляем стейт
        setTasks(initialTasks);
        setPinned(initialPinnedTasks);
      }
    };

    syncData();
  }, [projectId, initialTasks, initialPinnedTasks]);

  // 2. ОБРАБОТКА СОЗДАНИЯ НОВОЙ ЗАДАЧИ
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
      setPinned(prev => prev.filter(x => x.id !== taskToPin.id));
      setTasks(prev => [taskToPin, ...prev]);
    } else {
      setTasks(prev => prev.filter(x => x.id !== taskToPin.id));
      setPinned(prev => [taskToPin, ...prev]);
    }
    startTransition(async () => {
        await togglePinTask(taskToPin.id, !isAlreadyPinned);
    });
  };

  const handleDelete = (x: TaskDTO) => {
    setTasks(prev => prev.filter(el => el.id !== x.id))
    setPinned(prev => prev.filter(el => el.id !== x.id))
    startTransition(async () => { await deleteTask(x.id) });
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-site-text tracking-tight">Project Tasks</h1>
        {isLoading && <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />}
      </div>

      <div className='flex-1 overflow-y-auto pr-2 scroll-smooth custom-scrollbar'>
        <div className="flex flex-col gap-8 pb-24">
          
          <AnimatePresence mode="popLayout">
            {pinned.length > 0 && (
              <motion.div 
                key="pinned-section-container"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 px-1">
                  <Pin size={14} className="text-accent fill-accent/20" />
                  <p className="text-[11px] font-black text-second-text uppercase tracking-[0.2em]">Pinned</p>
                </div>
                <div className="flex flex-col gap-3 border-l-2 border-accent/10 ml-1.5 pl-4">
                  {pinned.map((task, i) => (
                    <motion.div
                        key={`pinned-${task.id}`}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Task data={task} index={i} tasks={pinned} setTasks={setPinned} setPinned={setPinned} pinned={pinned} handlePinTask={handlePinTask} handleDelete={handleDelete} parentId={projectId}/>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

              <div className="flex flex-col gap-3">
                {tasks.length > 0 && (
                  <div className="flex items-center gap-2 px-1">
                    <p className="text-[11px] font-black text-second-text uppercase tracking-[0.2em]">Active Tasks</p>
                  </div>
                )}
                
                {tasks.length === 0 && pinned.length === 0 && !isLoading ? (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl"
                  >
                    <Inbox size={40} className="text-zinc-800 mb-4" />
                    <p className="text-second-text italic text-sm">No tasks found in this project.</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {tasks.map((task, i) => (
                      <motion.div
                        key={`active-${task.id}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Task data={task} index={i} tasks={tasks} setTasks={setTasks} setPinned={setPinned} pinned={pinned} handlePinTask={handlePinTask} handleDelete={handleDelete} parentId={projectId}/>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}