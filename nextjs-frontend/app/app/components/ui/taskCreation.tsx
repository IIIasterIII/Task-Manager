'use client'

import {motion} from "motion/react"
import Selector from "./selector"

const Ellipsis = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
)

export default function TaskCreation() {
  return (
      <motion.div
      initial={{opacity: 0, y: 50, scale: 1.2}}
      animate={{opacity: 1, y: 0, scale: 1}}
      exit={{opacity: 0, y: -50, scale: 0.8}}
      transition={{duration: .3, ease: "easeInOut"}}
       className="fixed inset-0 w-screen z-50 pointer-events-none flex items-center justify-center">
        <div className="flex min-h-full items-start translate-y-50 pointer-events-auto text-center">
            <div className="w-150 max-h-300 min-h-50 bg-indigo-50 text-black rounded-xl">
              <div className="p-5 gap-1">
                <textarea placeholder="Comfirm catering by Fri at noon" className="resize-none font-medium outline-0 w-full"id=""></textarea>
                <textarea placeholder="description" className="resize-none font-extralight outline-0 max-h-10 w-full text-start"id=""></textarea>
                <Ellipsis/>
              </div>
              <hr/>
              <div className="flex flex-row items-center justify-between p-5">
                <Selector/>
                <div className="gap-5 flex flex-row items-center">
                  <button>Cancel</button>
                  <button className="bg-red-700 text-white rounded-xl py-2 duration-700 hover:bg-red-600 px-3 cursor-pointer">Add task</button>
                </div>
              </div>
            </div>
        </div>
      </motion.div>
  )
}
