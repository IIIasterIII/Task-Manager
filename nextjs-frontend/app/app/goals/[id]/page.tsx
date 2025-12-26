"use client"

import { usePathname } from 'next/navigation'
import { startTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getGoal } from '@/app/actions/taskActions'

const Page = () => {
    const router = useRouter()
    const pathname = usePathname()
    useEffect(() => {
        startTransition(async () => {
            const res = await getGoal(Number(pathname.slice(11)))
            console.log(res)
        })
    }, [router])

  return (
    <div>Page</div>
  )
}

export default Page