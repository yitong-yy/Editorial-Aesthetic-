import * as THREE from 'three';

export type PresetType = 'nebula' | 'fireworks' | 'saturn' | 'flower';

export const getPresetGeometry = (type: PresetType, density: number) => {
  const count = Math.floor(density * 5000);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;

    if (type === 'nebula') {
      const radius = Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      y = (Math.random() - 0.5) * 2;
      z = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
    } else if (type === 'fireworks') {
      const radius = Math.random() * 5;
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      x = Math.sin(theta) * Math.cos(phi) * radius;
      y = Math.sin(theta) * Math.sin(phi) * radius;
      z = Math.cos(theta) * radius;
    } else if (type === 'saturn') {
      const isRing = Math.random() > 0.3;
      if (isRing) {
        const radius = 3 + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        x = Math.cos(angle) * radius;
        y = (Math.random() - 0.5) * 0.2;
        z = Math.sin(angle) * radius;
      } else {
        const radius = Math.random() * 2;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        x = Math.sin(theta) * Math.cos(phi) * radius;
        y = Math.sin(theta) * Math.sin(phi) * radius;
        z = Math.cos(theta) * radius;
      }
    } else if (type === 'flower') {
      const angle = Math.random() * Math.PI * 2;
      const petals = 5;
      const r = 2 + Math.cos(angle * petals) * 2;
      x = Math.cos(angle) * r;
      y = Math.sin(angle) * r;
      z = (Math.random() - 0.5);
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    colors[i * 3] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();
  }

  return { positions, colors };
};
