import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const NeobrutalismGenerator: React.FC = () => {
  const [offsetX, setOffsetX] = useState(4);
  const [offsetY, setOffsetY] = useState(4);
  const [borderWidth, setBorderWidth] = useState(2);
  const [radius, setRadius] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FF6B6B');
  const [copied, setCopied] = useState(false);

  const cssCode = `border: ${borderWidth}px solid #000000;
border-radius: ${radius}px;
box-shadow: ${offsetX}px ${offsetY}px 0px 0px ${shadowColor};
background-color: ${bgColor};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-200 min-h-[300px] p-8">
         <button 
           className="px-8 py-4 font-bold text-xl transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
           style={{
             border: `${borderWidth}px solid #000000`,
             borderRadius: `${radius}px`,
             boxShadow: `${offsetX}px ${offsetY}px 0px 0px ${shadowColor}`,
             backgroundColor: bgColor,
             color: '#000000' // Assuming dark text for contrast
           }}
         >
           Neo-Brutalism
         </button>
      </div>

      <div className="space-y-6">
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-sm font-bold text-gray-900">Shadow X: {offsetX}px</label>
               <input 
                 type="range" min="-20" max="20" value={offsetX}
                 onChange={(e) => setOffsetX(Number(e.target.value))}
                 className="w-full accent-black"
               />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-bold text-gray-900">Shadow Y: {offsetY}px</label>
               <input 
                 type="range" min="-20" max="20" value={offsetY}
                 onChange={(e) => setOffsetY(Number(e.target.value))}
                 className="w-full accent-black"
               />
            </div>
         </div>

         <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Border Width: {borderWidth}px</label>
            <input 
                 type="range" min="0" max="10" value={borderWidth}
                 onChange={(e) => setBorderWidth(Number(e.target.value))}
                 className="w-full accent-black"
            />
         </div>

         <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Border Radius: {radius}px</label>
            <input 
                 type="range" min="0" max="50" value={radius}
                 onChange={(e) => setRadius(Number(e.target.value))}
                 className="w-full accent-black"
            />
         </div>

         <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-sm font-bold text-gray-900 block">Shadow Color</label>
               <div className="flex gap-2">
                 <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="w-10 h-10 border-2 border-black rounded" />
                 <span className="font-mono text-sm py-2">{shadowColor}</span>
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-sm font-bold text-gray-900 block">Bg Color</label>
               <div className="flex gap-2">
                 <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 border-2 border-black rounded" />
                 <span className="font-mono text-sm py-2">{bgColor}</span>
               </div>
             </div>
         </div>

         <div className="relative">
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1 bg-white border border-black rounded hover:bg-yellow-200 transition-colors"
            >
               {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <pre className="bg-white border-2 border-black p-4 rounded-lg font-mono text-sm overflow-x-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {cssCode}
            </pre>
         </div>
      </div>
    </div>
  );
};