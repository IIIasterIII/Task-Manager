"use client"

import { usePathname } from "next/navigation"
import { startTransition, useEffect, useState } from "react"
import { MiniChart } from "../../components/ui/miniChart"
import { getGoal } from "@/app/actions/taskActions"
import { TaskInputSection } from "../../components/ui/taskInputSection"

interface ChartEntry {
  id: number
  id_goal_task: number
  value: number
  date: string
}

type TaskType = "boolean" | "numeric"

interface Task {
  id: number
  goal_id: number
  chart_entries: ChartEntry[]
  color: string
  target: 1
  title: string
  type: TaskType
}

interface GoalData {
  id: number
  title: string
  description: string
  is_completed: false
  user_id: number
  tasks: Task[]
}

const formatChartData = (tasks: Task[]) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  const now = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (6 - i))
    return {
      date: d.toISOString().split("T")[0],
      dayName: daysOfWeek[d.getDay()],
    }
  })

  return last7Days.map(({ date, dayName }) => {
    const entry: any = { day: dayName, fullDate: date }
    tasks.forEach((task) => {
      if (!task || !task.chart_entries) return
      const chartEntry = task.chart_entries.find((e) => {
        const entryDate = e.date.split("/").reverse().join("-") 
        return entryDate === date
      })
      const value = chartEntry ? (chartEntry.value / (task.target || 1)) * 100 : 0
      entry[task.title] = Math.min(value, 100).toFixed()
    })

    return entry
  })
}

const Page = () => {
  const pathname = usePathname()
  const [goalData, setGoalData] = useState<GoalData | null>(null)

  useEffect(() => {
    const goalId = pathname.split("/").pop()
    if (!goalId) return

    startTransition(async () => {
      const res = await getGoal(Number(goalId))
      setGoalData(res)
    })
  }, [pathname])

  useEffect(() => {
    console.log("Goal Data:", goalData)
  }, [goalData])

  const chartData = goalData ? formatChartData(goalData.tasks) : []

  if (!goalData) return <div></div>

  return (
    <div className="p-6 bg-site-bg w-full select-none h-full overflow-y-scroll flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-site-text">{goalData.title}</h1>
        <p className="text-second-text">{goalData.description}</p>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-4">
        <h2 className="text-sm font-bold text-second-text uppercase tracking-widest mb-4 ml-4">
          Activity (Current Week)
        </h2>
        {goalData && <MiniChart chartData={chartData} tasks={goalData.tasks} />}
      </div>

      <TaskInputSection goalData={goalData} setGoalData={setGoalData} />
    </div>
  )
}

export default Page
