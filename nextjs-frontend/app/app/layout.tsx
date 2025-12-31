"use client"
import AppContent from "./components/appContent";
import { Toaster } from 'sonner';
import { ThemeProvider } from "next-themes";

const ToasterComponent = () => (
  <Toaster 
    theme="dark" 
    position="bottom-right" 
    expand={true}
    closeButton 
    toastOptions={{ style: { background: '#18181b', border: '1px solid #27272a', color: '#f4f4f5' },
      classNames: { closeButton: 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 border-zinc-700 transition-colors' }
    }}
  />
)

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem themes={['dark', 'purple', 'cyber', 'midnight', 'emerald', 'obsidian']}>
            <AppContent>
                {children}
                <ToasterComponent/>
            </AppContent>
      </ThemeProvider>
    );
}