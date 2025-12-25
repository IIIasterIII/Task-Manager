"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from '@/app/lib/hook';
import Sidebar from "../components/sidebar";
import BackdropLoading from "@/app/components/ui/backdropLoading";
import TaskCreation from "./ui/taskCreation";
import { AnimatePresence } from "motion/react";
import { setUserData } from "@/app/features/ui/userSlice"
import { useAppDispatch } from "@/app/lib/hook"
import ProjectCreation from "./ui/projectCreation";
import { toast } from "sonner";

export default function AppContent({ children }: { children: React.ReactNode }) {
    const isModalOpen = useAppSelector((state) => state.ui.isModalOpen)
    const isCreateProjectOpen = useAppSelector((state) => state.ui.isCreateProjectOpen)
    const isUserData = useAppSelector((state) => state.ui.profile)
    const [loading, setLoading] = useState<boolean>(true)
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        let isMounted = true

        const checkAuth = async () => {
            try {
                let res = await fetch("http://localhost:8000/me", { method: "POST", credentials: "include" })
                if (res.status === 401) {
                    console.log("Token expired, trying to refresh...")
                    const refreshRes = await fetch("http://localhost:8000/refresh", { method: "POST", credentials: "include" })
                    if (refreshRes.ok) {
                        res = await fetch("http://localhost:8000/me", { method: "POST", credentials: "include" })
                    } else {
                        throw new Error("Refresh failed")
                    }
                }
                if (res.ok && isMounted) {
                    const data = await res.json()
                    dispatch(setUserData(data))
                    toast.success('Task moved successfully', {
                        description: 'The date has been updated in the database',
                      });
                } else {
                    router.push("/auth")
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Critical auth error:", err)
                    router.push("/auth")
                }
            } finally {
                if (isMounted) setLoading(false)
            }
        };
        checkAuth();
        return () => { 
            isMounted = false; 
        } 
    }, [router]);

    return (
        <div className="w-full h-screen flex flex-row">
            <BackdropLoading open={loading} />
            <Sidebar />
            <AnimatePresence mode="wait">
                {isModalOpen && <TaskCreation key={1}/>}
                {isCreateProjectOpen && <ProjectCreation/>}
            </AnimatePresence>
            <main className="w-full h-screen relative overflow-hidden">{children}</main>
        </div>
    );
}