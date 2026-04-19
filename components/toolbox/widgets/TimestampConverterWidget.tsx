import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check, RefreshCw } from 'lucide-react';

export const TimestampConverterWidget: React.FC = () => {
  const [unix, setUnix] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [iso, setIso] = useState<string>(new Date().toISOString());
  const [copied, setCopied] = useState(false);

  const handleUnixChange = (val: string) => {
    setUnix(val);
    try {
      const num = parseInt(val);
      if (isNaN(num)) throw new Error();
      const date = val.length > 11 ? new Date(num) : new Date(num * 1000);
      if (isNaN(date.getTime())) throw new Error();
      setIso(date.toISOString());
    } catch (e) {
      setIso('Invalid');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(unix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setNow = () => {
    const now = Date.now();
    setUnix(Math.floor(now / 1000).toString());
    setIso(new Date(now).toISOString());
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unix Converter</span>
        <div className="flex gap-2">
          <button onClick={setNow} className="text-gray-400 hover:text-blue-600 transition-colors">
            <RefreshCw size={14} />
          </button>
          <button onClick={handleCopy} className="text-gray-400 hover:text-blue-600 transition-colors">
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unix Timestamp</label>
          <input
            type="text"
            value={unix}
            onChange={(e) => handleUnixChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Unix"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ISO 8601</label>
          <div className="w-full bg-gray-900 text-gray-100 border border-gray-800 rounded-lg px-3 py-2 text-[10px] font-mono overflow-hidden text-ellipsis whitespace-nowrap">
            {iso}
          </div>
        </div>
      </div>
    </div>
  );
};
