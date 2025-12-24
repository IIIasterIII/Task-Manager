"use client";

import { motion } from "motion/react";
import { useAppSelector, useAppDispatch } from "@/app/lib/hook";
import { toggleModal } from "@/app/features/ui/userSlice";
import { Priority, Task, TaskDTO } from "@/app/types/task"
import { startTransition, useEffect, useState } from "react";
import { createTask } from "@/app/actions/taskActions";
import { clearTask, confirmTask, setTaskOptimistic } from "@/app/features/ui/taskSlice";

const Ellipsis = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
    />
  </svg>
);

export default function TaskCreation() {
  const dispatch = useAppDispatch();
  const isPanelId = useAppSelector((state) => state.ui.panel_id)
  const taskSliceData = useAppSelector((state) => state.task.task)
  const [open, setOpen] = useState(false)
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    priority: Priority.LOW,
    parent_id: isPanelId || null
  })

  const handleCreateTask = async () => {
    const tempId = Math.floor(Math.random() * -1000000)
    const optimisticTask: TaskDTO = {
      ...task,
      id: tempId,   
      isOptimistic: true 
    };

    dispatch(setTaskOptimistic(optimisticTask))

    startTransition(async () => {
      const res = await createTask(task)
      if(res.success)
        dispatch(confirmTask(res.data));
      else
        dispatch(clearTask())
      console.log(res)
    })
  }

  useEffect(() => {
    console.log(taskSliceData)
  }, [taskSliceData])
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 1.2 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 w-screen z-50 pointer-events-none flex items-center justify-center"
    >
      <div className="flex min-h-full items-start translate-y-50 pointer-events-auto text-center">
        <div className="w-150 max-h-300 min-h-50 bg-indigo-50 text-black rounded-xl relative">
          <div className="p-5 gap-1">
            <textarea
              placeholder="Comfirm catering by Fri at noon"
              className="resize-none font-medium outline-0 w-full"
              value={task?.title || ""}
              onChange={(e) => setTask(prev => prev ? { ...prev, title: e.target.value } : prev)}
              id=""
            ></textarea>
            <textarea
              placeholder="description"
              className="resize-none font-extralight outline-0 max-h-10 w-full text-start"
              value={task?.description || ""}
              onChange={(e) => setTask(prev => prev ? { ...prev, description: e.target.value } : prev)}
              id=""
            ></textarea>
            <div className="cursor-pointer relative" onClick={() => setOpen(!open)}>
              <Ellipsis/>
            </div>
            {open && <div className="w-75 h-25 bg-indigo-50 rounded-xl absolute border border-indigo-300 z-50">
                <select name="" id="" onChange={(e) => setTask(prev => prev ? { ...prev, priority: e.target.value as Priority} : prev)}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
                <input type="date" name="" id="" onChange={(e) => setTask(prev => prev ? { ...prev, date_at: e.target.value} : prev)}/>
                <input type="time" name="" id="" onChange={(e) => setTask(prev => prev ? { ...prev, time_at: e.target.value} : prev)}/>
                </div>}
          </div>
          <hr />
          <div className="flex flex-row items-center justify-between p-5">
            <div>Parent_id: {isPanelId}</div>
            <div className="gap-5 flex flex-row items-center">
              <button
                className="cursor-pointer bg-gray-300"
                onClick={() => dispatch(toggleModal(null))}
              >
                Cancel
              </button>
              <button className="bg-red-700 text-white rounded-xl py-2 duration-700 hover:bg-red-600 px-3 cursor-pointer" onClick={handleCreateTask}>
                Add task
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
