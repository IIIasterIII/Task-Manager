"use client"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export const ThemePicker = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    const themes = [
      { id: 'dark', name: 'Dark', color: '#0d0d0d', accent: '#fa1e4e' },
      { id: 'purple', name: 'Ultraviolet', color: '#0a0118', accent: '#a855f7' },
      { id: 'cyber', name: 'Cyberpunk', color: '#050505', accent: '#fdf500' },
      { id: 'midnight', name: 'Midnight', color: '#020617', accent: '#38bdf8' },
      { id: 'emerald', name: 'Emerald Abyss', color: '#020a02', accent: '#10b981' },
      { id: 'obsidian', name: 'Obsidian Gold', color: '#0f0f11', accent: '#f59e0b' }
    ];

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
      <div className="w-full h-auto p-3 mb-3 items-center border border-accent rounded-[5]">
        <div className="grid grid-cols-6">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`
                relative group w-10 h-10 rounded-full border-2 cursor-pointer size-2 transition-all duration-300
              ${theme === t.id ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}
              `}
              style={{ backgroundColor: t.color }}
              title={t.name}
            >
              <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-black/50" style={{ backgroundColor: t.accent }}/>
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