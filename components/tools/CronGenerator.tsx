import React, { useState, useEffect } from 'react';
import cronstrue from 'cronstrue';
import { Clock, Info, Calendar, RefreshCw, Copy, Check } from 'lucide-react';

export const CronGenerator: React.FC = () => {
  const [cron, setCron] = useState('* * * * *');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Individual parts
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');

  useEffect(() => {
    const newCron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setCron(newCron);
    try {
      setExplanation(cronstrue.toString(newCron));
      setError(null);
    } catch (e) {
      setError('Invalid cron expression');
      setExplanation('');
    }
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cron);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { name: 'Every minute', value: '* * * * *' },
    { name: 'Every hour', value: '0 * * * *' },
    { name: 'Every day at midnight', value: '0 0 * * *' },
    { name: 'Every Monday at 9 AM', value: '0 9 * * 1' },
    { name: 'At 12:00 on day 1 of every month', value: '0 12 1 * *' },
  ];

  const applyPreset = (value: string) => {
    const parts = value.split(' ');
    setMinute(parts[0]);
    setHour(parts[1]);
    setDayOfMonth(parts[2]);
    setMonth(parts[3]);
    setDayOfWeek(parts[4]);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-gray-400" /> Cron Builder
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'Min', value: minute, setter: setMinute },
                { label: 'Hour', value: hour, setter: setHour },
                { label: 'Day', value: dayOfMonth, setter: setDayOfMonth },
                { label: 'Month', value: month, setter: setMonth },
                { label: 'Weekday', value: dayOfWeek, setter: setDayOfWeek },
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center block">{item.label}</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-center font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    value={item.value}
                    onChange={(e) => item.setter(e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="flex-1 bg-gray-900 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-gray-900/10">
                <code className="text-blue-300 font-mono text-lg font-bold tracking-wider">{cron}</code>
                <button 
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <Info className="text-red-500 shrink-0" size={18} />
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                <Info className="text-blue-500 shrink-0" size={18} />
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  “{explanation}”
                </p>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <RefreshCw size={18} className="text-gray-400" /> Presets
            </h3>
            <div className="space-y-2">
              {presets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(preset.value)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all flex justify-between items-center group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{preset.name}</span>
                  <code className="text-xs font-mono text-gray-400 group-hover:text-blue-400">{preset.value}</code>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" /> Next Run Times
            </h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
                    {i}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(Date.now() + i * 3600000).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Scheduled Execution</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-gray-400 text-center italic">
              Note: Preview times are simulated based on current time.
            </p>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl text-white space-y-4 shadow-xl shadow-gray-900/20">
            <h4 className="font-bold text-sm uppercase tracking-widest text-blue-400">Quick Reference</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-gray-300">Wildcards</p>
                <p className="text-gray-500"><code className="text-blue-300">*</code> Any value</p>
                <p className="text-gray-500"><code className="text-blue-300">,</code> Value list</p>
                <p className="text-gray-500"><code className="text-blue-300">-</code> Range of values</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-gray-300">Special</p>
                <p className="text-gray-500"><code className="text-blue-300">/</code> Step values</p>
                <p className="text-gray-500"><code className="text-blue-300">L</code> Last day</p>
                <p className="text-gray-500"><code className="text-blue-300">W</code> Weekday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
