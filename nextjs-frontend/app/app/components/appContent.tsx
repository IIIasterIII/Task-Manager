"use client"
import BackdropLoading from "@/app/components/ui/backdropLoading";
import { startTransition, useEffect, useState } from "react";
import { setUserData } from "@/app/features/ui/userSlice"
import ProjectCreation from "./ui/projectCreation";
import { checkMe } from "@/app/actions/apiClient";
import { useAppSelector } from '@/app/lib/hook';
import { useAppDispatch } from "@/app/lib/hook"
import { AnimatePresence } from "motion/react";
import TaskCreation from "./ui/taskCreation";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import { notify } from "@/app/lib/notifier";

export default function AppContent({ children }: { children: React.ReactNode }) {
    const isModalOpen = useAppSelector((state) => state.ui.isModalOpen)
    const isCreateProjectOpen = useAppSelector((state) => state.ui.isCreateProjectOpen)
    const [loading, setLoading] = useState<boolean>(true)
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        let isMounted = true

        const initAuth = async () => {
            startTransition(async () => {
                const res = await checkMe()
                if (!isMounted) return

                if (res.success) {
                    dispatch(setUserData(res.data))
                    setLoading(false)
                } else {
                    notify(res)
                    router.push("/auth")
                }
            })
        }
        initAuth()
        return () => { isMounted = false }
    }, [dispatch, router])
    
    return (
        loading ? <BackdropLoading open={true} /> : (
        <div className="w-full h-screen flex flex-row">
            <Sidebar />
            <AnimatePresence mode="wait">
                {isModalOpen && <TaskCreation key={1}/>}
                {isCreateProjectOpen && <ProjectCreation/>}
            </AnimatePresence>
            <main className="w-full h-screen relative overflow-hidden">{children}</main>
        </div>
        )
    )
}