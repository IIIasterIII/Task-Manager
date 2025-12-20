const HoverPanel = () => {
  return (
    <div className='flex flex-row items-center gap-2'>
        <img src="../google-icon.png" alt="avatar" className="w-10 h-10 border rounded-xl"/>
        <p>Paulo</p>

        <div className="w-10 h-10 border rounded-2xl ml-auto"></div>
        <div className="w-10 h-10 border rounded-2xl"></div>
    </div>
  )
}

export default HoverPanel