import React, { useState, useMemo } from 'react';
import { Activity, Search, Filter, Trash2, Copy, Check, AlertCircle, Info, AlertTriangle, Bug } from 'lucide-react';

interface LogEntry {
  id: string;
  level: 'error' | 'warn' | 'info' | 'debug' | 'unknown';
  timestamp?: string;
  message: string;
  raw: string;
}

export const LogAnalyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const logs = useMemo(() => {
    if (!input.trim()) return [];
    
    return input.split('\n').filter(line => line.trim()).map((line, index) => {
      const lowerLine = line.toLowerCase();
      let level: LogEntry['level'] = 'unknown';
      
      if (lowerLine.includes('error') || lowerLine.includes('exception') || lowerLine.includes('fatal')) level = 'error';
      else if (lowerLine.includes('warn') || lowerLine.includes('warning')) level = 'warn';
      else if (lowerLine.includes('info')) level = 'info';
      else if (lowerLine.includes('debug')) level = 'debug';

      return {
        id: `log-${index}`,
        level,
        message: line,
        raw: line
      };
    });
  }, [input]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
      return matchesSearch && matchesLevel;
    });
  }, [logs, search, filterLevel]);

  const handleCopy = () => {
    navigator.clipboard.writeText(filteredLogs.map(l => l.raw).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = useMemo(() => ({
    total: logs.length,
    errors: logs.filter(l => l.level === 'error').length,
    warns: logs.filter(l => l.level === 'warn').length,
    infos: logs.filter(l => l.level === 'info').length,
  }), [logs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Log Analyzer</h2>
            <p className="text-sm text-gray-500">Filter, group, and highlight application logs.</p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setInput('')}
            className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Clear
          </button>
          <button 
            onClick={handleCopy}
            className="flex-1 md:flex-none px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy Filtered'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Input & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Log Statistics</h3>
            <div className="space-y-3">
              <StatItem label="Total Lines" value={stats.total} color="bg-gray-100 text-gray-700" />
              <StatItem label="Errors" value={stats.errors} color="bg-red-100 text-red-700" />
              <StatItem label="Warnings" value={stats.warns} color="bg-yellow-100 text-yellow-700" />
              <StatItem label="Info" value={stats.infos} color="bg-blue-100 text-blue-700" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Input Logs</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste raw logs here..."
              className="w-full h-64 bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Analyzer View */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search logs..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
              {['all', 'error', 'warn', 'info', 'debug'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    filterLevel === level ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl h-[600px] flex flex-col">
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed custom-scrollbar">
              {filteredLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
                  <Bug size={48} className="opacity-20" />
                  <p>No logs matching your filters.</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className={`py-1 px-2 rounded hover:bg-white/5 transition-colors flex gap-3 group ${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warn' ? 'text-yellow-400' :
                      log.level === 'info' ? 'text-blue-400' :
                      log.level === 'debug' ? 'text-purple-400' :
                      'text-gray-400'
                    }`}
                  >
                    <span className="shrink-0 opacity-50 select-none w-4">
                      {log.level === 'error' ? <AlertCircle size={12} /> :
                       log.level === 'warn' ? <AlertTriangle size={12} /> :
                       log.level === 'info' ? <Info size={12} /> :
                       <Bug size={12} />}
                    </span>
                    <span className="break-all">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-gray-500">{label}</span>
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${color}`}>{value}</span>
  </div>
);
