// app/app/AppContent.tsx (или любое другое имя)
"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from '@/app/lib/hook';
import Sidebar from "../components/sidebar";
import BackdropLoading from "@/app/components/ui/backdropLoading";
import TaskCreation from "./ui/taskCreation";
import { AnimatePresence } from "motion/react";

export default function AppContent({ children }: { children: React.ReactNode }) {
    const isModalOpen = useAppSelector((state) => state.ui.isModalOpen)
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        console.log("Статус модалки изменился на (appContent):", isModalOpen);
      }, [isModalOpen]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let res = await fetch("http://localhost:8000/me", { method: "POST", credentials: "include" });
                if (res.status === 401) {
                    const refreshRes = await fetch("http://localhost:8000/refresh", { method: "POST", credentials: "include" });
                    if (refreshRes.ok) {
                        res = await fetch("http://localhost:8000/me", { method: "POST", credentials: "include" });
                    } else {
                        router.push("/auth");
                        return;
                    }
                }
                if (res.ok) {
                    const data = await res.json();
                    console.log("Current user:", data);
                } else {
                    router.push("/auth");
                }
            } catch (err) {
                console.log("Auth error", err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    return (
        <div className="w-full h-screen flex flex-row">
            <BackdropLoading open={loading} />
            <Sidebar />
            <AnimatePresence mode="wait">
                {isModalOpen && <TaskCreation key={1}/>}
            </AnimatePresence>
            <main className="flex-1">{children}</main>
        </div>
    );
}