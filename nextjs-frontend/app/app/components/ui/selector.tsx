"use client"

import { useState } from 'react'

import { useAppSelector } from "@/app/lib/hook"
import {AnimatePresence, motion} from "motion/react"

const Check = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
)

const Inbox = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
  </svg>
)

const Selector = () => {
  const[open,setOpen] = useState(false)
  const currentTab = useAppSelector(state => state.ui.currentTab)

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className='hover:bg-gray-200 cursor-pointer duration-300 py-2 px-4 rounded-xl'>{currentTab}</button>
      <AnimatePresence>
      {open && (
        <motion.div className="w-100 bg-indigo-50 rounded-b-xl absolute h-50 -translate-x-5 pt-2 flex flex-col gap-2">
          <div className='px-5 w-full'>
            <input type="text" autoFocus placeholder='Type a project name' className='p-1 border border-gray-400 outline-0 rounded-[5] w-full'/>
          </div>
          <hr className='text-gray-300'/>
          <div className='w-full flex flex-row gap-5 hover:bg-gray-300 cursor-pointer py-2 px-5'>
            <Inbox/>
            <p className='mr-auto'>{currentTab}</p>
            <Check/>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

export default Selector