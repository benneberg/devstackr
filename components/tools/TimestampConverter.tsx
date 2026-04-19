import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check, RefreshCw, Calendar, Globe, Zap } from 'lucide-react';

export const TimestampConverter: React.FC = () => {
  const [unix, setUnix] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [iso, setIso] = useState<string>(new Date().toISOString());
  const [copied, setCopied] = useState<string | null>(null);

  const handleUnixChange = (val: string) => {
    setUnix(val);
    try {
      const num = parseInt(val);
      if (isNaN(num)) throw new Error();
      // Handle both seconds and milliseconds
      const date = val.length > 11 ? new Date(num) : new Date(num * 1000);
      if (isNaN(date.getTime())) throw new Error();
      setIso(date.toISOString());
    } catch (e) {
      setIso('Invalid Timestamp');
    }
  };

  const handleIsoChange = (val: string) => {
    setIso(val);
    try {
      const date = new Date(val);
      if (isNaN(date.getTime())) throw new Error();
      setUnix(Math.floor(date.getTime() / 1000).toString());
    } catch (e) {
      setUnix('Invalid Date');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const setNow = () => {
    const now = Date.now();
    setUnix(Math.floor(now / 1000).toString());
    setIso(new Date(now).toISOString());
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Unix Timestamp Converter</h2>
            <p className="text-sm text-gray-500">Convert between Unix time and human-readable formats.</p>
          </div>
        </div>
        <button 
          onClick={setNow}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95"
        >
          <RefreshCw size={16} />
          Current Time
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Unix Input */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" fill="currentColor" />
            Unix Timestamp
          </label>
          <div className="relative group">
            <input
              type="text"
              value={unix}
              onChange={(e) => handleUnixChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 font-mono text-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g. 1711731375"
            />
            <button 
              onClick={() => handleCopy(unix, 'unix')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {copied === 'unix' ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
            </button>
          </div>
          <p className="text-xs text-gray-400">Supports both seconds (10 digits) and milliseconds (13 digits).</p>
        </div>

        {/* ISO Input */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" />
            ISO 8601 / Human Readable
          </label>
          <div className="relative group">
            <input
              type="text"
              value={iso}
              onChange={(e) => handleIsoChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 font-mono text-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g. 2024-03-29T16:56:15Z"
            />
            <button 
              onClick={() => handleCopy(iso, 'iso')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {copied === 'iso' ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
            </button>
          </div>
          <p className="text-xs text-gray-400">Supports any valid JavaScript Date string format.</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Globe size={16} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Timezone Breakdown</span>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TimeDisplay label="UTC" value={new Date(iso).toUTCString()} />
          <TimeDisplay label="Local Time" value={new Date(iso).toString()} />
          <TimeDisplay label="Relative" value={getRelativeTime(new Date(iso))} />
        </div>
      </div>
    </div>
  );
};

const TimeDisplay: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="space-y-1">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    <p className="text-sm font-mono text-gray-700 break-words">{value}</p>
  </div>
);

function getRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(Math.abs(diff) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const prefix = diff > 0 ? '' : 'in ';
  const suffix = diff > 0 ? ' ago' : '';

  if (seconds < 60) return `${prefix}${seconds}s${suffix}`;
  if (minutes < 60) return `${prefix}${minutes}m${suffix}`;
  if (hours < 24) return `${prefix}${hours}h${suffix}`;
  return `${prefix}${days}d${suffix}`;
}
