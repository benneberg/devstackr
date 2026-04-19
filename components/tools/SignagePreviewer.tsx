import React, { useState } from 'react';
import { Monitor, Play, Copy, Check, Smartphone, Tablet, Monitor as MonitorIcon, Layout } from 'lucide-react';

const SignagePreviewer: React.FC = () => {
  const [contentUrl, setContentUrl] = useState<string>('https://picsum.photos/seed/signage/1920/1080');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [previewing, setPreviewing] = useState(false);

  const toggleOrientation = () => {
    setOrientation(orientation === 'landscape' ? 'portrait' : 'landscape');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MonitorIcon size={20} className="text-blue-600" />
              Preview Settings
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Content URL</label>
              <input
                type="text"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {['16:9', '4:3', '21:9'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      aspectRatio === ratio ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase">Orientation</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrientation('landscape')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-sm ${
                    orientation === 'landscape' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <MonitorIcon size={16} />
                  Landscape
                </button>
                <button
                  onClick={() => setOrientation('portrait')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-sm ${
                    orientation === 'portrait' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Smartphone size={16} />
                  Portrait
                </button>
              </div>
            </div>

            <button
              onClick={() => setPreviewing(!previewing)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-sm"
            >
              <Play size={18} />
              {previewing ? 'Refresh Preview' : 'Start Preview'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl min-h-[500px] flex items-center justify-center overflow-hidden">
            <div className={`bg-black shadow-2xl transition-all duration-500 overflow-hidden relative ${
              orientation === 'landscape' ? 'w-full aspect-video' : 'h-full aspect-[9/16]'
            }`}>
              {previewing ? (
                <img
                  src={contentUrl}
                  alt="Signage Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 space-y-4">
                  <Layout size={64} strokeWidth={1} />
                  <p className="text-sm font-bold uppercase tracking-widest">Preview Screen</p>
                </div>
              )}
              
              {/* Screen Overlay */}
              <div className="absolute inset-0 border-[12px] border-gray-800 pointer-events-none rounded-sm" />
              <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider">
                {aspectRatio} {orientation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignagePreviewer;
