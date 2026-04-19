import React, { useState, useEffect } from 'react';
import { Waves, Play, Copy, Check, RefreshCw, Filter, Activity } from 'lucide-react';

const StreamProcessorSim: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [processedEvents, setProcessedEvents] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState<string>('value > 50');

  useEffect(() => {
    if (!isProcessing) return;
    const timer = setInterval(() => {
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 100),
        type: ['sensor', 'user', 'system'][Math.floor(Math.random() * 3)]
      };
      setEvents(prev => [newEvent, ...prev].slice(0, 10));

      // Mock processing logic
      if (newEvent.value > 50) {
        setProcessedEvents(prev => [{ ...newEvent, processed: true }, ...prev].slice(0, 10));
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [isProcessing]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Waves size={20} className="text-blue-600" />
              Stream Configuration
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Filter Condition</label>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                  placeholder="e.target.value > 50"
                />
              </div>
            </div>

            <button
              onClick={() => setIsProcessing(!isProcessing)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-bold shadow-sm ${
                isProcessing ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Stop Stream
                </>
              ) : (
                <>
                  <Play size={18} />
                  Start Stream
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity size={20} className="text-gray-400" />
              Raw Stream
            </h3>
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-400">{ev.timestamp}</span>
                    <span className="text-xs font-bold text-gray-700">{ev.type} event</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-blue-600">{ev.value}</span>
                </div>
              ))}
              {events.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 py-20">
                  <Waves size={48} strokeWidth={1} />
                  <p className="text-xs">Waiting for events...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Check size={20} className="text-green-600" />
              Processed Stream
            </h3>
            <div className="space-y-3">
              {processedEvents.map((ev) => (
                <div key={ev.id} className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-green-400">{ev.timestamp}</span>
                    <span className="text-xs font-bold text-green-700">{ev.type} event</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-green-600">{ev.value}</span>
                </div>
              ))}
              {processedEvents.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 py-20">
                  <Filter size={48} strokeWidth={1} />
                  <p className="text-xs">No events passed filter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamProcessorSim;
