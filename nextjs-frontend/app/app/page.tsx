"use client"

import React from 'react'
import { useAppSelector } from '../lib/hook'
import Task from './components/ui/task'

const Page = () => {
  const currentTab = useAppSelector((state) => state.ui.currentTab)

  return (
    <div className='bg-indigo-400 h-screen relative flex flex-col overflow-y-scroll items-center'>
      <div className='w-[600] mt-25 h-screen flex flex-col items-start'>
        <h1 className='text-black text-2xl font-bold mb-5'>{currentTab}</h1>
        <div className='flex flex-col gap-5 w-full'>
          <Task title={"Hello world!"}/>
          <Task title={"Hello world!"}/>
          <Task title={"Hello world!"}/>
          <Task title={"Hello world!"}/>
          <Task title={"Hello world!"}/>
          <Task title={"Hello world!"}/>
          <Task title={"Hello world!"}/>
          <Task title={"Hello world!"}/>
          <Task title={"Hello world!"}/>  
          <Task title={"Hello world!"}/>
        </div>
      </div>
    </div>
  )
}

export default Page