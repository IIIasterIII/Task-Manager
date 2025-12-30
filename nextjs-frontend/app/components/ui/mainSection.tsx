import Image from 'next/image'
import { ArrowRight, BookOpen } from 'lucide-react'
import { motion } from "motion/react"

const MainSection = () => {
  return (
    <main className='min-h-screen w-full flex flex-col items-center bg-site-bg overflow-hidden'>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="mt-6 text-gray-400 text-lg md:text-xl text-center max-w-2xl px-4">
      Организуйте свои проекты, отслеживайте прогресс в реальном времени и работайте в команде эффективнее, чем когда-либо.
    </motion.p>

      <div className="flex flex-wrap gap-4 items-center justify-center mt-10">
        <motion.button
          initial={{opacity: 0, scale: 0.9, y: 15}}
          animate={{opacity: 1, scale: 1, y: 0}}
          transition={{duration: .5, delay: .6}}
         className="group cursor-pointer relative px-6 py-2.5 bg-[#FE0C46] text-white font-semibold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(254,12,70,0.45)] hover:shadow-[0_0_35px_rgba(254,12,70,0.6)]">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex items-center gap-2">
            Try for free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>

        <motion.button
          initial={{opacity: 0, scale: 0.9, y: 15}}
          animate={{opacity: 1, scale: 1, y: 0}}
          transition={{duration: .5, delay: .6}}
         className="group cursor-pointer duration-700 relative px-6 py-2.5 bg-white/5 text-white font-medium rounded-full border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-[#FE0C46]/40">
          <span className="flex items-center gap-2">
            <BookOpen size={18} className="text-[#FE0C46]" />
            Documentation
          </span>
        </motion.button>
      </div>

      <div className='relative mt-16 w-full max-w-[1000]'>
        <motion.div
          initial={{opacity: 0, y: 25}}
          animate={{opacity: 1, y: 0}}
          transition={{ease: "easeInOut", duration: .5, delay: .5}}
         className='absolute -top-15 left-1/2 -translate-x-1/2 w-200 h-1/2 bg-[#FE0C46]/40 blur-[120px] pointer-events-none' />
        <div className='relative transform:rotateX(15deg)'>
          <motion.div
          initial={{opacity: 0, y: 25}}
          animate={{opacity: 1, y: 0}}
          transition={{ease: "easeInOut", duration: .5, delay: .3}}
           className='relative w-full aspect-16/10 rounded-2xl border border-card-border bg-[#FE0C46]/50 shadow-2xl 
          overflow-hidden [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]'>
            <Image 
              fill 
              priority
              alt='Task Manager Interface' 
              src="/ScreenshotInterface1.png"
            />
          </motion.div>
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{ease: "easeIn", duration: .5, delay: .5}}
           className='absolute inset-0 rounded-2xl border-t border-white/20 pointer-events-none' />
        </div>
      </div>
    </main>
  )
}

export default MainSection