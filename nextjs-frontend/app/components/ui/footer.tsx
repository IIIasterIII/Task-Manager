"use client";

import Image from 'next/image';
import React from 'react';

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#030303] pt-32 pb-16 overflow-hidden">
      {/* Эффект свечения снизу (Linear Signature Glow) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800] h-[300] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

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
          {/* Едва заметный внутренний блик на кнопке */}
          <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" />
        </button>
        </div>


        <div className="w-full mt-10 h-[1] bg-linear-to-r from-transparent via-white/20 to-transparent mb-12" />
        {/* Нижняя часть футера */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-sm" />
            </div>
            <span className="text-white font-semibold tracking-tight">FocusOS</span>
          </div>

          <nav className="flex space-x-8 text-sm text-gray-500 font-light">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </nav>

          <p className="text-xs text-gray-600">
            © 2024 FocusOS Inc. Built for the future.
          </p>
        </div>
    </footer>
  );
};

export default Footer;