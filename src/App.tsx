import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Global CRT Effects */}
      <div className="scanlines"></div>
      <div className="flicker"></div>

      {/* Main Terminal Container */}
      <div className="w-full max-w-4xl border-2 border-[#00ffff] bg-[#050505] p-1 shadow-[0_0_30px_rgba(0,255,255,0.15)] relative z-10">
        
        {/* Header */}
        <header className="border-b-2 border-[#00ffff] p-3 flex justify-between items-center bg-[#00ffff]/10">
          <div className="flex items-center gap-2 text-[#00ffff]">
            <Terminal size={20} />
            <h1 className="text-xl tracking-widest glitch-text" data-text="NEURO_OS v3.1">NEURO_OS v3.1</h1>
          </div>
          <div className="text-[#ff00ff] text-lg">
            SYS_SCORE: <span className="text-[#00ffff]">{score.toString().padStart(5, '0')}</span>
          </div>
        </header>

        {/* Content Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
          
          {/* Left Column: Game */}
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 w-full flex justify-between text-xs text-[#00ffff]/70">
              <span>PROCESS: SNAKE_SIM.EXE</span>
              <span>[SPACE] TO PAUSE</span>
            </div>
            <SnakeGame onScoreChange={setScore} />
          </div>

          {/* Right Column: Audio & Info */}
          <div className="flex flex-col gap-6">
            
            {/* Audio Module */}
            <div>
              <div className="mb-2 text-xs text-[#ff00ff]/70 border-b border-[#ff00ff]/30 pb-1">
                MODULE: AUDIO_SYNTH
              </div>
              <MusicPlayer />
            </div>

            {/* System Stats / Decorative */}
            <div className="border border-[#00ffff]/30 p-4 text-xs text-[#00ffff]/80 font-mono flex flex-col gap-2">
              <div className="text-[#ff00ff] mb-2">&gt; SYSTEM_STATUS: ONLINE</div>
              <div className="flex justify-between">
                <span>CPU_LOAD:</span>
                <span className="animate-pulse">{(Math.random() * 40 + 20).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>MEM_ALLOC:</span>
                <span>0x8F3A2</span>
              </div>
              <div className="flex justify-between">
                <span>NET_UPLINK:</span>
                <span className="text-[#ff00ff]">SECURE</span>
              </div>
              <div className="mt-4 pt-2 border-t border-[#00ffff]/30 text-[10px] opacity-50">
                WARNING: PROLONGED EXPOSURE TO NEURAL SIMULATION MAY CAUSE SYNAPTIC DRIFT.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
