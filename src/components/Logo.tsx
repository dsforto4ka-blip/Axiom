import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <a href="#" className={`flex items-center gap-3 group select-none ${className}`} id="brand-logo-link">
      <div className="relative flex items-center justify-center">
        {/* Glowing pulse aura */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#2A7DE1] to-[#6FC3FF] opacity-50 blur-md group-hover:opacity-80 transition-opacity duration-300"></div>
        
        {/* High-tech Emblem Container */}
        <div className={`relative ${iconSizes[size]} rounded-xl bg-[#0F172A] border border-[#6FC3FF]/40 flex items-center justify-center p-1.5 overflow-hidden shadow-inner`}>
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6FC3FF" />
                <stop offset="50%" stopColor="#2A7DE1" />
                <stop offset="100%" stopColor="#0B3C84" />
              </linearGradient>
              <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6FC3FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2A7DE1" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* Outer cyber hexagon path */}
            <polygon 
              points="50,6 88,27 88,73 50,94 12,73 12,27" 
              stroke="url(#tp-gradient)" 
              strokeWidth="5" 
              strokeLinejoin="round" 
              className="group-hover:stroke-[#6FC3FF] transition-colors duration-300"
            />
            
            {/* High-tech flow lines / lightning "T" + "П" stream */}
            <path 
              d="M30 32 L70 32 M50 32 L50 72 M40 72 L60 72" 
              stroke="#FFFFFF" 
              strokeWidth="6" 
              strokeLinecap="round" 
            />
            
            {/* Stream vortex / energy flow diagonal accent */}
            <path 
              d="M26 44 L40 60 L74 26" 
              stroke="url(#tp-gradient)" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Glowing nodes */}
            <circle cx="50" cy="32" r="3.5" fill="#6FC3FF" />
            <circle cx="74" cy="26" r="3" fill="#6FC3FF" />
            <circle cx="26" cy="44" r="2.5" fill="#2A7DE1" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-wider font-tech text-white ${textSizes[size]} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#6FC3FF] transition-all`}>
            ТЕХНО<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF]">ПОТОК</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-widest text-[#6FC3FF]/80 font-mono -mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6FC3FF] animate-pulse"></span>
            CUSTOM PC STUDIO
          </span>
        )}
      </div>
    </a>
  );
};
