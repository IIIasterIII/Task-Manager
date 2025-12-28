"use client"
import { createGoal } from '@/app/actions/taskActions'
import { FC, useState, startTransition } from 'react'
import { MiniChart } from './miniChart' 
import { motion } from "motion/react"
import { toast } from 'sonner'

type TaskType = 'boolean' | 'numeric'

interface GoalTask {
    id: string
    title: string
    target: number
    color: string
    type: TaskType
}

interface ChartDataPoint {
    day: string
    [taskTitle: string]: number | string
}

interface GoalData {
    title: string
    description: string
    is_completed: boolean
    tasks: GoalTask[]
    chartData: ChartDataPoint[]
}

interface GoalTaskToSend {
    title: string
    color: string
    target: number
    type: "boolean" | "numeric"
}

export interface goalDataToSend {
    title: string
    description: string
    tasks: GoalTaskToSend[]
}

const PRESET_COLORS = [
    "#7c3aed", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", 
    "#ec4899", "#22d3ee", "#06b6d4", "#0891b2", "#6366f1", 
    "#f97316", "#fbbf24", "#fb7185", "#f43f5e", "#84cc16", 
    "#a855f7", "#d946ef", "#2dd4bf", "#94a3b8", "#c084fc",
]

interface GoalCreationProps {
    setOpen: (x: boolean) => void
    setOpenPanel: (x: boolean) => void
    setGoalListData: any
    defaultData: GoalData
}

const GoalCreation: FC<GoalCreationProps> = ({ setOpen, setOpenPanel, setGoalListData, defaultData }) => {
    const [goalData, setGoalData] = useState<GoalData>(defaultData)
    const [taskData, setTaskData] = useState<Omit<GoalTask, 'id'>>({
        title: "",
        target: 1,
        color: "#7c3aed",
        type: 'numeric'
    })

    const addTask = () => {
        if (!taskData.title.trim()) return
        
        const newTask: GoalTask = { ...taskData, id: crypto.randomUUID() }

        setGoalData(prev => ({
            ...prev,
            tasks: [...prev.tasks, newTask],
            chartData: prev.chartData.map(point => ({
                ...point,
                [taskData.title]: taskData.type === 'boolean' 
                    ? (Math.random() > 0.5 ? 100 : 0)
                    : Math.floor(Math.random() * 90) + 10 
            }))
        }))
        
        setTaskData({ title: "", target: 1, color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)], type: 'numeric' })
    }

    const handleCreateGoal = () => {
        if (!goalData.title.trim() || goalData.title.length > 50) {
            toast.error('Title is required (max 50 chars)')
            return
        }
        if (!goalData.description.trim()) {
            toast.error('Description is required')
            return
        }
        if (goalData.tasks.length === 0) {
            toast.error('Add at least one task')
            return
        }

        const dataToSend: goalDataToSend = {
            title: goalData.title,
            description: goalData.description,
            tasks: goalData.tasks.map(task => ({
                title: task.title,
                color: task.color,
                target: task.target,
                type: task.type
            }))
        }

        startTransition(async () => {
            const res = await createGoal(dataToSend)
            if (res?.success) {
                setGoalListData((prev: any) => [...prev, res.data])
                setOpen(false)
                toast.success("Goal launched!")
            }
        })
    }

    return (
        <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-[600] max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden"
            >
                <div className="p-6 border-b border-zinc-800 bg-zinc-950/20 flex flex-col w-full">
                    <div className='w-full flex flex-row justify-between'>
                        <input 
                            value={goalData.title}
                            onChange={(e) => setGoalData({...goalData, title: e.target.value})}
                            className="bg-transparent text-2xl font-bold outline-none placeholder:text-zinc-800 w-full" 
                            placeholder="Goal Title..." 
                        />
                        <button onClick={() => setOpen(false)} className="text-zinc-500 cursor-pointer ml-4 hover:text-white">✕</button>
                    </div>
                    <input 
                        value={goalData.description}
                        onChange={(e) => setGoalData({...goalData, description: e.target.value})}
                        className="bg-transparent text-xl font-medium outline-none placeholder:text-zinc-800 mt-2" 
                        placeholder="Goal description..." 
                    />
                </div>

                <MiniChart chartData={goalData.chartData} tasks={goalData.tasks} />

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <section>
                        <label className="text-[10px] uppercase text-zinc-500 font-black tracking-widest mb-4 block">New Requirement</label>
                        <div className='flex flex-col gap-4 p-4 bg-zinc-950/40 rounded-xl border border-zinc-800'>
                            <div className="grid grid-cols-2 gap-2">
                                {(['boolean', 'numeric'] as TaskType[]).map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setTaskData(prev => ({...prev, type: t, target: t === 'boolean' ? 1 : prev.target}))}
                                        className={`py-1.5 rounded-md text-[10px] font-bold uppercase border transition ${taskData.type === t ? 'bg-white border-white text-black' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input 
                                    className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg flex-1 outline-none text-sm"
                                    type="text" value={taskData.title} placeholder="e.g. Daily Workout" 
                                    onChange={e => setTaskData(prev => ({...prev, title: e.target.value}))}
                                />
                                {taskData.type !== 'boolean' && (
                                    <input 
                                        className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg w-28 outline-none text-sm"
                                        type="number" value={taskData.target}
                                        onChange={e => setTaskData(prev => ({...prev, target: Number(e.target.value)}))}
                                    />
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <div className="grid gap-2.5 grid-cols-10">
                                    {PRESET_COLORS.map(c => (
                                        <button 
                                            key={c} onClick={() => setTaskData(prev => ({...prev, color: c}))}
                                            className={`w-5 h-5 rounded-full border-2 transition ${taskData.color === c ? 'border-white' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                                <button onClick={addTask} className="bg-white text-black px-5 py-2 rounded-lg text-xs font-black hover:bg-zinc-200">
                                    ADD TASK
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2.5">
                            {goalData.tasks.map((task) => (
                                <div key={task.id} className="group flex gap-4 items-center bg-zinc-950/20 p-3 rounded-xl border border-zinc-800 hover:border-zinc-700">
                                    <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: task.color }} />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-zinc-200">{task.title}</p>
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase">
                                            {task.type} {task.type !== 'boolean' && `• Target: ${task.target}`}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setGoalData(p => ({...p, tasks: p.tasks.filter(t => t.id !== task.id)}))}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-500 transition cursor-pointer"
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="p-6 bg-zinc-950/40 border-t border-zinc-800 flex justify-between items-center">
                    <button onClick={() => setOpenPanel(true)} className="text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-zinc-400">System Reset</button>
                    <button onClick={handleCreateGoal} className="bg-violet-600 hover:bg-violet-500 px-8 py-2 rounded-xl text-xs font-black">LAUNCH GOAL</button>
                </div>
            </motion.div>
        </div>
    )
}

export default GoalCreation