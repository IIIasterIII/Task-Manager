"use client"

import { useState, useMemo, useEffect, startTransition } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { TaskDTO } from '@/app/types/task';
import { getTasksByDate } from '@/app/actions/taskActions';
import CellTask from '../components/ui/cellTask';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Calendar = () => {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();
  const [tasks, setTasks] = useState<TaskDTO[]>([])

  useEffect(() => {
    if (!viewDate) return;
  
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;

    startTransition(async () => {
        const res = await getTasksByDate(year, month)
        if(res?.success)
            setTasks(res.data || [])
    })
  }, [viewDate])

  const { calendarCells, monthName, year } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    let startDay = firstDayOfMonth.getDay(); 
    startDay = startDay === 0 ? 6 : startDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      cells.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ day: i, isCurrentMonth: true });
    }
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, isCurrentMonth: false });
    }

    const monthName = viewDate.toLocaleString('en-US', { month: 'long' });
    
    return { calendarCells: cells, monthName, year };
  }, [viewDate]);

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goToday = () => setViewDate(new Date());

  return (
    <div className="w-full bg-[#0d0d0d] text-white border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-4">
            <div className="bg-zinc-800 p-2 rounded-lg text-center min-w-[60]">
                <p className="text-xs uppercase text-zinc-400">{today.toLocaleString('en-US', {month: 'short'})}</p>
                <p className="text-xl font-bold">{today.getDate()}</p>
            </div>
            <div>
                <h2 className="text-xl font-semibold">
                  {monthName} {year}
                </h2>
                <p className="text-sm text-zinc-500">
                  {calendarCells[0].day} {monthName} — {calendarCells[34].day} {monthName}
                </p>
            </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-800 rounded-lg p-1">
            <button onClick={prevMonth} className="p-1 hover:bg-zinc-700 rounded transition"><ChevronLeft size={20} /></button>
            <button onClick={goToday} className="px-3 text-sm font-medium hover:bg-zinc-700 rounded transition">Today</button>
            <button onClick={nextMonth} className="p-1 hover:bg-zinc-700 rounded transition"><ChevronRight size={20} /></button>
          </div>
          
          <button className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition shadow-lg">
            <Plus size={18} />
            Add event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/20">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-zinc-500 border-r border-zinc-800 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[120px]">
  {calendarCells.map((cell, idx) => {
    const isToday = 
      cell.isCurrentMonth && 
      cell.day === today.getDate() && 
      viewDate.getMonth() === today.getMonth() && 
      viewDate.getFullYear() === today.getFullYear();

    const cellTasks = tasks.filter((task) => {
      if (!cell.isCurrentMonth || !task.date_at) return false
      
      const taskDate = new Date(task?.date_at);
      return (
        taskDate.getDate() === cell.day &&
        taskDate.getMonth() === viewDate.getMonth() &&
        taskDate.getFullYear() === viewDate.getFullYear()
      );
    });

    return (
      <div 
        key={idx} 
        className={`border-r border-b border-zinc-800 p-2 relative group hover:bg-zinc-900/30 transition last:border-r-0 ${
          !cell.isCurrentMonth ? 'bg-zinc-900/10' : ''
        }`}
      >
        <span className={`text-sm mb-2 flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
          !cell.isCurrentMonth ? 'text-zinc-700' : 'text-zinc-400'} ${
          isToday ? 'bg-violet-600 text-white font-bold' : ''
        }`}>
          {cell.day}
        </span>
        
        <div className="space-y-1 overflow-y-auto max-h-[80] custom-scrollbar">
          {cellTasks.map((task) => (
            <CellTask title={task.title} id={task.id} key={task.id}/>
          ))}

          {isToday && cellTasks.length === 0 && (
            <div className="text-[10px] p-1 bg-violet-950/40 text-violet-300 border border-violet-800 rounded truncate">
              No tasks today
            </div>
          )}
        </div>
      </div>
    );
  })}
</div>
    </div>
  );
};

const page = () => {
  return (
    <div><Calendar/></div>
  )
}

export default page