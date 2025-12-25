import { FC } from 'react'

interface CellTask {
    id: number
    title: string
}

const CellTask : FC<CellTask> = ({id, title}) => {
  return (
    <div className="text-[10px] p-1 bg-zinc-800/50 text-zinc-300 border border-zinc-700 rounded truncate hover:border-zinc-500 transition-colors cursor-pointer">
        <p>{title}</p>
    </div>
  )
}

export default CellTask