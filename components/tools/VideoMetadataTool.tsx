import React, { useState } from 'react';
import { Video, Settings, Save, Play, Info, Layers, Sliders, CheckCircle2, User } from 'lucide-react';

interface VideoProfile {
  name: string;
  codec: string;
  bitrate: string;
  resolution: string;
  fps: string;
  isPreset?: boolean;
}

const PRESETS: VideoProfile[] = [
  { name: 'YouTube 1080p', codec: 'H.264', bitrate: '8 Mbps', resolution: '1920x1080', fps: '30', isPreset: true },
  { name: 'YouTube 4K', codec: 'VP9', bitrate: '45 Mbps', resolution: '3840x2160', fps: '60', isPreset: true },
  { name: 'Instagram Reel', codec: 'H.264', bitrate: '4 Mbps', resolution: '1080x1920', fps: '30', isPreset: true },
  { name: 'Twitter Video', codec: 'H.264', bitrate: '2 Mbps', resolution: '1280x720', fps: '30', isPreset: true },
];

export const VideoMetadataTool: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState<VideoProfile>(PRESETS[0]);
  const [customProfile, setCustomProfile] = useState<VideoProfile>({
    name: 'Custom Profile',
    codec: 'H.265',
    bitrate: '12 Mbps',
    resolution: '1920x1080',
    fps: '60'
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveCustom = () => {
    setActiveProfile(customProfile);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[600px]">
      {/* Sidebar: Presets */}
      <div className="w-full md:w-72 border-r border-gray-100 bg-gray-50/50 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
            <Video size={20} />
          </div>
          <h2 className="font-bold text-gray-900">Video Meta</h2>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Standard Presets</label>
            <div className="space-y-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => { setActiveProfile(preset); setIsEditing(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${activeProfile.name === preset.name ? 'bg-white text-rose-600 shadow-sm border border-rose-100' : 'text-gray-500 hover:bg-white hover:text-gray-900'}`}
                >
                  {preset.name}
                  {activeProfile.name === preset.name && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Personal Profile</label>
            <button
              onClick={() => { setActiveProfile(customProfile); setIsEditing(true); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${activeProfile.name === customProfile.name ? 'bg-white text-rose-600 shadow-sm border border-rose-100' : 'text-gray-500 hover:bg-white hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-2">
                <User size={14} />
                {customProfile.name}
              </div>
              {activeProfile.name === customProfile.name && <CheckCircle2 size={14} />}
            </button>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
            <div className="flex items-center gap-2 text-rose-700 mb-1">
              <Info size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Storage Tip</span>
            </div>
            <p className="text-[11px] text-rose-600 leading-relaxed font-medium">
              Profiles are saved locally to your browser's storage.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Editor/Viewer */}
      <div className="flex-1 p-8 bg-white">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Profile' : activeProfile.name}</h1>
              <p className="text-gray-500 font-medium">Configure encoding and metadata parameters.</p>
            </div>
            {isEditing ? (
              <button 
                onClick={handleSaveCustom}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
              >
                <Save size={18} />
                Save Changes
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {activeProfile.isPreset ? 'Read Only' : 'Customizable'}
                </span>
              </div>
            )}
          </div>

          {/* Grid of Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Layers size={14} /> Video Codec
              </label>
              {isEditing ? (
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-rose-500 outline-none"
                  value={customProfile.codec}
                  onChange={(e) => setCustomProfile({...customProfile, codec: e.target.value})}
                >
                  <option>H.264</option>
                  <option>H.265 (HEVC)</option>
                  <option>VP9</option>
                  <option>AV1</option>
                  <option>ProRes 422</option>
                </select>
              ) : (
                <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900">{activeProfile.codec}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Sliders size={14} /> Target Bitrate
              </label>
              {isEditing ? (
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-rose-500 outline-none"
                  value={customProfile.bitrate}
                  onChange={(e) => setCustomProfile({...customProfile, bitrate: e.target.value})}
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900">{activeProfile.bitrate}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Settings size={14} /> Resolution
              </label>
              {isEditing ? (
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-rose-500 outline-none"
                  value={customProfile.resolution}
                  onChange={(e) => setCustomProfile({...customProfile, resolution: e.target.value})}
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900">{activeProfile.resolution}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Play size={14} /> Frame Rate (FPS)
              </label>
              {isEditing ? (
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-rose-500 outline-none"
                  value={customProfile.fps}
                  onChange={(e) => setCustomProfile({...customProfile, fps: e.target.value})}
                >
                  <option>24</option>
                  <option>30</option>
                  <option>60</option>
                  <option>120</option>
                </select>
              ) : (
                <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900">{activeProfile.fps} FPS</div>
              )}
            </div>
          </div>

          <div className="pt-8">
            <div className="p-6 bg-gray-900 rounded-2xl text-white shadow-xl shadow-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg">FFmpeg Command</h4>
                <button className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">Copy</button>
              </div>
              <code className="block font-mono text-xs text-gray-300 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                ffmpeg -i input.mp4 -c:v {activeProfile.codec === 'H.264' ? 'libx264' : activeProfile.codec === 'H.265 (HEVC)' ? 'libx265' : 'libvpx-vp9'} -b:v {activeProfile.bitrate.replace(' ', '')} -s {activeProfile.resolution} -r {activeProfile.fps} output.mp4
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
