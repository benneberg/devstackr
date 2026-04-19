import React, { useState, useEffect } from 'react';
import { HeartPulse, Play, Copy, Check, RefreshCw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const DeviceMonitor: React.FC = () => {
  const [devices, setDevices] = useState<any[]>([
    { id: 'dev-001', name: 'Main Lobby Screen', status: 'online', cpu: 12, memory: 45, lastSeen: 'Just now' },
    { id: 'dev-002', name: 'Conference Room A', status: 'online', cpu: 8, memory: 32, lastSeen: '2 mins ago' },
    { id: 'dev-003', name: 'Cafeteria Display', status: 'offline', cpu: 0, memory: 0, lastSeen: '1 hour ago' }
  ]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!isMonitoring) return;
    const timer = setInterval(() => {
      setDevices(prev => prev.map(dev => {
        if (dev.status === 'offline') return dev;
        return {
          ...dev,
          cpu: Math.floor(Math.random() * 20) + 5,
          memory: Math.floor(Math.random() * 30) + 30,
          lastSeen: 'Just now'
        };
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, [isMonitoring]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <HeartPulse size={20} className="text-red-600" />
          Device Network Status
        </h3>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm shadow-sm ${
            isMonitoring ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isMonitoring ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Stop Monitoring
            </>
          ) : (
            <>
              <Play size={16} />
              Start Monitoring
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((dev) => (
          <div key={dev.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {dev.status === 'online' ? (
                  <CheckCircle2 size={20} className="text-green-500" />
                ) : (
                  <XCircle size={20} className="text-red-500" />
                )}
                <div>
                  <div className="font-bold text-gray-900">{dev.name}</div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase">{dev.id}</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                dev.status === 'online' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {dev.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase">
                  <span>CPU Usage</span>
                  <span>{dev.cpu}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${dev.cpu > 15 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${dev.cpu}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase">
                  <span>Memory</span>
                  <span>{dev.memory}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${dev.memory}%` }} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <span className="text-xs text-gray-400">Last Seen</span>
              <span className="text-xs font-bold text-gray-700">{dev.lastSeen}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceMonitor;
