"use client"

import Image from 'next/image';
import React from 'react';
import { motion } from "motion/react"
import { Zap, Rocket, Shield } from 'lucide-react';

const SecondSection = () => {
  return (
    <section className="relative w-full min-h-auto flex flex-col items-center justify-center bg-[#030303] px-6 py-20 overflow-hidden">

    <section className="mt-32 w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#FE0C46]/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-[#FE0C46]/10 flex items-center justify-center mb-6 text-[#FE0C46]">
          <Zap size={24} />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Мгновенная работа</h3>
        <p className="text-gray-400 leading-relaxed">
          Никаких ожиданий. Интерфейс оптимизирован для максимальной скорости отклика и синхронизации данных.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#FE0C46]/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-[#FE0C46]/10 flex items-center justify-center mb-6 text-[#FE0C46]">
          <Shield size={24} />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Безопасность</h3>
        <p className="text-gray-400 leading-relaxed">
          Ваши данные принадлежат только вам. Мы используем современные стандарты шифрования для защиты ваших задач.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#FE0C46]/30 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-[#FE0C46]/10 flex items-center justify-center mb-6 text-[#FE0C46]">
          <Rocket size={24} />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Всё в одном</h3>
        <p className="text-gray-400 leading-relaxed">
          Канбан-доски, списки задач и аналитика продуктивности в одном едином рабочем пространстве.
        </p>
      </motion.div>
    </section>
      
      {/* Фоновое свечение за видео */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full" />

      {/* Контейнер для видео / интерфейса */}
      <div className="relative w-full max-w-[1000px] aspect-video rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden group">
        {/* Имитация видео-плеера или дашборда */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
          {/* Иконка Play (центральный элемент) */}
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-500 cursor-pointer">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
          </div>
          
          {/* Декоративные элементы прогресс-бара */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
            </div>
          </div>
        </div>
      </div>

      {/* Текстовый блок */}
      <div className="mt-16 text-center h-screen w-ful relative">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight z-10">
          Visual Progress Tracking
        </h1>
        
        <p className="text-gray-400 text-lg leading-relaxed z-10">
          Set ambitious goals and track your journey. <br/> Our built-in analytics 
          <span className="text-white z-10"> transform your daily effort </span> 
          into beautiful, actionable progress charts.
        </p>

        {/* Кнопка действия */}
        <button className="mt-10 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all active:scale-95 z-10">
          Start Tracking
        </button>
      </div>



      {/* Декоративная сетка на фоне (опционально) */}
      <div className="absolute inset-0 z-10 z-[-1] opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
      />
    </section>
  );
};

export default SecondSection;