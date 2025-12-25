"use client"

import React, { useEffect, useState } from 'react'
import { getHistory } from '@/app/actions/apiClient'

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
      if (res.success) {
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
    <div className='p-5 flex flex-col gap-3'>
      <h1 className="text-xl font-bold mb-4">Action History</h1>
      {history && history.length > 0 ? (
        history.map((el, i) => (
          <div className='flex flex-row items-center gap-4 p-3 border-b border-zinc-800' key={i}>
            <span className='font-semibold text-violet-400'>{el.active}</span>
            <p className='flex-1'>{el.target}</p>
            <p className='text-zinc-500 text-sm'>{formatTime(el.timestamp)}</p>
          </div>
        ))
      ) : (
        <p className="text-zinc-500">История пуста</p>
      )}
    </div>
  )
}

export default Page