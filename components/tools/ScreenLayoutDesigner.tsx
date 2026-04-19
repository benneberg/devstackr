import React, { useState } from 'react';
import { Layout, Plus, Trash2, Download, Settings } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

export const ScreenLayoutDesigner: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([
    { id: '1', name: 'Main Content', x: 0, y: 0, w: 8, h: 12, color: 'bg-blue-500' },
    { id: '2', name: 'Sidebar', x: 8, y: 0, w: 4, h: 8, color: 'bg-purple-500' },
    { id: '3', name: 'Ticker', x: 8, y: 8, w: 4, h: 4, color: 'bg-green-500' },
  ]);

  const addZone = () => {
    const newZone: Zone = {
      id: Math.random().toString(36).substr(2, 9),
      name: `New Zone ${zones.length + 1}`,
      x: 0,
      y: 0,
      w: 4,
      h: 4,
      color: 'bg-gray-500',
    };
    setZones([...zones, newZone]);
  };

  const removeZone = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
  };

  const exportLayout = () => {
    const layout = {
      grid: { columns: 12, rows: 12 },
      zones: zones.map(z => ({
        name: z.name,
        gridArea: `${z.y + 1} / ${z.x + 1} / span ${z.h} / span ${z.w}`
      }))
    };
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signage-layout.json';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Layout size={20} className="text-blue-600" /> Layout Canvas (12x12 Grid)
        </h3>
        <div className="flex gap-2">
          <button
            onClick={addZone}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Add Zone
          </button>
          <button
            onClick={exportLayout}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <Download size={16} /> Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl relative grid grid-cols-12 grid-rows-12 gap-1 p-1">
            {zones.map(zone => (
              <div
                key={zone.id}
                style={{
                  gridArea: `${zone.y + 1} / ${zone.x + 1} / span ${zone.h} / span ${zone.w}`
                }}
                className={`${zone.color} rounded-lg shadow-lg flex flex-col items-center justify-center text-white p-2 text-center group relative border-2 border-white/20`}
              >
                <span className="font-bold text-xs truncate w-full">{zone.name}</span>
                <span className="text-[10px] opacity-80">{zone.w}x{zone.h}</span>
                <button
                  onClick={() => removeZone(zone.id)}
                  className="absolute top-1 right-1 p-1 bg-black/20 hover:bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Zone Inspector</h4>
          <div className="space-y-3 max-h-[500px] overflow-auto pr-2">
            {zones.map(zone => (
              <div key={zone.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <input
                    value={zone.name}
                    onChange={(e) => {
                      const newZones = [...zones];
                      const idx = newZones.findIndex(z => z.id === zone.id);
                      newZones[idx].name = e.target.value;
                      setZones(newZones);
                    }}
                    className="font-bold text-gray-900 border-none p-0 focus:ring-0 w-full"
                  />
                  <Settings size={14} className="text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase">X Position</label>
                    <input
                      type="number"
                      value={zone.x}
                      onChange={(e) => {
                        const newZones = [...zones];
                        const idx = newZones.findIndex(z => z.id === zone.id);
                        newZones[idx].x = parseInt(e.target.value);
                        setZones(newZones);
                      }}
                      className="w-full p-1 text-xs border border-gray-200 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase">Y Position</label>
                    <input
                      type="number"
                      value={zone.y}
                      onChange={(e) => {
                        const newZones = [...zones];
                        const idx = newZones.findIndex(z => z.id === zone.id);
                        newZones[idx].y = parseInt(e.target.value);
                        setZones(newZones);
                      }}
                      className="w-full p-1 text-xs border border-gray-200 rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
