// app/app/layout.tsx
"use client"

import StoreProvider from "../lib/storeProvider";
import AppContent from "./components/appContent";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <StoreProvider>
            <AppContent>
                {children}
            </AppContent>
        </StoreProvider>
    );
}