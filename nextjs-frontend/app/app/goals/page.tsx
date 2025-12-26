"use client"
import { FC, startTransition, useEffect, useState } from 'react'
import { ResponsiveContainer, YAxis, XAxis, Tooltip, Area, AreaChart } from 'recharts';
import { toast } from 'sonner';

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

export const MiniChart: FC<{ chartData: any[], tasks: GoalTask[] }> = ({ chartData, tasks }) => (
    <ResponsiveContainer width="100%" height={250} className="outline-none">
        <AreaChart data={chartData} margin={{ top: 50, right: 10, left: 10, bottom: 20 }}>
            <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#52525b', fontSize: 11 }} 
                dy={10} 
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px' }}
                cursor={{ stroke: '#3f3f46', strokeDasharray: '4 4' }}
            />
            {tasks.map((task) => (
                <Area
                    key={task.id}
                    type="monotone"
                    dataKey={task.title}
                    stroke={task.color}
                    fillOpacity={0} 
                    strokeWidth={2}
                    activeDot={{ r: 4, fill: task.color, strokeWidth: 0 }}
                />
            ))}
        </AreaChart>
    </ResponsiveContainer>
);

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

const Page = () => {
    const [open, setOpen] = useState(false);
    const [openPanel, setOpenPanel] = useState(false);
    
    const PRESET_COLORS = [
        "#7c3aed", // Rich Violet
        "#ef4444", // Vivid Red
        "#3b82f6", // Electric Blue
        "#10b981", // Emerald Green
        "#f59e0b", // Golden Amber
        "#ec4899", // Hot Pink
        "#22d3ee", // Cyan Sky
        "#06b6d4", // Deep Aqua
        "#0891b2", // Teal
        "#6366f1", // Indigo Night
        "#f97316", // Bright Orange
        "#fbbf24", // Sunflower Yellow
        "#fb7185", // Soft Rose
        "#f43f5e", // Crimson Rose
        "#84cc16", // Lime Energy
        "#a855f7", // Deep Purple
        "#d946ef", // Fuchsia
        "#2dd4bf", // Mint/Turquoise
        "#94a3b8", // Blue Steel (Zinc)
        "#c084fc", // Pastel Purple
    ];

    const [taskData, setTaskData] = useState<Omit<GoalTask, 'id'>>({
        title: "", 
        target: 0, 
        color: "#7c3aed",
        type: 'numeric'
    });

    const defaultData: GoalData = {
        title: "",
        description: "",
        is_completed: false,
        tasks: [
            { id: "1", title: "LeetCode", target: 1, color: "#60a5fa", type: 'boolean' },
            { id: "2", title: "Read Book", target: 100, color: "#f87171", type: 'numeric' }, 
            { id: "3", title: "Deep Work", target: 1000, color: "#4ade80", type: 'numeric' }   
        ],
        chartData: [
            { day: 'Mon', "LeetCode": 100, "Read Book": 30, "Deep Work": 80 },
            { day: 'Tue', "LeetCode": 0, "Read Book": 55, "Deep Work": 45 },
            { day: 'Wed', "LeetCode": 100, "Read Book": 85, "Deep Work": 12 },
            { day: 'Thu', "LeetCode": 100, "Read Book": 95, "Deep Work": 90 }, 
            { day: 'Fri', "LeetCode": 0, "Read Book": 40, "Deep Work": 40 },
            { day: 'Sat', "LeetCode": 0, "Read Book": 20, "Deep Work": 25 },
            { day: 'Sun', "LeetCode": 100, "Read Book": 10, "Deep Work": 5 }, 
        ],
    };

    const [goalData, setGoalData] = useState<GoalData>(defaultData);

    const addTask = () => {
        if (!taskData.title) return;
        
        const newTaskTitle = taskData.title;
        const taskType = taskData.type;
        const newTask: GoalTask = { ...taskData, id: crypto.randomUUID() };

        setGoalData(prev => ({
            ...prev,
            tasks: [...prev.tasks, newTask],
            chartData: prev.chartData.map(point => ({
                ...point,
                [newTaskTitle]: taskType === 'boolean' 
                    ? (Math.random() > 0.5 ? 100 : 0)
                    : Math.floor(Math.random() * 90) + 10 
            }))
        }));
        
        setTaskData({ 
            title: "", 
            target: 0, 
            color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)], 
            type: 'numeric' 
        });
    };

    useEffect(() => {
        console.log(goalData)
    }, [goalData])

    const handleCreateGoal = () => {
        if (!goalData.title.trim() || goalData.title.length > 50) {
            toast.error('Title is required (max 50 chars)');
            return;
        }

        if (!goalData.description.trim() || goalData.description.length > 50) {
            toast.error('Maximum 100 characters for description! and u must have one!', { description: 'Syntax error' });
            return;
        }
    
        if (goalData.tasks.length === 0 || goalData.tasks.length > 10) {
            toast.error('Task a goal have from 1 to 10 tasks minimum and maximum', { description: 'Syntax error' });
            return;
        }

        if (!goalData.title.trim() || goalData.title.length > 50) {
            return;
        }
        
        const hasInvalidTask = goalData.tasks.some(t => t.title.trim() === "" || t.target <= 0);
        if (hasInvalidTask) {
            toast.error('All tasks must have a title and a target > 0');
            return;
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
        };

        console.log(dataToSend)

        startTransition(async () => {

        })
    }

    return (
        <div className='w-full h-full p-5 relative bg-black min-h-screen text-white'>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex ml-auto px-5 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 font-semibold transition shadow-lg cursor-pointer"
            > Create a goal
            </button>

            {openPanel && (
                <div className='fixed inset-0 m-auto w-80 h-40 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col p-6 shadow-2xl z-100 items-center justify-center text-center'>
                    <h1 className="mb-4 font-bold text-sm">Reset all progress to default?</h1>
                    <div className="flex gap-4">
                        <button className="px-4 py-1 bg-zinc-800 rounded hover:bg-zinc-700 transition text-xs" onClick={() => setOpenPanel(false)}>Cancel</button>
                        <button className="px-4 py-1 bg-red-600 rounded hover:bg-red-500 transition text-xs" onClick={() => { setGoalData(defaultData); setOpenPanel(false); }}>Reset</button>
                    </div>
                </div>
            )}

            {open && (
                <div className='absolute inset-0 m-auto w-[600] h-[800] bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden'>
                    <div className="p-6 border-b border-zinc-800 bg-zinc-950/20 flex justify-between flex-col w-full">
                    <div className='w-full flex flex-row justify-between'>
                        <input 
                            value={goalData.title}
                            onChange={(e) => setGoalData({...goalData, title: e.target.value})}
                            className="bg-transparent text-2xl font-bold outline-none placeholder:text-zinc-800" 
                            placeholder="Goal Title..." 
                        />
                        <button onClick={() => setOpen(false)} className="text-zinc-500 cursor-pointer ml-auto hover:text-white transition">✕</button>
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
                            <div className='flex flex-col gap-4 p-4 bg-zinc-950/40 rounded-xl border border-zinc-800 shadow-inner'>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['boolean', 'numeric'] as TaskType[]).map(t => (
                                        <button 
                                            key={t}
                                            onClick={() => setTaskData(prev => ({...prev, type: t, target: t === 'boolean' ? 1 : prev.target}))}
                                            className={`py-1.5 rounded-md text-[10px] font-bold uppercase border transition ${taskData.type === t ? 'bg-zinc-100 border-zinc-100 text-black' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <input 
                                        className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg flex-1 outline-none text-sm placeholder:text-zinc-700"
                                        type="text" value={taskData.title} placeholder="e.g. Daily Workout" 
                                        onChange={e => setTaskData(prev => ({...prev, title: e.target.value}))}
                                    />
                                    {taskData.type !== 'boolean' && (
                                        <input 
                                            className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg w-28 outline-none text-sm font-mono"
                                            type="number"
                                            placeholder=""
                                            onChange={e => setTaskData(prev => ({...prev, target: Number(e.target.value)}))}
                                        />
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <div className="grid gap-2.5 grid-cols-10">
                                        {PRESET_COLORS.map(c => (
                                            <button 
                                                key={c} onClick={() => setTaskData(prev => ({...prev, color: c}))}
                                                className={`w-5 h-5 rounded-full border-2 transition transform hover:scale-110 ${taskData.color === c ? 'border-white' : 'border-transparent shadow-md'}`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                    <button onClick={addTask} className="bg-white text-black px-5 py-2 rounded-lg text-xs font-black hover:bg-zinc-200 transition active:scale-95">
                                        ADD TASK
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2.5">
                                {goalData.tasks.map((task) => (
                                    <div key={task.id} className="group flex gap-4 items-center bg-zinc-950/20 p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 transition">
                                        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: task.color }} />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-zinc-200">{task.title}</p>
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">
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
                        <div className="flex gap-3 items-center justify-between w-full">
                            <button onClick={() => setOpenPanel(true)} className="text-zinc-600 text-[10px] font-black uppercase hover:text-zinc-400 tracking-widest transition cursor-pointer">System Reset</button>
                            <button onClick={handleCreateGoal}
                            className="bg-violet-600 hover:bg-violet-500 px-8 py-2 rounded-xl text-xs font-black shadow-lg shadow-violet-900/20 transition active:scale-95 cursor-pointer">
                                LAUNCH GOAL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;