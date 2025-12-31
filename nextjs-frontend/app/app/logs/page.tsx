"use client"
import { getHistory } from '@/app/actions/apiClient'
import { notify } from '@/app/lib/notifier'
import { useEffect, useState } from 'react'

interface History {
  timestamp: string
  active: string
  target: string
}

const Page = () => {
  const [history, setHistory] = useState<History[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await getHistory()
      if (notify(res)) {
        setHistory(res.data)
      }
    }
    fetchData()
  }, [])

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('eu-EU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    history.length === 0 ? <p className='text-second-text 0 italic'></p> :
    <div className='p-6 flex flex-col gap-6 max-w-2xl mx-auto select-none h-screen'>
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-site-text">Action History</h1>
        <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider border border-accent/20">
          {history?.length || 0} Events
        </span>
      </div>

      <div className="flex flex-col relative0 overflow-y-scroll f-full px-15 mb-5">
        {history && history.map((el, i) => (
          <div className='group flex flex-row items-start gap-4 p-3 rounded-xl transition-all duration-300 relative z-10' key={i} >
            <div className="mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] ring-4 ring-site-bg transition-transform" />
            <div className='flex flex-col flex-1 gap-1 min-w-0'>
              <div className="flex items-center justify-between gap-2">
                <span className='font-bold text-sm text-accent uppercase tracking-wide'>
                  {el.active}
                </span>
                <span className='text-[11px] font-medium text-second-text whitespace-nowrap bg-white/5 px-2 py-0.5 rounded-full'>
                  {formatTime(el.timestamp)}
                </span>
              </div>
              <p className='text-[15px] text-site-text/90 leading-relaxed truncate'>
                {el.target}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page