"use client"
import { FC } from "react";
import {
    Plus,
    Minus,
    CheckCircle2,
    Circle,
    Target,
    Activity,
} from "lucide-react";

interface ChartEntry {
id: number;
id_goal_task: number;
value: number;
date: string;
}

type TaskType = "boolean" | "numeric";

interface Task {
id: number;
goal_id: number;
chart_entries: ChartEntry[];
color: string;
target: 1;
title: string;
type: TaskType;
}

interface GoalData {
id: number;
title: string;
description: string;
is_completed: false;
user_id: number;
tasks: Task[];
}

interface LastEntriesState {
    goal_id: number;
    task_id: number;
    value: number;
    entry_id: number;
    date: string;
  }

export const TaskInputSection: FC<{ goalData: GoalData; setGoalData: any }> = ({
  goalData,
  setGoalData,
}) => {
  const handleUpdateValue = (taskId: number, newValue: number) => {
    setGoalData((prev: GoalData) => ({
      ...prev,
      tasks: prev.tasks.map((task) => {
        if (task.id === taskId) {
          const lastEntry = task.chart_entries[task.chart_entries.length - 1];
          const updatedEntries = [...task.chart_entries];
          updatedEntries[updatedEntries.length - 1] = {
            ...lastEntry,
            value: Math.max(0, newValue),
          };
          return { ...task, chart_entries: updatedEntries };
        }
        return task;
      }),
    }));
  };

  const setChanges = () => {
    const initialState: LastEntriesState[] = [];

    goalData.tasks.forEach((task) => {
      if (task.chart_entries && task.chart_entries.length > 0) {
        const last = task.chart_entries[task.chart_entries.length - 1];
        initialState.push({
          goal_id: task.goal_id,
          task_id: task.id,
          value: last.value,
          entry_id: last.id,
          date: last.date,
        });
      }
    });

    console.log("Initialized Array:", initialState);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2 px-2">
          <Activity size={18} className="text-violet-500" />
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
            Today's Progress
          </h2>
        </div>

        {goalData.tasks.map((task) => {
          const lastEntry = task.chart_entries[task.chart_entries.length - 1];
          const currentValue = lastEntry?.value || 0;
          const progress = Math.min((currentValue / task.target) * 100, 100);
          const isCompleted = currentValue >= task.target;

          return (
            <div
              key={task.id}
              className="group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 transition-all hover:bg-zinc-800/50 hover:border-zinc-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: `${task.color}15`,
                      color: task.color,
                    }}
                  >
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">
                      {task.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider">
                      Goal: {task.target}
                    </p>
                  </div>
                </div>

                {task.type === "boolean" ? (
                  <button
                    onClick={() =>
                      handleUpdateValue(task.id, currentValue ? 0 : 1)
                    }
                    className={`p-2 rounded-xl transition-all ${
                      isCompleted
                        ? "bg-green-500/20 text-green-500"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>
                ) : (
                  <div className="flex items-center bg-zinc-950 rounded-xl border border-zinc-800 p-1">
                    <button
                      onClick={() =>
                        handleUpdateValue(task.id, currentValue - 1)
                      }
                      className="p-1 hover:text-white text-zinc-500 transition-colors"
                    >
                      <Minus size={16} />
                    </button>

                    <input
                      type="number"
                      value={currentValue}
                      onChange={(e) =>
                        handleUpdateValue(
                          task.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 bg-transparent text-center text-sm font-bold text-zinc-100 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <button
                      onClick={() =>
                        handleUpdateValue(task.id, currentValue + 1)
                      }
                      className="p-1 hover:text-white text-zinc-500 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: task.color,
                    boxShadow: `0 0 15px ${task.color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
        <button
          className="w-auto rounded-[5] py-2 cursor-pointer border-violet-700 bg-violet-600 hover:bg-violet-500 active:bg-violet-400"
          onClick={setChanges}
        >
          Save Progress
        </button>
      </div>
    </div>
  );
};