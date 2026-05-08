import React from 'react';
import { Maximize2, Sparkles, Orbit, Flower2, Zap } from 'lucide-react';
import { PresetType } from '../presets';
import { cn } from '../lib/utils';

interface UIProps {
  currentPreset: PresetType;
  setPreset: (preset: PresetType) => void;
  color: string;
  setColor: (color: string) => void;
  density: number;
  setDensity: (density: number) => void;
  onToggleFullscreen: () => void;
  handActive: boolean;
}

const presets: { id: PresetType; label: string; sub: string }[] = [
  { id: 'nebula', label: 'NEBULA', sub: 'Option 01' },
  { id: 'fireworks', label: 'FIREWORKS', sub: 'Option 02' },
  { id: 'saturn', label: 'SATURN', sub: 'Option 03' },
  { id: 'flower', label: 'FLOWER', sub: 'Option 04' },
];

export const UI: React.FC<UIProps> = ({ 
  currentPreset, setPreset, color, setColor, density, setDensity, onToggleFullscreen, handActive 
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none p-10 flex flex-col justify-between font-sans text-white uppercase overflow-hidden">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Header Section */}
      <header className="z-20 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col">
          <h1 className="text-8xl font-extralight tracking-tighter leading-none mb-4 pointer-events-auto">
            ETHER<span className="font-bold">HANDS</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-[0.4em] text-cyan-400 font-bold">Live Particle Feedback System</span>
            <div className="h-[1px] w-12 bg-cyan-400 opacity-50"></div>
            <span className="text-[10px] tracking-[0.4em] text-white opacity-40 italic">v1.2.0-STABLE</span>
          </div>
        </div>
        
        <div className="flex gap-12 text-right pointer-events-auto">
          <div className="flex flex-col">
            <span className="text-[9px] tracking-widest text-white/40 mb-1 font-mono">Tracking Status</span>
            <span className={cn(
              "text-xs font-mono flex items-center gap-2 transition-colors duration-500",
              handActive ? "text-cyan-400" : "text-red-500/60"
            )}>
              <span className={cn("w-2 h-2 rounded-full", handActive ? "bg-cyan-400 animate-pulse" : "bg-red-500/40")} /> 
              {handActive ? "HANDS DETECTED" : "NO HAND DETECTED"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] tracking-widest text-white/40 mb-1 font-mono">System Load</span>
            <span className="text-xs font-mono text-white opacity-80">14.2ms / 60FPS</span>
          </div>
        </div>
      </header>

      {/* Side Interaction Indicators */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-24 opacity-20 pointer-events-none">
        <div className="rotate-90 origin-left text-[10px] tracking-[0.5em] whitespace-nowrap">
          Scale Modulation [Palm Open/Close]
        </div>
        <div className="rotate-90 origin-left text-[10px] tracking-[0.5em] whitespace-nowrap">
          Rotation Mapping [Hand Position]
        </div>
      </div>

      {/* Right Presets Menu */}
      <aside className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-30 pointer-events-auto items-end">
        {presets.map((p) => (
          <div 
            key={p.id} 
            className="flex flex-col items-end group cursor-pointer"
            onClick={() => setPreset(p.id)}
          >
            <span className={cn(
              "text-[9px] tracking-[0.4em] mb-1 transition-opacity duration-300",
              currentPreset === p.id ? "opacity-100 text-cyan-400" : "opacity-0 group-hover:opacity-100 text-white/40"
            )}>
              {p.sub}
            </span>
            <button className={cn(
              "text-sm tracking-[0.2em] transition-all duration-300 pr-6 border-r-2",
              currentPreset === p.id 
                ? "font-black text-white border-white scale-110" 
                : "font-light text-white/40 hover:text-white border-transparent hover:border-cyan-500"
            )}>
              {p.label}
            </button>
          </div>
        ))}
      </aside>

      {/* Footer Interface */}
      <footer className="z-30 grid grid-cols-3 items-end pointer-events-none">
        {/* Left Space: Reserved for Camera Feed positioning */}
        <div className="flex flex-col gap-3">
          <div className="w-56 aspect-video invisible" /> {/* Spacer for absolute camera */}
          <p className="text-[9px] text-white/30 italic tracking-widest pointer-events-auto">
            PROPRIETARY VISUALIZER // CORE_ENGINE v2
          </p>
        </div>

        {/* Center: System Parameters */}
        <div className="flex flex-col gap-8 pointer-events-auto mb-2">
          <div className="space-y-6 max-w-sm">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[9px] tracking-[0.3em] text-white/50 font-bold">
                <label>PARTICLE DENSITY</label>
                <span>{Math.round(density * 25000)} UNIT_CNT</span>
              </div>
              <div className="h-1 bg-white/10 relative overflow-hidden rounded-full cursor-pointer group">
                <input 
                  type="range" 
                  min="0.1" 
                  max="2" 
                  step="0.1"
                  value={density}
                  onChange={(e) => setDensity(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div 
                  className="absolute left-0 top-0 h-full bg-cyan-500 transition-all duration-300 group-hover:bg-cyan-400" 
                  style={{ width: `${(density / 2) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[9px] tracking-[0.3em] text-white/50 font-bold">BASE TONE</span>
              <div className="flex gap-3 items-center">
                <div 
                  className="w-5 h-5 rounded-full ring-2 ring-white ring-offset-2 ring-offset-black"
                  style={{ backgroundColor: color }}
                />
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 opacity-0 absolute cursor-pointer"
                />
                <span className="text-[10px] font-mono text-white/40">{color.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex justify-end gap-6 pointer-events-auto pb-2">
          <button 
            onClick={onToggleFullscreen}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all group"
          >
            <Maximize2 size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button className="px-10 h-14 bg-white text-black text-[11px] font-black tracking-[0.3em] rounded-full hover:bg-cyan-400 transition-colors uppercase">
            Export Simulation
          </button>
        </div>
      </footer>
    </div>
  );
};
