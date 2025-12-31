"use client"
import { Palette, Zap, Target, MousePointer2, Sparkles } from "lucide-react"
import TaskPreview from './taskPrewiev'
import { motion } from "motion/react"

const InfoSection = () => {
  const features = [
    {
      icon: <Palette size={20} className="text-[#FE0C46]" />,
      title: "Signature Themes",
      desc: "From Obsidian to Emerald. Handcrafted styles for your focus."
    },
    {
      icon: <Zap size={20} className="text-[#FE0C46]" />,
      title: "Instant Actions",
      desc: "Server-side revalidation for lightning-fast task management."
    },
    {
      icon: <Target size={20} className="text-[#FE0C46]" />,
      title: "Goal Tracking",
      desc: "Monitor your progress with deep visual analytics and milestones."
    }
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500] bg-[#FE0C46]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 bg-[#FE0C46]/10 border border-[#FE0C46]/20 px-4 py-1.5 rounded-full mb-8">
              <div className="w-2 h-2 bg-[#FE0C46] rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-[#FE0C46] uppercase tracking-[0.2em]">Visual Experience</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[0.9]">
              Visual <span className="text-[#FE0C46] drop-shadow-[0_0_15px_rgba(254,12,70,0.4)]">Precision</span>
            </h1>
            <p className="text-zinc-500 text-xl leading-relaxed max-w-md font-medium">
              Your workspace should match your mood. Switch between <span className="text-white">6 high-contrast themes</span> designed for deep work.
            </p>

            <div className="grid grid-cols-1 gap-6 mt-12">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 bg-zinc-900 rounded-lg border border-white/5 group-hover:border-[#FE0C46]/30 transition-colors">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{f.title}</h4>
                    <p className="text-zinc-500 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute inset-0 bg-[#FE0C46]/10 blur-[100px] rounded-full pointer-events-none" />
              
              {[
                { color: '#f59e0b', name: 'Obsidian' },
                { color: '#10b981', name: 'Emerald' },
                { color: '#3888f8', name: 'Midnight' },
                { color: '#00ff9f', name: 'Cyber' },
                { color: "#fa1e4e", name: 'Dark' },
                { color: "#a855f7", name: "Standard" }
              ].map((theme, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="h-48 rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl p-6 flex flex-col justify-end cursor-pointer group shadow-2xl overflow-hidden relative transition-all duration-300 hover:border-white/20"
                >
                  <div 
                    className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)` }}
                  />

                  <div className="relative mb-4 w-12 h-12">
                    <div 
                      className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-80 group-hover:blur-[20px] transition-all duration-500"
                      style={{ backgroundColor: theme.color }}
                    />
                    
                    <div 
                      className="relative w-full h-full rounded-full border border-white/20 z-10 transition-transform duration-500 group-hover:scale-110" 
                      style={{ 
                        backgroundColor: theme.color,
                        boxShadow: `0 0 20px ${theme.color}66`
                      }} 
                    />
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors duration-300">
                    {theme.name}
                  </span>
                </motion.div>
              ))}
            </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-linear-to-r from-[#FE0C46] rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
          
          <div className="relative bg-[#09090b] border border-white/5 rounded-[3rem] p-12 lg:p-20 overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 text-[#FE0C46] mb-6">
                  <Sparkles size={20} className="animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Smart Scheduling</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-[1.1] tracking-tight">
                  Deadlines that <span className="text-zinc-500 italic">breathe</span> with you.
                </h2>
                <p className="text-zinc-400 text-lg mb-10 max-w-lg leading-relaxed">
                  Our intuitive date picker and <span className="text-white">Pinned Tasks</span> system ensure your most critical goals are always in sight, but never in your way.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button className="bg-[#FE0C46] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-[0_0_25px_0_rgba(254,12,70,0.5)] transition-all active:scale-95 flex items-center gap-3 group cursor-pointer">
                    Get Started <MousePointer2 size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="relative flex flex-col gap-4">
                <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl shadow-inner relative overflow-hidden flex flex-col gap-3">
                    
                    <TaskPreview 
                        title="Finalize Q4 Strategy" 
                        priority="URGENT" 
                        date="Today, 18:00" 
                        delay={0.1}
                    />
                    <TaskPreview 
                        title="Website Redesign Assets" 
                        priority="HIGH" 
                        date="Tomorrow" 
                        delay={0.2}
                    />
                    <TaskPreview 
                        title="Database Migration" 
                        priority="MEDIUM" 
                        completed={true}
                        delay={0.3}
                    />
                    <TaskPreview 
                        title="Review Community Feedback" 
                        priority="LOW" 
                        date="Friday"
                        delay={0.4}
                    />

                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FE0C46]/10 blur-[50px] rounded-full" />
                </div>

                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FE0C46] rounded-full blur-[80px] opacity-20 animate-pulse" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-fuchsia-600 rounded-full blur-[60px] opacity-10" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-32 flex flex-row items-center justify-between gap-8 border-t border-white/5 pt-16">
          {[
            { label: "Architecture", value: "FastAPI + Next.js" },
            { label: "Security", value: "HttpOnly Auth" },
            { label: "UX", value: "Framer Motion" }
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">{stat.label}</p>
              <p className="text-lg font-bold text-zinc-200">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InfoSection