'use client'

import {motion} from "motion/react"
import { useAppSelector } from "@/app/lib/hook"

export default function TaskCreation() {
    const currentTab = useAppSelector(state => state.ui.currentTab)

  return (
      <motion.div
      initial={{opacity: 0, y: 50, scale: 1.2}}
      animate={{opacity: 1, y: 0, scale: 1}}
      exit={{opacity: 0, y: -50, scale: 0.8}}
      transition={{duration: .3, ease: "easeInOut"}}
       className="fixed inset-0 w-screen z-50 pointer-events-none flex items-center justify-center">
        <div className="flex min-h-full items-center pointer-events-auto  justify-center text-center md:items-center md:px-2 lg:px-4">
            <div className="w-100 h-50 bg-amber-100 rounded-xl">{currentTab}</div>
        </div>
      </motion.div>
  )
}
