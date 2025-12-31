import React from 'react';

const InfoSection = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-white py-24 px-6 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">Interface</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              6 Signature Themes
            </h1>
            <h2 className="text-2xl text-gray-400 font-medium mb-4">Match your mood</h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              From deep <span className="text-white font-medium">Obsidian</span> to vibrant <span className="text-emerald-400 font-medium">Emerald</span>. 
              6 handcrafted themes designed to keep your eyes fresh and your focus sharp.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {['#171717', '#064e3b', '#1e3a8a', '#4c1d95', '#7c2d12', '#0f172a'].map((color, i) => (
              <div 
                key={i} 
                className="h-32 rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer group relative overflow-hidden"
                style={{ backgroundColor: color }}
              >
                <div className="absolute inset-0 bg-linear-to-tr from-black/40 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* Вторая секция: Смарт-дедлайны */}
        <div className="relative group">
          {/* Свечение на фоне */}
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          
          <div className="relative bg-[#0A0A0A] border border-white/5 rounded-3xl p-12 overflow-hidden">
            <div className="max-w-2xl">
              <h2 className="text-blue-400 font-semibold mb-2 tracking-wide uppercase text-sm">Never miss a beat</h2>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Intuitive date picking that stays out of your way until you need it.
              </h1>
              
              <div className="flex items-center space-x-4">
                <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                  Try Smart Deadlines
                </button>
                <button className="text-gray-400 hover:text-white px-6 py-3 transition-colors">
                  Learn more →
                </button>
              </div>
            </div>

            {/* Декоративный элемент "Календарь" справа */}
            <div className="hidden lg:block absolute top-1/2 right-[-50px] -translate-y-1/2 w-80 h-80 bg-blue-500/10 border border-blue-500/20 rounded-2xl rotate-12 backdrop-blur-3xl">
               <div className="p-6 space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className={`h-4 rounded-full bg-white/${i * 5} w-${i === 1 ? '3/4' : '1/2'}`} />
                  ))}
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InfoSection;