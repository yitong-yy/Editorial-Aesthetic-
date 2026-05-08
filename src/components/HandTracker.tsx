import React, { useRef, useEffect, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

interface HandTrackerProps {
  onResults: (results: Results) => void;
}

export const HandTracker: React.FC<HandTrackerProps> = ({ onResults }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (!handsRef.current) {
      handsRef.current = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
      });

      handsRef.current.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      handsRef.current.onResults(onResults);
    }

    const hands = handsRef.current;
    let camera: Camera | null = null;

    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && hands) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start().then(() => setIsCameraActive(true));
    }

    return () => {
      // In some environments, calling close() immediately on unmount 
      // while WASM is still doing something can trigger the error.
      // However, we want to clean up.
      if (camera) {
        // Stop camera if possible (MediaPipe Camera doesn't have stop() but we can null it)
      }
      // If we keep the ref, we might not want to close it here if we expect the component to remount.
      // But for a simple app, cleanup is usually correct.
      // hands.close(); 
    };
  }, [onResults]);

  return (
    <div className="fixed bottom-10 left-10 flex flex-col gap-3 group z-40">
      <div className="w-56 aspect-video bg-black border border-white/10 rounded-lg overflow-hidden relative shadow-2xl">
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[8px] uppercase tracking-widest text-white/80 font-bold">Live Feed.01</span>
        </div>
        
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-x-[-1] opacity-60 grayscale brightness-125"
          playsInline
        />

        {!isCameraActive && (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[9px] font-mono tracking-widest uppercase">
            Initializing Sensor...
          </div>
        )}

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,.03),rgba(0,255,0,.01),rgba(0,0,255,.03))] bg-[length:100%_2px,3px_100%] z-20 opacity-30" />
      </div>
      <p className="text-[9px] text-white/20 italic uppercase tracking-wider pl-1">
        Active Mode: Precision_Hand_v4.2
      </p>
    </div>
  );
};
