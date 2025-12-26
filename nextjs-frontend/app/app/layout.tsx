"use client"

import StoreProvider from "../lib/storeProvider";
import AppContent from "./components/appContent";
import { Toaster } from 'sonner';

const ToasterComponent = () => (
  <Toaster 
    theme="dark" 
    position="bottom-right" 
    expand={true}
    closeButton 
    toastOptions={{
      style: { background: '#18181b', border: '1px solid #27272a', color: '#f4f4f5' },
      classNames: { closeButton: 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 border-zinc-700 transition-colors' }
    }}
  />
)

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <StoreProvider>
            <AppContent>
                {children}
                <ToasterComponent/>
            </AppContent>
        </StoreProvider>
    );
}