import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Stars, Points, PointMaterial } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { PresetType, getPresetGeometry } from '../presets';

interface ParticleSystemProps {
  handData: {
    spread: number; // 0 to 1
    rotation: { x: number; y: number };
    isActive: boolean;
  };
  preset: PresetType;
  color: string;
  density: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ handData, preset, color, density }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => getPresetGeometry(preset, density), [preset, density]);
  
  const baseColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Movement control
    const targetRotationX = handData.rotation.y * Math.PI;
    const targetRotationY = handData.rotation.x * Math.PI;
    
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotationX, 0.1);
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotationY, 0.1);

    // Spread control (expand/contract)
    const scaleFactor = 1 + handData.spread * 2;
    pointsRef.current.scale.lerp(new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor), 0.1);

    // Color/Hue shift based on rotation
    const hue = (state.clock.elapsedTime * 0.1 + pointsRef.current.rotation.y * 0.5) % 1;
    const hslColor = new THREE.Color().setHSL(hue, 0.7, 0.6);
    
    // Mix with base color
    if (pointsRef.current.material instanceof THREE.PointsMaterial) {
      pointsRef.current.material.color.lerp(hslColor.lerp(baseColor, 0.5), 0.05);
    }
  });

  return (
    <>
      <color attach="background" args={['#050508']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Points ref={pointsRef} positions={positions} colors={colors}>
        <PointMaterial
          transparent
          vertexColors
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      <EffectComposer multisampling={0}>
        <Bloom 
          intensity={1.5} 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9} 
          mipmapBlur 
        />
      </EffectComposer>
    </>
  );
};
