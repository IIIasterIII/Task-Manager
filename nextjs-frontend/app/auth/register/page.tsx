"use client"
import { startTransition, useState } from "react"
import { motion } from "motion/react"
import { Mail, Lock, ArrowRight, User, ShieldCheck, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import { Postregister } from "@/app/actions/apiClient"
useRouter

const Page = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if(userData.password !== userData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    if(!userData.username || !userData.email || !userData.password) {
      alert("Please fill in all required fields!")
      return
    }

    if(!avatar) {
      alert("Please upload an avatar!")
      return
    }

    startTransition(async () => {
      const res = await Postregister({username: userData.username, email: userData.email, password: userData.password, avatar: avatar})
      console.log(res)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6 py-12 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[800] h-[500] bg-[#FE0C46]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500] h-[500] bg-[#FE0C46]/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[460] z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="mt-2 text-zinc-500 text-sm">Join the community and track your progress</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl">
          <form className="space-y-5">
            
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-black/40 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#FE0C46]/50">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-zinc-700" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-[#FE0C46] rounded-xl cursor-pointer hover:bg-[#FE0C46] duration-500 transition-all shadow-lg active:scale-90">
                  <Camera size={16} className="text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600 mt-4 select-none">Profile Photo</span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-2">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FE0C46] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="alex_goal"
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-[#FE0C46]/50 focus:ring-4 focus:ring-[#FE0C46]/10 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-2">Gmail Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FE0C46] transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-[#FE0C46]/50 focus:ring-4 focus:ring-[#FE0C46]/10 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FE0C46] transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white outline-none focus:border-[#FE0C46]/50 focus:ring-4 focus:ring-[#FE0C46]/10 transition-all text-sm placeholder:text-zinc-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-2">Confirm</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FE0C46] transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-white outline-none focus:border-[#FE0C46]/50 focus:ring-4 focus:ring-[#FE0C46]/10 transition-all text-sm placeholder:text-zinc-700"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleRegister}
              type="submit"
              className="w-full bg-[#FE0C46] hover:bg-[#FE0C46] text-white font-bold py-3 rounded-xl duration-500 hover:shadow-[0_0_16px_0_rgba(254,12,70,0.8)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
            >
              Start Journey
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#121214] px-4 text-zinc-600 font-bold tracking-tighter">Instant access</span></div>
          </div>

          <button 
            onClick={() => window.location.href = "http://localhost:8000/login"} 
            className="w-full bg-white/5 border duration-500 border-white/10 hover:bg-white/10 text-white py-3 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
          >
            <img alt="Google" src="../google-icon.png" className="h-5 w-5" />
            <span className="text-sm font-bold">Sign up with Google</span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600">
          Already a member?{' '}
          <a className="font-bold text-[#FE0C46] hover:text-white duration-500 cursor-pointer transition-all ml-1" onClick={() => router.push("/auth")}>Sign in here</a>
        </p>
      </motion.div>
    </div>
  )
}

export default Page