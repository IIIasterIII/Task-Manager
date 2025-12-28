"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Palette, Check } from "lucide-react"

export const ThemePicker = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
  
    const themes = [
      { id: 'dark', name: 'Dark', color: '#0d0d0d', accent: '#fa1e4e' },
      { id: 'purple', name: 'Ultraviolet', color: '#0a0118', accent: '#a855f7' },
      { id: 'cyber', name: 'Cyberpunk', color: '#050505', accent: '#fdf500' },
      { id: 'midnight', name: 'Midnight', color: '#020617', accent: '#38bdf8' },
    ]
  
    useEffect(() => setMounted(true), [])
    if (!mounted) return null
  
    return (
      <div className="flex flex-col gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl w-fit">
        <div className="flex items-center gap-2 px-2 mb-1">
          <Palette size={16} className="text-zinc-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Appearance</span>
        </div>
  
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`
                relative group w-10 h-10 rounded-full border-2 transition-all duration-300
                ${theme === t.id ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}
              `}
              style={{ backgroundColor: t.color }}
              title={t.name}
            >
              <div 
                className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-black/50"
                style={{ backgroundColor: t.accent }}
              />
              
              {theme === t.id && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <Check size={16} strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }