"use client";

import React from 'react';

const GoalsSection = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col items-center bg-[#030303]">
      {/* Header Section */}
      <div className="text-center mb-20 relative">
        {/* Мягкое свечение за заголовком */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-24 bg-blue-500/10 blur-[100px]" />
        
        <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 bg-linear-to-b from-white to-[#404040] bg-clip-text text-transparent">
          Turn big dreams <br /> into small steps
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Most task managers forget about the big picture. We don’t. 
          Create long-term goals and watch your consistency pay off.
        </p>
      </div>

      {/* Main Bento Grid Container */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Большая карточка с графиком (Progress) */}
        <div className="md:col-span-2 relative group overflow-hidden bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 transition-all hover:border-white/10">
          <div className="relative z-10">
            <h3 className="text-white text-lg font-medium mb-1">Consistency Flow</h3>
            <p className="text-gray-500 text-sm mb-8">Track your daily momentum</p>
            
            {/* Имитация графика Linear-style */}
            <div className="flex items-end gap-1 h-32 w-full">
              {[40, 70, 45, 90, 65, 80, 50, 95, 70, 85, 100, 60, 75, 55, 90].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-blue-500/20 rounded-t-sm relative group/bar transition-all hover:bg-blue-500/40"
                  style={{ height: `${h}%` }}
                >
                  {i === 10 && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" />}
                </div>
              ))}
            </div>
          </div>
          {/* Световой блик при ховере */}
          <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Маленькая карточка (Stats) */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-white/10 transition-all">
          <div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <div className="w-4 h-4 text-blue-400">⚡</div>
            </div>
            <h3 className="text-white text-lg font-medium">98% Success</h3>
            <p className="text-gray-500 text-sm mt-1">Of goals reached this month</p>
          </div>
          <div className="mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[98%] shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
          </div>
        </div>

        {/* Карточка со списком "Steps" */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
          <h3 className="text-white text-sm font-medium mb-4 uppercase tracking-widest opacity-50">Subtasks</h3>
          <div className="space-y-3">
            {[
              { t: "Research market", c: true },
              { t: "Define core features", c: true },
              { t: "Build MVP", c: false },
              { t: "Launch to beta", c: false }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded border ${item.c ? 'bg-blue-500 border-blue-500' : 'border-white/10'} flex items-center justify-center text-[10px]`}>
                  {item.c && "✓"}
                </div>
                <span className={`text-sm ${item.c ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{item.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Длинная карточка (Long-term) */}
        <div className="md:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex items-center justify-between group overflow-hidden relative">
           <div className="z-10">
              <h3 className="text-white text-lg font-medium">Long-term Vision</h3>
              <p className="text-gray-500 text-sm">Automated roadmaps for 2024</p>
           </div>
           <div className="flex -space-x-3 z-10">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-gray-800 flex items-center justify-center text-xs">
                  U{i}
                </div>
              ))}
           </div>
           {/* Декоративная линия фона */}
           <div className="absolute bottom-0 left-0 w-full h-[1] bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;