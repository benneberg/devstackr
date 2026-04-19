
import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Copy, Check, Droplet } from 'lucide-react';

interface PaletteColor {
  r: number;
  g: number;
  b: number;
  hex: string;
}

export const ColorThief: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [dominantColor, setDominantColor] = useState<PaletteColor | null>(null);
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const rgbToHex = (r: number, g: number, b: number) => 
    "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          processImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = (src: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Downscale for performance
      const maxDimension = 100; // Small size for fast processing
      const scale = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      
      // Simple quantization / extraction
      const colors: {r:number, g:number, b:number}[] = [];
      for (let i = 0; i < imageData.length; i += 4 * 10) { // Sample every 10th pixel
        if (imageData[i+3] < 128) continue; // Skip transparent
        colors.push({r: imageData[i], g: imageData[i+1], b: imageData[i+2]});
      }

      // Calculate dominant (average of all samples)
      const total = colors.reduce((acc, c) => ({r: acc.r+c.r, g: acc.g+c.g, b: acc.b+c.b}), {r:0, g:0, b:0});
      const avg = {
        r: Math.round(total.r / colors.length), 
        g: Math.round(total.g / colors.length), 
        b: Math.round(total.b / colors.length)
      };
      setDominantColor({...avg, hex: rgbToHex(avg.r, avg.g, avg.b)});

      // Simple Palette generation (Naive clustering by sorting)
      // For better results, a full Median Cut algorithm is typically used.
      // Here we simulate it by bucketing similar colors.
      const buckets: Record<string, typeof colors> = {};
      colors.forEach(c => {
         // Quantize to nearest 32
         const k = `${Math.round(c.r/64)},${Math.round(c.g/64)},${Math.round(c.b/64)}`;
         if(!buckets[k]) buckets[k] = [];
         buckets[k].push(c);
      });

      const extractedPalette = Object.values(buckets)
        .sort((a, b) => b.length - a.length) // Most frequent buckets first
        .slice(0, 6)
        .map(bucket => {
            const bTotal = bucket.reduce((acc, c) => ({r: acc.r+c.r, g: acc.g+c.g, b: acc.b+c.b}), {r:0, g:0, b:0});
            const bAvg = {
                r: Math.round(bTotal.r / bucket.length),
                g: Math.round(bTotal.g / bucket.length),
                b: Math.round(bTotal.b / bucket.length)
            };
            return { ...bAvg, hex: rgbToHex(bAvg.r, bAvg.g, bAvg.b) };
        });

      setPalette(extractedPalette);
      setIsProcessing(false);
    };
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       {/* Hidden canvas for processing */}
       <canvas ref={canvasRef} className="hidden" />

       {/* Upload Area */}
       <div className="space-y-6">
          <div 
            className={`relative rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 min-h-[300px] flex items-center justify-center cursor-pointer group hover:border-blue-400 transition-colors ${!imageSrc ? 'p-12' : 'p-0 border-solid border-gray-200'}`}
            onClick={() => fileInputRef.current?.click()}
          >
             {imageSrc ? (
               <div className="relative w-full h-full min-h-[300px] bg-black/5">
                 <img src={imageSrc} alt="Analysis Target" className="w-full h-full object-contain absolute inset-0" />
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                    Click to change image
                 </div>
               </div>
             ) : (
               <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-blue-500">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="font-bold text-gray-900">Upload Image</h3>
                  <p className="text-gray-500 text-sm mt-1">JPEG, PNG, or WEBP</p>
               </div>
             )}
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
       </div>

       {/* Analysis Results */}
       <div className="space-y-8">
          {dominantColor ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-6">
                   <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                     <Droplet size={16} className="text-blue-500" /> Dominant Color
                   </h3>
                   <div 
                     className="h-24 rounded-xl flex items-center justify-between px-6 shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]"
                     style={{ backgroundColor: dominantColor.hex }}
                   >
                      <span className={`font-mono font-bold text-lg ${
                          (dominantColor.r*0.299 + dominantColor.g*0.587 + dominantColor.b*0.114) > 186 ? 'text-black' : 'text-white'
                      }`}>
                        {dominantColor.hex}
                      </span>
                      <button 
                         onClick={() => copyToClipboard(dominantColor.hex)}
                         className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white backdrop-blur-sm transition-colors"
                      >
                         {copiedHex === dominantColor.hex ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                   </div>
                </div>

                <div>
                   <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Palette</h3>
                   <div className="space-y-3">
                      {palette.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                           <div 
                             className="w-12 h-12 rounded-lg shadow-inner"
                             style={{ backgroundColor: color.hex }}
                           />
                           <div className="flex-1">
                              <p className="font-bold text-gray-900 font-mono">{color.hex}</p>
                              <p className="text-xs text-gray-400">RGB({color.r}, {color.g}, {color.b})</p>
                           </div>
                           <button 
                             onClick={() => copyToClipboard(color.hex)}
                             className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                           >
                              {copiedHex === color.hex ? <Check size={16} className="text-green-600"/> : <Copy size={16} />}
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-gray-200 border-dashed rounded-2xl bg-gray-50">
               <ImageIcon size={48} className="mb-4 opacity-20" />
               <p>Upload an image to see analysis</p>
            </div>
          )}
       </div>
    </div>
  );
};
