"use client"
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react"
import { FC } from "react";

interface BlockProps {
    Icon: LucideIcon | string;
    title: string;
    description: string;
    delay?: number;
}

const Block: FC<BlockProps> = ({ Icon, title, description, delay = 0.1 }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay, duration: 0.5 }}
            className="p-8 rounded-3xl bg-black border border-white/30 transition-all duration-300"
        >
            <div className="w-12 h-12 rounded-xl bg-[#FE0C46]/10 flex items-center justify-center mb-6 text-[#FE0C46] group-hover:scale-110 transition-transform">
                <div className="relative flex items-center justify-center">
                    {typeof Icon === 'string' ? <span className="text-xl font-bold">{Icon}</span> : <Icon size={24} />}
                </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                {description}
            </p>
        </motion.div>
    )
}

export default Block