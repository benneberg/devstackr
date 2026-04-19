import React, { useState } from 'react';
import { Smartphone, Monitor, Copy, Check } from 'lucide-react';

export const PwaManifestGenerator: React.FC = () => {
  const [config, setConfig] = useState({
    name: 'My Awesome App',
    short_name: 'MyApp',
    description: 'An amazing progressive web app',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'any'
  });
  const [copied, setCopied] = useState(false);

  const manifest = {
    name: config.name,
    short_name: config.short_name,
    description: config.description,
    start_url: config.start_url,
    display: config.display,
    background_color: config.background_color,
    theme_color: config.theme_color,
    orientation: config.orientation,
    icons: [
      {
        src: "/icon-192.png",
        type: "image/png",
        sizes: "192x192"
      },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512"
      }
    ]
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">App Name</label>
            <input 
              value={config.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Short Name</label>
            <input 
              value={config.short_name}
              onChange={(e) => handleChange('short_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <input 
              value={config.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Theme Color</label>
             <div className="flex gap-2">
               <input 
                 type="color" 
                 value={config.theme_color} 
                 onChange={(e) => handleChange('theme_color', e.target.value)}
                 className="h-10 w-10 rounded cursor-pointer border-0 p-0"
               />
               <input 
                 value={config.theme_color}
                 onChange={(e) => handleChange('theme_color', e.target.value)}
                 className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm uppercase"
               />
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Background</label>
             <div className="flex gap-2">
               <input 
                 type="color" 
                 value={config.background_color} 
                 onChange={(e) => handleChange('background_color', e.target.value)}
                 className="h-10 w-10 rounded cursor-pointer border-0 p-0"
               />
               <input 
                 value={config.background_color}
                 onChange={(e) => handleChange('background_color', e.target.value)}
                 className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm uppercase"
               />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Display Mode</label>
             <select 
               value={config.display}
               onChange={(e) => handleChange('display', e.target.value)}
               className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
             >
               <option value="standalone">Standalone</option>
               <option value="fullscreen">Fullscreen</option>
               <option value="minimal-ui">Minimal UI</option>
               <option value="browser">Browser</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Orientation</label>
             <select 
               value={config.orientation}
               onChange={(e) => handleChange('orientation', e.target.value)}
               className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
             >
               <option value="any">Any</option>
               <option value="portrait">Portrait</option>
               <option value="landscape">Landscape</option>
             </select>
           </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
         <div className="bg-gray-100 rounded-t-xl p-3 flex justify-between items-center border border-gray-200 border-b-0">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
               <Smartphone size={16} /> Preview & Code
            </div>
            <button 
              onClick={handleCopy}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
         </div>
         <pre className="flex-1 bg-gray-900 text-gray-100 p-4 font-mono text-sm overflow-auto rounded-b-xl border border-gray-800">
           {JSON.stringify(manifest, null, 2)}
         </pre>
      </div>
    </div>
  );
};