"use client"

import { FC, useState } from 'react'
import { Calendar, Clock, MoreVertical, Flag } from 'lucide-react'
import { Priority } from '@/app/types/task'

interface TaskProps {
    data: {
  id: number
  title: string
  description?: string
  priority: Priority
  date_at?: string | null
  time_at?: string | null
  is_completed?: boolean
}
}

const Task: FC<TaskProps> = ({ data }) => {
    const [completed, setCompleted] = useState(false)

    const priorityColors = {
        LOW: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        MEDIUM: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
        HIGH: 'text-red-500 bg-red-500/10 border-red-500/20',
        URGENT: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    }

    return (
        <div className={`group w-full min-h-[60] bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-row items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-zinc-800/80 hover:border-zinc-700 ${completed ? 'opacity-60' : ''}`}>
            
            <div 
                className={`shrink-0 w-6 h-6 rounded-lg border-2 flex justify-center items-center transition-all duration-200 cursor-pointer
                    ${completed 
                        ? 'bg-violet-600 border-violet-600 shadow-[0_0_10px_rgba(124,58,237,0.5)]' 
                        : 'border-zinc-600 hover:border-zinc-400'}`} 
                onClick={() => setCompleted(!completed)}>
                {completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="white" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm truncate duration-300 select-none ${completed ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                        {data.title}
                    </p>
                    
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border ${priorityColors[data.priority]}`}>
                        <Flag size={10} fill="currentColor" />
                        {data.priority}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    {data.description && (
                        <span className="text-zinc-500 italic truncate max-w-[200]">
                            {data.description}
                        </span>
                    )}

                    <div className="flex items-center gap-3 text-zinc-400">
                        {data.date_at ? (
                            <div className="flex items-center gap-1 bg-zinc-800 px-1.5 py-0.5 rounded">
                                <Calendar size={12} className="text-violet-400" />
                                <span>{data.date_at}</span>
                            </div>
                        ) : (
                            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Everlasting</span>
                        )}

                        {data.time_at && (
                            <div className="flex items-center gap-1 bg-zinc-800 px-1.5 py-0.5 rounded">
                                <Clock size={12} className="text-sky-400" />
                                <span>{data.time_at}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/*Pin task, delete task, edit task (title, description, color), set(priority, time, date), duplicate, move to... , add task above <-> add task below*/} 
            <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-500 transition-all">
                <MoreVertical size={16} />
            </button>
        </div>
    )
}

export default Task