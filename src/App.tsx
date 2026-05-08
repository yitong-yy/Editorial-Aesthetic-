/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { HandTracker } from './components/HandTracker';
import { ParticleSystem } from './components/ParticleSystem';
import { UI } from './components/UI';
import { PresetType } from './presets';
import { Results } from '@mediapipe/hands';

export default function App() {
  const [preset, setPreset] = useState<PresetType>('nebula');
  const [color, setColor] = useState('#22d3ee');
  const [density, setDensity] = useState(1.0);
  const [handData, setHandData] = useState({
    spread: 0,
    rotation: { x: 0, y: 0 },
    isActive: false
  });

  const onHandResults = useCallback((results: Results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      
      // Calculate spread (distance between palm and middle finger tip)
      const wrist = landmarks[0];
      const middleTip = landmarks[12];
      const distance = Math.sqrt(
        Math.pow(wrist.x - middleTip.x, 2) + 
        Math.pow(wrist.y - middleTip.y, 2)
      );
      
      // Normalized spread: 0.1 to 0.4 roughly mapped to 0 to 1
      const spread = Math.min(Math.max((distance - 0.1) / 0.3, 0), 1);
      
      // Calculate rotation based on palm position
      // MediaPipe coordinates are 0-1
      const x = (wrist.x - 0.5) * 2;
      const y = (wrist.y - 0.5) * 2;

      setHandData({
        spread,
        rotation: { x, y },
        isActive: true
      });
    } else {
      setHandData(prev => ({ ...prev, isActive: false }));
    }
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#050508] overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{ antialias: false, stencil: false, depth: true }}
      >
        <ParticleSystem 
          handData={handData} 
          preset={preset} 
          color={color} 
          density={density} 
        />
      </Canvas>

      <HandTracker onResults={onHandResults} />
      
      <UI 
        currentPreset={preset} 
        setPreset={setPreset} 
        color={color} 
        setColor={setColor} 
        density={density} 
        setDensity={setDensity} 
        onToggleFullscreen={handleFullscreen}
        handActive={handData.isActive}
      />

      {/* Intro hint */}
      {!handData.isActive && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-white/20 text-[10px] font-mono tracking-[0.5em] uppercase mb-4 animate-pulse">
            Waiting for hand detection...
          </div>
          <div className="flex gap-4 justify-center">
            <div className="w-12 h-1 px-1 bg-white/5 overflow-hidden">
              <div className="w-full h-full bg-cyan-500 animate-[loading_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add custom frame animation for intro
const style = document.createElement('style');
style.textContent = `
  @keyframes loading {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(0); }
    100% { transform: translateX(100%); }
  }
`;
document.head.appendChild(style);

