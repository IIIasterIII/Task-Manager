"use client"
import BackdropLoading from "@/app/components/ui/backdropLoading";
import { setUserData } from "@/app/features/ui/userSlice"
import ProjectCreation from "./ui/projectCreation";
import { useAppSelector } from '@/app/lib/hook';
import { useAppDispatch } from "@/app/lib/hook"
import { AnimatePresence } from "motion/react";
import TaskCreation from "./ui/taskCreation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";

export default function AppContent({ children }: { children: React.ReactNode }) {
    const isModalOpen = useAppSelector((state) => state.ui.isModalOpen)
    const isCreateProjectOpen = useAppSelector((state) => state.ui.isCreateProjectOpen)
    const [loading, setLoading] = useState<boolean>(true)
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        let isMounted = true;
        
        const checkAuth = async () => {
            try {
                let res = await fetch("http://localhost:8000/me", { 
                    method: "POST", 
                    credentials: "include" 
                });
    
                if (res.status === 401) {
                    const refreshRes = await fetch("http://localhost:8000/refresh", { 
                        method: "POST", 
                        credentials: "include" 
                    });
                    
                    if (refreshRes.ok) {
                        await fetch("http://localhost:8000/me", { 
                            method: "POST", 
                            credentials: "include" 
                        });
                    }
                }
    
                if (res.ok && isMounted) {
                    const data = await res.json()
                    dispatch(setUserData(data))
                    setLoading(false)
                } else if (isMounted) {
                    router.push("/auth")
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Auth error:", err)
                    router.push("/auth")
                }
            }
        };
    
        checkAuth();
        return () => { isMounted = false };
    }, [dispatch, router]);
    
    if (loading) {
        return <BackdropLoading open={true} />;
    }

    return (
        <div className="w-full h-screen flex flex-row">
            <Sidebar />
            <AnimatePresence mode="wait">
                {isModalOpen && <TaskCreation key={1}/>}
                {isCreateProjectOpen && <ProjectCreation/>}
            </AnimatePresence>
            <main className="w-full h-screen relative overflow-hidden">{children}</main>
        </div>
    );
}