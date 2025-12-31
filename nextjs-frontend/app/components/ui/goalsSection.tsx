"use client"
import { Target, TrendingUp, CheckCircle2, Zap, Rocket } from "lucide-react"
import { motion } from "motion/react"

const GoalsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <section id='goals' className="py-32 px-6 max-w-7xl mx-auto flex flex-col items-center bg-[#050505] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600] bg-[#FE0C46]/5 blur-[140px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FE0C46]/10 border border-[#FE0C46]/20 mb-6">
          <Target size={14} className="text-[#FE0C46]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FE0C46]">Strategic Roadmap</span>
        </div>
        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
          Dream Big. <br /> <span className="text-[#FE0C46] drop-shadow-[0_0_20px_rgba(254,12,70,0.3)]">Execute Small.</span>
        </h2>
        <p className="text-zinc-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          While others track tasks, you track <span className="text-white">momentum</span>. 
          Deconstruct your vision into actionable steps with real-time progress syncing.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
      >
        <motion.div 
          className="md:col-span-2 relative group overflow-hidden bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 transition-all hover:border-[#FE0C46]/20 backdrop-blur-sm"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-white text-xl font-bold mb-1 flex items-center gap-2">
                  Consistency Flow <TrendingUp size={18} className="text-[#FE0C46]" />
                </h3>
                <p className="text-zinc-500 text-sm">Real-time daily momentum tracking</p>
              </div>
              <div className="px-3 py-1 bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 border border-white/5">
                LIVE METRICS
              </div>
            </div>
            
            <div className="flex items-end gap-2 h-40 w-full">
              {[40, 70, 45, 90, 65, 80, 50, 95, 70, 85, 100, 60, 75, 55, 90].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 0.8, ease: "circOut" }}
                  className="flex-1 bg-zinc-800 rounded-t-lg relative group/bar transition-all hover:bg-[#FE0C46]/50"
                >
                  {i === 10 && (
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FE0C46] rounded-full shadow-[0_0_15px_#FE0C46]" 
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-linear-to-tr from-[#FE0C46]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.div>

        <motion.div 
          className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between hover:border-[#FE0C46]/20 transition-all backdrop-blur-sm"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FE0C46]/10 border border-[#FE0C46]/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(254,12,70,0.1)]">
              <Zap size={24} className="text-[#FE0C46] fill-[#FE0C46]/20" />
            </div>
            <h3 className="text-white text-2xl font-bold tracking-tight">98.4% Efficiency</h3>
            <p className="text-zinc-500 text-sm mt-2 leading-relaxed">System-calculated success rate based on your recent sprint.</p>
          </div>
          <div className="mt-8 relative pt-4">
             <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">
                <span>Progress</span>
                <span className="text-[#FE0C46]">98.4%</span>
             </div>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "98.4%" }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-[#FE0C46] shadow-[0_0_20px_rgba(254,12,70,0.6)]" 
                />
             </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 hover:border-[#FE0C46]/20 transition-all backdrop-blur-sm"
        >
          <h3 className="text-zinc-600 text-[10px] font-black mb-6 uppercase tracking-[0.3em]">Goal Decomposition</h3>
          <div className="space-y-4">
            {[
              { t: "FastAPI Backend Logic", c: true },
              { t: "Next.js Authentication", c: true },
              { t: "Goal Tracking UI", c: false },
              { t: "Deploy to Production", c: false }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-all"
              >
                <div className={`w-5 h-5 rounded-lg border ${item.c ? 'bg-[#FE0C46] border-[#FE0C46]' : 'border-white/20'} flex items-center justify-center transition-all shadow-[0_0_10px_rgba(254,12,70,0.2)]`}>
                  {item.c && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <span className={`text-sm font-medium ${item.c ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>{item.t}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="md:col-span-2 bg-[#09090b] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between group overflow-hidden relative"
        >
           <div className="z-10">
              <div className="flex items-center gap-2 mb-2">
                <Rocket size={18} className="text-[#FE0C46]" />
                <h3 className="text-white text-xl font-bold">Long-term Vision</h3>
              </div>
              <p className="text-zinc-500 text-sm">Automated roadmaps generated for 2026</p>
           </div>
           
           <div className="flex -space-x-4 z-10">
              {[1, 2, 3, 4].map(i => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5, zIndex: 50 }}
                  className="w-12 h-12 rounded-2xl border-2 border-[#09090b] bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-400 cursor-pointer shadow-xl"
                >
                  MOD_{i}
                </motion.div>
              ))}
           </div>

           <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute bottom-0 left-0 w-full h-[1] bg-linear-to-r from-transparent via-[#FE0C46]/40 to-transparent" 
           />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default GoalsSection