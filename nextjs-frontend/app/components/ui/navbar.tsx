import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <div className="flex items-center justify-between w-full max-w-7xl px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
        
        {/* Логотип с многослойным свечением */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
          <div className="relative">
            {/* Внешнее мягкое рассеивание (glow) */}
            <div className="absolute inset-0 bg-[#FE0C46] blur-[12px] opacity-40 group-hover:opacity-60 transition-opacity" />
            
            <div className="relative w-8 h-8 bg-[#FE0C46] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(254,12,70,0.6),inset_0_0_8px_rgba(255,255,255,0.3)] transition-shadow">
               <div className="w-5 h-5 border-2 border-white rounded-full opacity-90" />
            </div>
          </div>
          <span className="font-semibold text-white tracking-tight group-hover:text-white/90 transition-colors">FullTM</span>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-white/5 px-1 py-1 rounded-full border border-white/5">
          {['Second', 'Info', 'Goals', 'Features', 'Contacts'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <a href="#login" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
            Login
          </a>
          
          {/* Кнопка с двойным свечением: тень + внешний блюр */}
          <div className="relative group">
            {/* Внешний светящийся ореол под кнопкой */}
            <div className="absolute -inset-1 bg-[#FE0C46] rounded-full blur-[10px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            
            <button className="relative px-6 py-2 text-sm font-bold text-white bg-[#FE0C46] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 
              shadow-[0_0_15px_rgba(254,12,70,0.5),0_0_30px_rgba(254,12,70,0.3)]">
              
              {/* Глянцевый блик */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <span className="relative">
                Start free trial
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;