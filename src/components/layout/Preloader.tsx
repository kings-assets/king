
'use client';

import Image from 'next/image';

const Preloader = () => {
  return (
    <div id="preloader" className="fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out">
      {/* Background Grid & Stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 animate-[preloader-grid-pulse_6s_ease-in-out_infinite]"
          style={{ 
            backgroundImage: 'linear-gradient(hsl(var(--border)/0.5) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)/0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        ></div>
        <div className="absolute w-[1px] h-[1px] bg-primary rounded-full shadow-[0_0_10px_2px_hsl(var(--primary)),0_0_20px_4px_hsl(var(--primary)/0.5)] animate-[preloader-star-move_15s_linear_infinite]" style={{top: '20%', left: '10%'}}></div>
        <div className="absolute w-[2px] h-[2px] bg-accent rounded-full shadow-[0_0_10px_2px_hsl(var(--accent)),0_0_20px_4px_hsl(var(--accent)/0.5)] animate-[preloader-star-move_20s_linear_infinite]" style={{top: '50%', left: '80%', animationDelay: '-5s'}}></div>
        <div className="absolute w-[1px] h-[1px] bg-secondary rounded-full shadow-[0_0_10px_2px_hsl(var(--secondary)),0_0_20px_4px_hsl(var(--secondary)/0.5)] animate-[preloader-star-move_25s_linear_infinite]" style={{top: '90%', left: '30%', animationDelay: '-10s'}}></div>
      </div>

      <div className="relative flex flex-col items-center justify-center text-center animate-[preloader-fade-in_1s_ease-out]">
        <div className="w-64 md:w-80 mb-8">
            <Image
                src="/logo.png"
                alt="Revive 2.0 Underground Logo"
                width={400}
                height={100}
                className="w-full h-auto animate-[preloader-logo-pulse_3s_ease-in-out_infinite]"
                priority
            />
        </div>
        <div 
          className="font-mono text-lg md:text-xl text-primary text-glow-primary overflow-hidden whitespace-nowrap border-r-4 border-r-primary animate-[preloader-typing_2s_steps(40,end),preloader-blink-caret_.75s_step-end_infinite]"
          style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
        >
          INITIALIZING RUDRA R8 SYSTEM
        </div>
      </div>
    </div>
  );
};

export default Preloader;
