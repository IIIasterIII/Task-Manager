"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/app/lib/hook";
import { toggleModal } from "@/app/features/ui/userSlice";
import { Priority, Task, TaskDTO } from "@/app/types/task";
import { startTransition, useEffect, useState, useRef } from "react";
import { createTask } from "@/app/actions/taskActions";
import { clearTask, confirmTask, setTaskOptimistic } from "@/app/features/ui/taskSlice";
import { 
  Calendar, 
  Clock, 
  Flag, 
  X, 
  Type, 
  AlignLeft, 
  ChevronDown,
  Sparkles
} from "lucide-react";

export default function TaskCreation() {
  const dispatch = useAppDispatch();
  const isPanelId = useAppSelector((state) => state.ui.panel_id);
  const [openSettings, setOpenSettings] = useState(false);
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    priority: Priority.LOW,
    parent_id: isPanelId || null
  });

  const handleCreateTask = async () => {
    if (!task.title.trim()) return;
    
    const tempId = Math.floor(Math.random() * -1000000);
    const optimisticTask: TaskDTO = {
      ...task,
      id: tempId,   
      isOptimistic: true 
    };

    dispatch(setTaskOptimistic(optimisticTask));
    dispatch(toggleModal(null)); // Закрываем модалку сразу для скорости

    startTransition(async () => {
      const res = await createTask(task);
      if(res.success) dispatch(confirmTask(res.data));
      else dispatch(clearTask());
    });
  };

  const priorityConfig = {
    LOW: { color: "text-blue-400", bg: "bg-blue-400/10" },
    MEDIUM: { color: "text-orange-400", bg: "bg-orange-400/10" },
    HIGH: { color: "text-red-500", bg: "bg-red-500/10" },
    URGENT: { color: "text-violet-500", bg: "bg-violet-500/10" },
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => dispatch(toggleModal(null))}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-xl bg-card-bg/90 backdrop-blur-2xl border border-white/10 rounded-[24] relative overflow-hidden shadow-2xl z-10 pointer-events-auto flex flex-col"
      >
        {/* Header Area */}
        <div className="p-6 pb-2">
          <div className="flex items-start gap-4 mb-4">
             <div className="mt-1 p-2 rounded-lg bg-accent/10 text-accent">
                <Type size={20} />
             </div>
             <textarea
                placeholder="What needs to be done?"
                autoFocus
                className="flex-1 bg-transparent border-none resize-none font-bold text-xl text-site-text outline-none placeholder:text-zinc-600 min-h-[40]"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
          </div>

          <div className="flex items-start gap-4">
             <div className="mt-1 p-2 text-second-text">
                <AlignLeft size={20} />
             </div>
             <textarea
                placeholder="Add details or notes..."
                className="flex-1 bg-transparent border-none resize-none font-medium text-[15px] text-second-text outline-none placeholder:text-zinc-700 min-h-[60]"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              />
          </div>
        </div>

        <div className="px-6 py-4 flex flex-wrap items-center gap-3 border-t border-white/5 bg-white/5">
          <div className="relative group">
            <select 
               className="absolute inset-0 opacity-0 cursor-pointer z-10"
               value={task.priority}
               onChange={(e) => setTask({ ...task, priority: e.target.value as Priority })}
            >
              {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 transition-all ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].color}`}>
              <Flag size={14} fill="currentColor" fillOpacity={0.2} />
              <span className="text-[11px] font-black uppercase tracking-wider">{task.priority}</span>
              <ChevronDown size={12} className="opacity-50" />
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-second-text hover:text-site-text transition-all cursor-pointer relative">
            <Calendar size={14} />
            <input 
              type="date" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setTask({ ...task, date_at: e.target.value })}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider">{task.date_at || "Set Date"}</span>
          </div>

          {/* Time Pick */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-second-text hover:text-site-text transition-all cursor-pointer relative">
            <Clock size={14} />
            <input 
              type="time" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setTask({ ...task, time_at: e.target.value })}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider">{task.time_at || "Set Time"}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-white/5">
           <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
              <Sparkles size={12} className="text-accent" />
              Parent ID: {isPanelId || "Root"}
           </div>

           <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded-xl text-sm font-bold text-second-text hover:text-site-text hover:bg-white/5 transition-all"
                onClick={() => dispatch(toggleModal(null))}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTask}
                disabled={!task.title.trim()}
                className="px-6 py-2 rounded-xl text-sm font-black bg-accent text-white hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-[0_0_15px_var(--accent)] shadow-accent/20"
              >
                Add Task
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}