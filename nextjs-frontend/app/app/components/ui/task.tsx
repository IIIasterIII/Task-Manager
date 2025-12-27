"use client"

import { FC, useState, useRef, useEffect, startTransition, SetStateAction, Dispatch } from 'react'
import { Calendar, Clock, MoreVertical, ArrowUp, ArrowDown, Pencil, Copy, Trash2, Pin, ChevronRight, CalendarDays, Sun, Ban, Sparkles, ShieldAlert, ShieldCheck, Shield, Zap } from 'lucide-react'
import { createTask, moveTask, updateTaskPriority, updateTaskSchedule } from '@/app/actions/taskActions'
import { motion } from "motion/react"
import { Priority, TaskCreate, TaskDTO } from '@/app/types/task'

interface TaskProps {
    data: TaskDTO,
    tasks: TaskDTO[],
    index: number,
    setTasks: Dispatch<SetStateAction<TaskDTO[]>>,
    pinned: TaskDTO[]
    setPinned: Dispatch<SetStateAction<TaskDTO[]>>,
    handlePinTask: (x: TaskDTO) => void,
    handleDelete: (x: TaskDTO) => void
}

const Task: FC<TaskProps> = ({ data, tasks, index, setTasks, pinned, setPinned, handlePinTask, handleDelete }) => {
    const [completed, setCompleted] = useState(false)
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node))
                setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const priorityColors = {
        LOW: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        MEDIUM: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
        HIGH: 'text-red-500 bg-red-500/10 border-red-500/20',
        URGENT: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    }

    const priorityColorsHover = {
        LOW: 'hover:border-blue-900/30',
        MEDIUM: 'hover:border-orange-900/30',
        HIGH: 'hover:border-red-900/30',
        URGENT: 'hover:border-violet-900/30',
    }

    const priorityColorsCompleted = {
        LOW: 'bg-blue-600 border-blue-600  shadow-[0_0_15px_rgba(124,58,237,0.4)]',
        MEDIUM: 'bg-orange-600 border-orange-600  shadow-[0_0_15px_rgba(124,58,237,0.4)]',
        HIGH: 'bg-red-600 border-red-600  shadow-[0_0_15px_rgba(124,58,237,0.4)]',
        URGENT: 'bg-violet-600 border-violet-600  shadow-[0_0_15px_rgba(124,58,237,0.4)]',
    }

    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleCustomDateClick = () => {
        dateInputRef.current?.showPicker();
    };

    const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value
        if (selectedDate) {
            updateTaskDate(selectedDate, "23:59");
        }
    };

    const ActionButton = ({ icon: Icon, label, onClick, variant = 'default' }: any) => (
        <button 
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3 py-2 text-[12px] rounded-lg transition-colors
                ${variant === 'danger' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-white/5 text-zinc-300'}`}
        >
            <div className="flex items-center gap-2">
                <Icon size={14} />
                <span>{label}</span>
            </div>
            <ChevronRight size={12} className="opacity-30" />
        </button>
    )

    const handleMoveTask = (move: "up" | "down") => {
        const newTasks = [...tasks]
        const targetIndex = move === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newTasks.length) return;
        [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]];
        setTasks(newTasks);

        startTransition(async () => {
            if(!data.parent_id) return
            const res = await moveTask(move, data.parent_id, data.id)
            console.log(res)
        })
    }

    const updateTaskInState = (newPriority: Priority) => {
        setTasks((prevTasks: TaskDTO[]) => 
            prevTasks.map((task: TaskDTO) => 
                task.id === data.id ? { ...task, priority: newPriority } : task
            )
        );

        startTransition(async () => {
            const res = await updateTaskPriority(data.id, newPriority);
            if (res.error) {
                console.error(res.error);
            }
        });
    };

    const updateTaskDate = (newDate: string | undefined, newTime: string | undefined) => {
        setTasks((prevTasks: TaskDTO[]) => 
            prevTasks.map((task: TaskDTO) => 
                task.id === data.id 
                    ? { ...task, date_at: newDate, time_at: newTime } 
                    : task
            )
        );
    
        startTransition(async () => {
            const result = await updateTaskSchedule(data.id, newDate, newTime);
            if (result.error) {
                console.error("Error data request:", result.error);
            } else {
                console.log("Yeah!! We got it!");
            }
        });
    };

    const handleDuplicate = () => {
        const newTask : TaskCreate = {
            title: data.title,
            priority: data.priority,
            parent_id: data.parent_id
        }
        startTransition(async () => {
            const res = await createTask(newTask)
            console.log(res)
        })
    }

    const handleQuickDate = (type: 'today' | 'tomorrow' | 'weekend' | 'none') => {
        let targetDate: string | undefined = undefined
        const now = new Date();
    
        switch (type) {
            case 'today':
                targetDate = now.toISOString().split('T')[0];
                break;
            case 'tomorrow':
                const tomorrow = new Date();
                tomorrow.setDate(now.getDate() + 1);
                targetDate = tomorrow.toISOString().split('T')[0];
                break;
            case 'weekend':
                const weekend = new Date();
                const dayOfWeek = now.getDay();
                const daysUntilSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek);
                weekend.setDate(now.getDate() + daysUntilSaturday);
                targetDate = weekend.toISOString().split('T')[0];
                break;
            case 'none':
                targetDate = undefined;
                break;
        }
    
        updateTaskDate(targetDate, targetDate ? "23:59" : undefined);
    };

    return (
        <div className={`group w-full min-h-[60] bg-zinc-900/40 border border-zinc-800/50 rounded-2xl
         flex flex-row items-center gap-4 px-4 py-3 transition-all duration-500 relative hover:bg-zinc-800/40 ${priorityColorsHover[data.priority]} ${completed && 'opacity-50'}`}>
            
            <div 
                className={`shrink-0 w-5 h-5 rounded-full border-2 flex justify-center items-center transition-all duration-300 cursor-pointer
                    ${completed ? priorityColorsCompleted[data.priority] : priorityColors[data.priority]}`}
                onClick={() => setCompleted(!completed)}>
                {completed && <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in duration-300" />}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="flex items-center gap-3">
                    <p className={`font-medium text-[15px] truncate transition-all duration-500 select-none ${completed ? 'line-through text-zinc-600' : 'text-zinc-100'}`}>
                        {data.title}
                    </p>
                    
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border animate-in fade-in slide-in-from-left-2 ${priorityColors[data.priority]}`}>
                        <div className="w-1 h-1 rounded-full bg-currentColor shadow-[0_0_5px_currentColor]" />
                        {data.priority}
                    </div>
                </div>

                <div className="flex items-center gap-3 text-[12px]">
                    {data.description && (
                        <span className="text-zinc-500 truncate max-w-[180]">
                            {data.description}
                        </span>
                    )}

                    <div className="flex items-center gap-2 text-zinc-500 font-medium">
                        {data.date_at && (
                            <div className="flex items-center gap-1.5">
                                <CalendarDays size={13} className="text-violet-500/70" />
                                <span>{data.date_at}</span>
                            </div>
                        )}
                        {data.time_at && (
                            <div className="flex items-center gap-1.5">
                                <Clock size={13} className="text-sky-500/70" />
                                <span>{data.time_at}</span>
                            </div>
                        )}
                        {!data.date_at && <span className="text-[10px] text-zinc-700 tracking-widest uppercase">Ongoing</span>}
                    </div>
                </div>
            </div>
            <button title="Setting" className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${ priorityColors[data.priority] } bg-zinc-900 hover:bg-zinc-800`} onClick={() => setOpen(!open)}><MoreVertical size={18}/></button>
            {open && (
                <div 
                    ref={menuRef}
                    className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                >
                    <div className="px-3 py-1.5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Navigation</p>
                    </div>
                    <ActionButton icon={ArrowUp} label="Add task above" onClick={() => handleMoveTask("up")} />
                    <ActionButton icon={ArrowDown} label="Move task below" onClick={() => handleMoveTask("down")} />
                    
                    <div className="h-[1] bg-white/5 my-2 mx-2" />

                    <div className="px-3 py-1.5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Schedule</p>
                    </div>
                        <div className="grid grid-cols-4 gap-1 px-1 mb-2">
                            <button 
                                title="Today" 
                                onClick={() => handleQuickDate('today')}
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-violet-500/20 text-violet-400 transition-all border border-transparent hover:border-violet-500/30"
                            >
                                <Sparkles size={16} />
                            </button>

                            <button 
                                title="Tomorrow" 
                                onClick={() => handleQuickDate('tomorrow')}
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-orange-500/20 text-orange-400 transition-all border border-transparent hover:border-orange-500/30"
                            >
                                <Sun size={16} />
                            </button>

                            <button 
                                title="This Weekend (Saturday)" 
                                onClick={() => handleQuickDate('weekend')}
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-sky-500/20 text-sky-400 transition-all border border-transparent hover:border-sky-500/30"
                            >
                                <CalendarDays size={16} />
                            </button>

                            <button 
                                title="No Date" 
                                onClick={() => handleQuickDate('none')}
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-zinc-700 text-zinc-500 transition-all border border-transparent hover:border-zinc-600"
                            >
                                <Ban size={16} />
                            </button>
                        </div>
                        <>
                            <input type="date" ref={dateInputRef} onChange={onDateChange} className="hidden relative" />
                            <div ref={menuRef} className="..."><ActionButton icon={Calendar} label="Pick custom date" onClick={handleCustomDateClick} /></div>
                        </>
                    <div className="h-[1] bg-white/5 my-2 mx-2" />
                    <div className="px-3 py-1.5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Priority</p>
                    </div>
                    <div className="flex bg-zinc-950/50 p-1 rounded-xl gap-1 mx-1 mb-2 border border-white/5">
                        {[
                            { p: 'LOW', icon: ShieldCheck, color: 'text-blue-400', hoverBg: 'hover:bg-blue-400/10' },
                            { p: 'MEDIUM', icon: Shield, color: 'text-orange-400', hoverBg: 'hover:bg-orange-400/10' },
                            { p: 'HIGH', icon: ShieldAlert, color: 'text-red-500', hoverBg: 'hover:bg-red-500/10' },
                            { p: 'URGENT', icon: Zap, color: 'text-violet-500', hoverBg: 'hover:bg-violet-500/10' }
                        ].map((item) => {
                            const isActive = data.priority === item.p;
                            return (
                                <button
                                    key={item.p}
                                    title={item.p}
                                    type="button"
                                    className={`flex-1 flex justify-center py-2 rounded-lg transition-all duration-200 active:scale-90
                                        ${item.hoverBg} 
                                        ${isActive ? `bg-white/10 shadow-inner ${item.color} opacity-100` : 'text-zinc-500 opacity-40 hover:opacity-100'}`}
                                    onClick={() => updateTaskInState(item.p as Priority)}
                                >
                                    <item.icon 
                                        size={16} 
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className="transition-transform duration-200"
                                        fill={isActive ? "currentColor" : "none"}
                                        fillOpacity={0.2}
                                    />
                                </button>
                            );
                        })}
                    </div>
                    <div className="h-[1] bg-white/5 my-2 mx-2" />
                    <div className="px-3 py-1.5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Actions</p>
                    </div>
                    <ActionButton icon={Pencil} label="Edit details" onClick={() => {}}/>
                    <ActionButton icon={Copy} label="Duplicate" onClick={handleDuplicate} />
                    <ActionButton icon={Pin} label="Pin task" onClick={() => handlePinTask(data)}/>
                    <div className="h-[1] bg-white/5 my-2 mx-2" />
                    <ActionButton 
                        icon={Trash2} 
                        label="Delete task" 
                        variant="danger" 
                        onClick={() => {handleDelete(data)}} 
                    />
                </div>
            )}
        </div>
    )
}

export default Task