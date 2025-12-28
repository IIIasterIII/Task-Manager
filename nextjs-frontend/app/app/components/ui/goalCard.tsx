"use client"
import { FC } from "react"
import { CheckCircle2, Target, Zap } from 'lucide-react'
import { useRouter } from "next/navigation"

type TaskType = 'boolean' | 'numeric'

interface GoalTask {
    id: string
    title: string
    target: number
    color: string
    type: TaskType
}

interface ChartDataPoint {
    day: string;
    [taskTitle: string]: number | string
}

interface GoalData {
    title: string
    description: string
    is_completed: boolean
    tasks: GoalTask[];
    chartData: ChartDataPoint[];
}

interface GoalDataRes {
    id: number
    title: string
    description: string
    is_completed: boolean
    tasks: GoalTask[];
    chartData: ChartDataPoint[];
}

export const GoalCard: FC<{ goal: GoalDataRes }> = ({ goal }) => {
    const router = useRouter()
    const getTaskIcon = (type: string) => {
        switch (type) {
            case 'boolean': return <Zap size={14} />
            default: return <Target size={14} />
        }
    }

    return (
        <div className="w-full bg-zinc-900 border mt-5 border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {goal.title}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 italic">
                        {goal.description || "No description provided"}
                    </p>
                </div>
                {goal.is_completed && (
                    <span className="bg-emerald-500/10 text-emerald-500 p-1 rounded-full">
                        <CheckCircle2 size={20} />
                    </span>
                )}
            </div>

            <div className="mb-6">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-2">
                    <span>Overall Progress</span>
                    <span>{goal.tasks.length} Tasks</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                    {goal.tasks.map((task) => (
                        <div 
                            key={task.id}
                            style={{ 
                                width: `${100 / goal.tasks.length}%`, 
                                backgroundColor: task.color 
                            }}
                            className="h-full border-r border-zinc-900 last:border-0 opacity-80"
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {goal.tasks.slice(0, 4).map((task) => (
                    <div key={task.id} className="flex items-center gap-2 bg-zinc-950/50 border border-zinc-800/50 rounded-lg p-2">
                        <div 
                            className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                            style={{ backgroundColor: task.color }} 
                        />
                        <div className="flex flex-col">
                            <span className="text-[11px] font-medium text-zinc-300 truncate w-24">
                                {task.title}
                            </span>
                            <div className="flex items-center gap-1 text-zinc-600">
                                {getTaskIcon(task.type)}
                                <span className="text-[9px] font-bold uppercase">
                                    {task.type === 'boolean' ? 'Logic' : `${task.target}`}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {goal.tasks.length > 4 && (
                    <div className="col-span-2 text-center text-[10px] text-zinc-600 font-bold uppercase pt-1">
                        + {goal.tasks.length - 4} more tasks
                    </div>
                )}
            </div>

            <button onClick={() => router.push(`/app/goals/${goal.id}`)} className="w-full mt-5 py-2.5 bg-zinc-800 hover:bg-zinc-100 hover:text-black text-zinc-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98]">
                View Details
            </button>
        </div>
    )
}