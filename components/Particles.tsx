import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSpherePoint, getCubePoint, getPyramidPoint, getTorusPoint } from '../utils/geometry';
import { ShapeType, ColorMode } from '../types';

interface ParticlesProps {
  shape: ShapeType;
  colorMode: ColorMode;
  count?: number;
}

const Particles: React.FC<ParticlesProps> = ({ shape, colorMode, count = 8000 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Initialize arrays once
  const { positions, colors, targetPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    
    // Initial random positions
    for (let i = 0; i < count; i++) {
      const p = getSpherePoint(2);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      
      // Init target same as position
      targetPositions[i * 3] = p.x;
      targetPositions[i * 3 + 1] = p.y;
      targetPositions[i * 3 + 2] = p.z;

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }
    
    return { positions, colors, targetPositions };
  }, [count]);

  // Update target positions when shape changes
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      let p = new THREE.Vector3();
      if (shape === 'sphere') p = getSpherePoint(2.5);
      else if (shape === 'cube') p = getCubePoint(3.5);
      else if (shape === 'pyramid') p = getPyramidPoint(4, 4);
      else if (shape === 'torus') p = getTorusPoint(2.5, 0.8);
      
      targetPositions[i * 3] = p.x;
      targetPositions[i * 3 + 1] = p.y;
      targetPositions[i * 3 + 2] = p.z;
    }
  }, [shape, count, targetPositions]);

  // Animation Loop
  useFrame(() => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const positionsAttribute = geometry.attributes.position;
    const colorsAttribute = geometry.attributes.color;
    
    const lerpFactor = 0.08; // Speed of transition

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // 1. Lerp Position
      let cx = positionsAttribute.getX(i);
      let cy = positionsAttribute.getY(i);
      let cz = positionsAttribute.getZ(i);

      const tx = targetPositions[ix];
      const ty = targetPositions[iy];
      const tz = targetPositions[iz];

      cx += (tx - cx) * lerpFactor;
      cy += (ty - cy) * lerpFactor;
      cz += (tz - cz) * lerpFactor;

      positionsAttribute.setXYZ(i, cx, cy, cz);

      // 2. Update Colors based on current position and mode
      let r = 1, g = 1, b = 1;

      if (colorMode === 'rainbow') {
        // Map position to color
        // Normalize roughly -2 to 2 range to 0-1
        const nx = (cx / 4) + 0.5;
        const ny = (cy / 4) + 0.5;
        const nz = (cz / 4) + 0.5;
        
        r = nx;
        g = ny;
        b = nz + 0.2;
      } else if (colorMode === 'warm') {
        // Yellow/Red/Orange palette
        // Random mix or gradient based on Y
        const t = (cy / 4) + 0.5; 
        r = 1.0;
        g = 0.5 + t * 0.5; // 0.5 to 1.0
        b = 0.1;
      } else if (colorMode === 'cool') {
        // Blue/Cyan/Purple
        const t = (cx / 4) + 0.5;
        r = 0.1 + t * 0.4;
        g = 0.5 + t * 0.5;
        b = 1.0;
      } else if (colorMode === 'nature') {
        // Greens
        const t = (cy + 2) / 4;
        r = 0.1;
        g = 0.6 + t * 0.4;
        b = 0.2 + t * 0.2;
      }

      // Add a little variation/twinkle
      const noise = (Math.random() - 0.5) * 0.05;
      colorsAttribute.setXYZ(i, Math.max(0, Math.min(1, r + noise)), Math.max(0, Math.min(1, g + noise)), Math.max(0, Math.min(1, b + noise)));
    }

    positionsAttribute.needsUpdate = true;
    colorsAttribute.needsUpdate = true;
    
    // Slow rotation of the whole object for effect
    pointsRef.current.rotation.y += 0.002;
    pointsRef.current.rotation.x += 0.001;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Particles;
