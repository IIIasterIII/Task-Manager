"use client";
import Image from 'next/image';

const Footer = () => {
  return (
    <footer id='contacts' className="relative w-full bg-[#030303] pt-32 pb-16 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800] h-[300] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

        <div className='mb-8 flex items-center justify-center w-full h-250 relative flex-col'>
        <Image src="./Cycle.svg" fill alt="a" className='absolute'/>
          <h2 className="text-xl md:text-7xl mt-25 font-bold tracking-tighter text-white z-10">
            Ready to build <br /> 
            <span className="bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent">
              your best self?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl font-light z-10 mt-10">
          Join the elite circle of productive builders. Experience the interface 
          designed for those who value speed and precision.
        </p>

        <button className="group z-10 relative px-10 py-4 bg-white text-black font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Get Started for free
          <div className="absolute inset-0 rounded-full border border-[#FE0C46]/20 group-hover:border-[#FE0C46]/40 transition-colors" />
        </button>
        </div>


        <div className="mt-16 h-[1] bg-linear-to-r from-transparent via-white/30 to-transparent mb-12" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-2 mx-10">
          
          <div className="flex items-center gap-4 group cursor-default">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 ring-2 ring-[#FE0C46]/20 group-hover:ring-[#FE0C46]/50 transition-all duration-500">
              <Image 
                src="https://avatars.githubusercontent.com/u/161053846?v=4" 
                fill 
                alt="IIIasterIII" 
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-xs font-bold tracking-tight">IIIasterIII</span>
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Full Stack Developer</span>
            </div>
          </div>

          <nav className="flex space-x-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <a href="https://github.com/IIIasterIII" target="_blank" className="hover:text-[#FE0C46] transition-colors duration-300">GitHub</a>
            <a href="#" className="hover:text-[#FE0C46] transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-[#FE0C46] transition-colors duration-300">Terms</a>
          </nav>

          <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 pl-2 group cursor-pointer relative z-100">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FE0C46] blur-[12] opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative w-8 h-8 bg-[#FE0C46] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(254,12,70,0.6)]">
                  <div className="w-5 h-5 border-2 border-white rounded-full opacity-90" />
                </div>
              </div>
              <span className="font-semibold text-white tracking-tight">FullTM</span>
            </div>
            <p className="text-[9px] mt-2 text-zinc-600 font-bold uppercase tracking-widest">
              © 2025 FocusOS Inc. Built for the future.
            </p>
          </div>
        </div>
    </footer>
  );
};

export default Footer;