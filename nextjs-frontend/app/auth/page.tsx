"use client"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"

const Page = () => {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6 py-12 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000] h-[600] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400] h-[400] bg-fuchsia-500/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440] z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="mx-auto w-12 h-12 bg-violet-600 rounded-xl mb-6 shadow-[0_0_20px_rgba(124,58,237,0.5)] flex items-center justify-center"
          >
            <Lock className="text-white" size={24} />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-zinc-500 text-sm">Please enter your details to sign in</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl">
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-1 flex flex-row justify-between">
                <label className="text-[11px] uppercase tracking-widest font-black text-zinc-500 ml-1">Password</label>
                <a href="#" className="text-[11px] font-bold text-violet-400 hover:text-violet-300 transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
            >
              Sign in
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#121214] px-4 text-zinc-600 font-bold tracking-tighter">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={() => window.location.href = "http://localhost:8000/login"} 
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
          >
            <img alt="Google" src="./google-icon.png" className="h-5 w-5" />
            <span className="text-sm font-bold">Google Account</span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600">
          Don't have an account?{' '}
          <a className="font-bold text-violet-400 hover:text-violet-300 transition-colors" onClick={() => router.push("/auth/register")}>Sign up for free</a>
        </p>
      </motion.div>
    </div>
  )
}

export default Page