import { FC } from 'react'

interface ButtonProps {
  title: string;
  func: () => void;
}

const Button: FC<ButtonProps> = ({ title, func }) => {
  return (
    <button
        onClick={func}
        className="flex w-auto px-5 justify-center items-center rounded-md bg-accent text-white cyber:text-black py-1.5 cursor-pointer text-sm font-semibold
        duration-300 transition-all hover:brightness-110 hover:shadow-[0_0_10px_var(--accent)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
        {title}
    </button>
  )
}

export default Button