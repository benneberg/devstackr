import React, { useState } from 'react';
import { ListMusic, Plus, Trash2, Play, Copy, Check, Image as ImageIcon, Film, Globe } from 'lucide-react';

const PlaylistManager: React.FC = () => {
  const [items, setItems] = useState<any[]>([
    { id: '1', type: 'image', name: 'Welcome Banner', duration: 10, url: 'https://picsum.photos/seed/welcome/1920/1080' },
    { id: '2', type: 'video', name: 'Product Demo', duration: 30, url: 'https://example.com/video.mp4' }
  ]);
  const [copied, setCopied] = useState(false);

  const addItem = (type: string) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: `New ${type}`,
      duration: 10,
      url: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(items, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <ListMusic size={20} className="text-blue-600" />
          Playlist Items
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={() => addItem('image')} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-bold">
            <ImageIcon size={16} />
            Add Image
          </button>
          <button onClick={() => addItem('video')} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-bold">
            <Film size={16} />
            Add Video
          </button>
          <button onClick={() => addItem('web')} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-bold">
            <Globe size={16} />
            Add Web
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.type === 'image' && <ImageIcon size={16} className="text-blue-500" />}
                {item.type === 'video' && <Film size={16} className="text-purple-500" />}
                {item.type === 'web' && <Globe size={16} className="text-green-500" />}
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    setItems(items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i));
                  }}
                  className="font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 text-sm"
                />
              </div>
              <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Duration (sec)</label>
              <input
                type="number"
                value={item.duration}
                onChange={(e) => {
                  setItems(items.map(i => i.id === item.id ? { ...i, duration: parseInt(e.target.value) } : i));
                }}
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Content URL</label>
              <input
                type="text"
                value={item.url}
                onChange={(e) => {
                  setItems(items.map(i => i.id === item.id ? { ...i, url: e.target.value } : i));
                }}
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="https://..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
          {copied ? 'Copied Playlist!' : 'Export Playlist JSON'}
        </button>
      </div>
    </div>
  );
};

export default PlaylistManager;
