"use client"
import GoalCreation from '../components/ui/goalCreation'
import { getGoals } from '@/app/actions/taskActions'
import { GoalCard } from '../components/ui/goalCard'
import Button from '../components/ui/buttons/button'
import { AnimatePresence } from "motion/react"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const defaultData = {
    title: "",
    description: "",
    is_completed: false,
    tasks: [
        { id: "1", title: "LeetCode", target: 1, color: "#60a5fa", type: 'boolean' as const },
        { id: "2", title: "Read Book", target: 100, color: "#f87171", type: 'numeric' as const }, 
        { id: "3", title: "Deep Work", target: 1000, color: "#4ade80", type: 'numeric' as const }   
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

const Page = () => {
    const [open, setOpen] = useState(false);
    const [openPanel, setOpenPanel] = useState(false);
    const [goalListData, setGoalListData] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        getGoals().then(setGoalListData)
    }, [router])

    return (
        <div className='w-full h-full p-5 relative min-h-screen text-white flex flex-col gap-5 overflow-y-auto pb-25'>
            <div className='w-full flex justify-end'>
                <Button title={"Create a goal"} func={() => setOpen(true)}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goalListData.map((goal, i) => <GoalCard key={goal.id || i} goal={goal} />)}
            </div>

            <AnimatePresence>
                {openPanel && (
                    <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
                        <div className='w-80 bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl text-center'>
                            <h1 className="mb-4 font-bold text-sm">Reset progress to default?</h1>
                            <div className="flex gap-4 justify-center">
                                <button className="px-4 py-1 bg-zinc-800 rounded text-xs hover:bg-zinc-700" onClick={() => setOpenPanel(false)}>Cancel</button>
                                <button className="px-4 py-1 bg-red-600 rounded text-xs hover:bg-red-500" onClick={() => { /* твоя логика сброса */; setOpenPanel(false); }}>Reset</button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {open && (
                    <GoalCreation 
                        setOpen={setOpen}
                        setOpenPanel={setOpenPanel} 
                        setGoalListData={setGoalListData}
                        defaultData={defaultData}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Page;