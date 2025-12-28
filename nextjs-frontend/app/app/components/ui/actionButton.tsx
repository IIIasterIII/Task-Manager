import { FC, ReactNode } from "react"

interface ActionButtonProps {
    id: number
    title: string
    icon: ReactNode
    selected: number
    setSelected: (x: number) => void
}

const ActionButton : FC<ActionButtonProps> = ({id, title, icon, selected, setSelected}) => {
  return (
    <div className={`w-full h-10 flex flex-row items-center gap-5 border rounded-2xl hover:bg-indigo-300 duration-500 cursor-pointer ${selected == id && "bg-indigo-950 text-indigo-300"}`} onClick={() => setSelected(id)}>
        <div className='w-10 h-10 rounded-xl border flex items-center justify-center'>{icon}</div>
        <p>{title}</p>
    </div>
  )
}

export default ActionButton