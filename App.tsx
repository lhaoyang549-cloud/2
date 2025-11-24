import React, { useState } from 'react';
import Scene from './components/Scene';
import { ShapeType, ColorMode } from './types';
import { Cuboid, Pyramid, Circle, Hexagon, ChevronRight } from 'lucide-react'; // Simulating icons with standard lucide

const App: React.FC = () => {
  const [shape, setShape] = useState<ShapeType>('sphere');
  const [colorMode, setColorMode] = useState<ColorMode>('rainbow');

  const shapes: ShapeType[] = ['sphere', 'cube', 'pyramid', 'torus'];

  // Cycle to next shape
  const handleNextShape = () => {
    const currentIndex = shapes.indexOf(shape);
    const nextIndex = (currentIndex + 1) % shapes.length;
    setShape(shapes[nextIndex]);
  };

  const getShapeName = (s: ShapeType) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="w-full h-screen relative font-sans text-white overflow-hidden select-none">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Scene shape={shape} colorMode={colorMode} />
      </div>

      {/* Floating Header */}
      <div className="absolute top-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="glass-panel px-6 py-2 rounded-full flex items-center space-x-2">
            <span className="text-xs tracking-widest uppercase text-gray-400">Current Shape</span>
            <span className="text-sm font-bold text-white">{getShapeName(shape)}</span>
        </div>
      </div>

      {/* Main Control Panel */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-4 w-full max-w-sm px-4">
        
        {/* Main Card */}
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 w-full shadow-2xl transition-all duration-300 hover:bg-gray-900/70 group">
            
            {/* Shape Switcher Button */}
            <button 
                onClick={handleNextShape}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-between mb-6 shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 group-hover:shadow-blue-900/40"
            >
                <div className="flex items-center gap-3">
                    {shape === 'sphere' && <Circle className="w-5 h-5" />}
                    {shape === 'cube' && <Cuboid className="w-5 h-5" />}
                    {shape === 'pyramid' && <Pyramid className="w-5 h-5" />}
                    {shape === 'torus' && <Hexagon className="w-5 h-5" />}
                    <span>Change Shape</span>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70" />
            </button>

            {/* Color Controls */}
            <div className="flex justify-between items-center bg-black/20 rounded-2xl p-2">
                <ColorButton 
                    color="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500" 
                    active={colorMode === 'rainbow'} 
                    onClick={() => setColorMode('rainbow')} 
                />
                <ColorButton 
                    color="bg-gradient-to-br from-yellow-400 to-orange-600" 
                    active={colorMode === 'warm'} 
                    onClick={() => setColorMode('warm')} 
                />
                <ColorButton 
                    color="bg-gradient-to-br from-green-400 to-emerald-700" 
                    active={colorMode === 'nature'} 
                    onClick={() => setColorMode('nature')} 
                />
                 <ColorButton 
                    color="bg-gradient-to-br from-cyan-400 to-blue-700" 
                    active={colorMode === 'cool'} 
                    onClick={() => setColorMode('cool')} 
                />
            </div>
            
            <div className="text-center mt-3 text-xs text-gray-500">
                Tap colors to visualize data
            </div>
        </div>

      </div>

      {/* Decorative Branding */}
      <div className="absolute bottom-4 right-6 text-white/10 font-bold text-4xl pointer-events-none hidden md:block">
        SHIFT
      </div>
    </div>
  );
};

// Helper sub-component for buttons
const ColorButton: React.FC<{ color: string; active: boolean; onClick: () => void }> = ({ color, active, onClick }) => (
    <button
        onClick={onClick}
        className={`relative w-10 h-10 rounded-full ${color} shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none ${active ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
    >
        {active && (
            <span className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
            </span>
        )}
    </button>
);

export default App;
