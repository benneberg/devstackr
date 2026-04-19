import React, { useState, useEffect } from 'react';
import { Hash, Copy, Check, RefreshCw } from 'lucide-react';

export const Base64Widget: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (e) {
      setOutput('Invalid');
    }
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Base64 {mode}</span>
        <div className="flex gap-2">
          <button onClick={toggleMode} className="text-gray-400 hover:text-blue-600 transition-colors">
            <RefreshCw size={14} />
          </button>
          <button onClick={handleCopy} className="text-gray-400 hover:text-blue-600 transition-colors">
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Input ${mode === 'encode' ? 'text' : 'Base64'}...`}
          className="w-full h-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
        <div className="w-full h-20 bg-gray-900 text-gray-100 border border-gray-800 rounded-lg px-3 py-2 text-[10px] font-mono overflow-auto break-all">
          {output || 'Result...'}
        </div>
      </div>
    </div>
  );
};
