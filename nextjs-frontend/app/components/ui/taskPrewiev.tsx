"use client"
import { FC } from 'react'
import { CalendarDays, ShieldCheck, Shield, ShieldAlert, Zap } from 'lucide-react'
import { motion } from "motion/react"

interface TaskPreviewProps {
    title: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    date?: string;
    completed?: boolean;
    delay?: number;
}

const TaskPreview: FC<TaskPreviewProps> = ({ title, priority, date, completed, delay = 0 }) => {
    const priorityStyles = {
        LOW: { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: ShieldCheck },
        MEDIUM: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: Shield },
        HIGH: { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: ShieldAlert },
        URGENT: { text: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20', icon: Zap },
    }

    const s = priorityStyles[priority]
    const Icon = s.icon

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`w-full bg-zinc-900/40 border border-zinc-800/50 rounded-2xl flex items-center gap-3 px-4 py-3 backdrop-blur-sm hover:bg-zinc-800/60 transition-colors ${completed ? 'opacity-40' : ''}`}
        >
            <div className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${completed ? 'bg-[#FE0C46] border-[#FE0C46]' : s.border}`}>
                {completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>

            <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium truncate ${completed ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                    {title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black border ${s.text} ${s.bg} ${s.border}`}>
                        <Icon size={10} /> {priority}
                    </div>
                    {date && (
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                            <CalendarDays size={10} /> <span>{date}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default TaskPreview