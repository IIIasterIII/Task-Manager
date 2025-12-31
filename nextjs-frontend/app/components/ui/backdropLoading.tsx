"use client"
import { motion } from "motion/react"

export default function BackdropLoading({ open }: { open: boolean }) {
    if (!open) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 flex items-center justify-center bg-[#050505]/80 backdrop-blur-md"
        >
            <div className="relative flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#FE0C46]/20 border-t-[#FE0C46] rounded-full animate-spin" />
                
                <motion.span 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FE0C46] drop-shadow-[0_0_8px_rgba(254,12,70,0.5)]"
                >Loading...
                </motion.span>
            </div>
        </motion.div>
    );
}