"use client"
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const menuItems = ['Home', 'Info', 'Features', 'Goals', 'Contacts'];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 flex justify-center p-4 md:p-6">
      <div className="flex items-center justify-between w-full max-w-7xl px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] relative">
        <div onClick={() => router.push("/")} className="flex items-center gap-3 pl-2 group cursor-pointer relative z-100">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FE0C46] blur-[12] opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-8 h-8 bg-[#FE0C46] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(254,12,70,0.6)]">
               <div className="w-5 h-5 border-2 border-white rounded-full opacity-90" />
            </div>
          </div>
          <span className="font-semibold text-white tracking-tight">FullTM</span>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-white/5 px-1 py-1 rounded-full border border-white/5 scroll-smooth">
          {menuItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-6 relative z-100">
          <a 
            onClick={() => router.push("/auth")}
            href="#login" 
            className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors font-medium cursor-pointer"
          >
            Login
          </a>
          
          <div className="relative group hidden sm:block">
            <div className="absolute -inset-1 bg-[#FE0C46] rounded-full blur-[10px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <button onClick={() => router.push("/auth/register")} className="relative cursor-pointer px-5 py-2 text-xs md:text-sm font-bold text-white bg-[#FE0C46] rounded-full transition-all hover:scale-102 active:scale-98 select-none">
              Start free trial
            </button>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-1.5 justify-center items-center w-10 h-10 rounded-full bg-white/5 border border-white/10 md:hidden"
          >
            <motion.span 
              animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-white rounded-full origin-center" 
            />
            <motion.span 
              animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              className="w-5 h-0.5 bg-white rounded-full" 
            />
            <motion.span 
              animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-white rounded-full origin-center" 
            />
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="absolute top-14 left-0 right-0 mt-2 p-6 bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl md:hidden shadow-2xl"
            >
              <div className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <motion.a
                    variants={itemVariants}
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="text-lg text-gray-400 hover:text-[#FE0C46] transition-colors border-b border-white/5 pb-2"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
