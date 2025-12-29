"use client"
import { useState } from "react"
import { motion } from "motion/react"
import { Mail, Lock, ArrowRight, User, ShieldCheck, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
useRouter

const Page = () => {
  const [avatar, setAvatar] = useState<string | null>(null)
  const router = useRouter()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6 py-12 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[800] h-[500] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500] h-[500] bg-fuchsia-500/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[460] z-10"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="mt-2 text-zinc-500 text-sm">Join the community and track your progress</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl">
          <form className="space-y-5">
            
            {/* Аплоадер Аватарки */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-black/40 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-violet-500/50">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-zinc-700" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-violet-600 rounded-xl cursor-pointer hover:bg-violet-500 transition-all shadow-lg active:scale-90">
                  <Camera size={16} className="text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600 mt-4">Profile Photo</span>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="alex_goal"
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* Gmail */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-1">Gmail Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm placeholder:text-zinc-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-1">Confirm</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm placeholder:text-zinc-700"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
            >
              Start Journey
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f0f11] px-4 text-zinc-600 font-bold tracking-tighter">Instant access</span></div>
          </div>

          <button 
            onClick={() => window.location.href = "http://localhost:8000/login"} 
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
          >
            <img alt="Google" src="../google-icon.png" className="h-5 w-5" />
            <span className="text-sm font-bold">Sign up with Google</span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600">
          Already a member?{' '}
          <a className="font-bold text-violet-400 hover:text-violet-300 transition-colors" onClick={() => router.push("/auth")}>Sign in here</a>
        </p>
      </motion.div>
    </div>
  )
}

export default Page