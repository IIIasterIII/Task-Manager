"use client"

import { FC, useState } from 'react'

interface TaskProps {
  id?: number
  title: string
  is_completed?: boolean
}

const Task : FC<TaskProps> = ({title}) => {
    const [completed, setCompleted] = useState(false)

    return (
        <div className='w-full h-10 border-b border-gray-500 flex flex-row items-center gap-3 px-2'>
            <div 
                className={`w-5 h-5 rounded-full border border-gray-500 hover:border-gray-600 duration-300 cursor-pointer flex justify-center items-center ${completed ? 'bg-orange-500 border-orange-500 border-none' : ''}`} 
                onClick={() => setCompleted(!completed)}>
                {completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                )}
            </div>
            <p className={`duration-300 select-none ${completed ? 'line-through text-gray-300' : 'text-white'}`}>
                {title}
            </p>
        </div>
    )
}

export default Task