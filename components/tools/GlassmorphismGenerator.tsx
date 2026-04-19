import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const GlassmorphismGenerator: React.FC = () => {
  const [blur, setBlur] = useState(16);
  const [transparency, setTransparency] = useState(0.25);
  const [saturation, setSaturation] = useState(180);
  const [color, setColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);

  // Convert hex to rgb for rgba usage
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const rgb = hexToRgb(color);
  
  const cssCode = `background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Preview Area */}
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-12 rounded-2xl flex items-center justify-center min-h-[400px] relative overflow-hidden shadow-inner">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div 
          className="relative w-full max-w-md h-64 rounded-xl p-8 text-white flex flex-col justify-between"
          style={{
            background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency})`,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div>
            <h3 className="font-bold text-2xl mb-2 drop-shadow-md">Glassmorphism</h3>
            <p className="opacity-90 drop-shadow-sm">The frosted glass effect adds depth and hierarchy to your UI.</p>
          </div>
          <div className="flex gap-3">
             <div className="h-8 w-24 bg-white/20 rounded-full"></div>
             <div className="h-8 w-12 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium text-gray-700">Blur</label>
              <span className="text-gray-500 text-sm">{blur}px</span>
            </div>
            <input 
              type="range" min="0" max="40" value={blur} 
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium text-gray-700">Transparency</label>
              <span className="text-gray-500 text-sm">{Math.round(transparency * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01" value={transparency} 
              onChange={(e) => setTransparency(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
            />
          </div>

          <div className="space-y-2">
             <label className="font-medium text-gray-700 block">Base Color</label>
             <div className="flex items-center gap-3">
               <input 
                 type="color" value={color} onChange={(e) => setColor(e.target.value)} 
                 className="w-10 h-10 rounded cursor-pointer border-0 p-0"
               />
               <span className="text-gray-500 font-mono text-sm uppercase">{color}</span>
             </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-gray-700">CSS Output</label>
            <button 
              onClick={copyToClipboard}
              className="text-xs flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy CSS'}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm font-mono overflow-x-auto border border-gray-800">
            {cssCode}
          </pre>
        </div>
      </div>
    </div>
  );
};