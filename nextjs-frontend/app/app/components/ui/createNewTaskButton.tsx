"use client"

import { toggleModal} from "@/app/features/ui/userSlice"
import { useAppDispatch } from "@/app/lib/hook"

const CreateNewTaskButton = () => {
  const dispatch = useAppDispatch()

  const handleCloseModal = () => {
    dispatch(toggleModal()); 
  };

  return (
    <div onClick={handleCloseModal} className='w-full h-10 border flex flex-row items-center gap-5 rounded-2xl hover:bg-indigo-100 duration-500 cursor-pointer bg-indigo-900'>
        <div className='w-10 h-10 rounded-xl border flex items-center justify-center'>+</div>
        <p>Search</p>
    </div>
  )
}

export default CreateNewTaskButton