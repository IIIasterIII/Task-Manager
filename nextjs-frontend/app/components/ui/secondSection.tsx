"use client"

import { motion } from "motion/react"
import { Zap, Target, Shield } from 'lucide-react';
import Block from "./block";
const SecondSection = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#030303] px-6 py-20 overflow-hidden">
      
      {/* Сетка фичей */}
      <section className="mt-32 w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20 mb-32 relative z-10">
        <Block 
            Icon={Zap}
            title="Instant Feedback"
            description="Zero waiting time. The interface is so fast it might actually predict your next move (not really, but it's close)."
            delay={0.1}
        />
        <Block 
            Icon={Shield}
            title="Honest Security"
            description="We don't use military-grade encryption because we're not a bank. It's just you, your tasks, and my database. Keep it secret!"
            delay={0.2}
        />
        <Block 
            Icon={Target}
            title="The 'Holy Trinity'"
            description="We skipped the clutter. You get a task manager, a history of your wins, and goals to chase. Simple as that."
            delay={0.3}
        />
      </section>
      
      {/* Визуальный блок (Плеер/Дашборд) */}
      <div className="relative w-full max-w-[1000] aspect-video rounded-2xl bg-[#0A0A0A] shadow-2xl overflow-hidden group">
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, #FFFFFF 14%, #FF1D1D 100%)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          }}
        />

        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            background: 'radial-gradient(circle at center, #FFFFFF 14%, #FF1D1D 100%)',
            filter: 'blur(40px)'
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-white/5 to-transparent">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-500 cursor-pointer relative z-10">
            <div className="w-0 h-0 border-t-[10] border-t-transparent border-l-[18] border-l-white border-b-[10] border-b-transparent ml-1" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent z-10">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-[#FF1D1D] shadow-[0_0_15px_#FF1D1D]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32 text-center flex flex-col justify-center items-center w-full relative z-20 pb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Visual Progress Tracking
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg leading-relaxed max-w-2xl px-4">
          Set ambitious goals and track your journey through time. <br/> 
          Our history logs <span className="text-white font-medium">transform your raw daily effort</span> into a clear roadmap of where you've been and where you're going.
        </motion.p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
          Start Tracking Now
        </motion.button>
      </div>

      {/* Фоновая сетка */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }} 
      />
    </section>
  );
};

export default SecondSection;