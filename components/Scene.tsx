import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Particles from './Particles';
import { ShapeType, ColorMode } from '../types';

interface SceneProps {
  shape: ShapeType;
  colorMode: ColorMode;
}

const Scene: React.FC<SceneProps> = ({ shape, colorMode }) => {
  return (
    <div className="w-full h-full relative bg-black">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050505']} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Particles shape={shape} colorMode={colorMode} />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          enableZoom={true} 
          minDistance={4}
          maxDistance={15}
        />
        
        {/* Adds subtle reflections/lighting feel though particles are emissive */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default Scene;
