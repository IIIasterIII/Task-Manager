"use client"

import StoreProvider from "../lib/storeProvider";
import AppContent from "./components/appContent";
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <StoreProvider>
            <AppContent>
                {children}
                <Toaster theme="dark" position="bottom-right" richColors />
            </AppContent>
        </StoreProvider>
    );
}