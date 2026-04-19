import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const ColorPickerWidget: React.FC = () => {
  const [color, setColor] = useState('#6366f1');
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Color Converter</span>
        <div className="flex gap-1">
           <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color }}></div>
           <span className="text-xs font-mono text-gray-500">{color.toUpperCase()}</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <input 
          type="color" 
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 rounded-xl border-none p-0 cursor-pointer overflow-hidden shadow-sm hover:scale-105 transition-transform"
        />
        <div className="flex-1 space-y-2">
           <div className="flex gap-2">
              <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700">
                {color.toUpperCase()}
              </code>
              <button 
                onClick={copy}
                className={`px-2 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
           </div>
           <code className="block bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700">
             {hexToRgb(color)}
           </code>
        </div>
      </div>
    </div>
  );
};
