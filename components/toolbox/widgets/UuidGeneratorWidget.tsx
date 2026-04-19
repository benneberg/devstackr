import React, { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';

export const UuidGeneratorWidget: React.FC = () => {
  const [uuid, setUuid] = useState(crypto.randomUUID());
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setUuid(crypto.randomUUID());
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">UUID v4</span>
        <button 
          onClick={generate}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          title="Regenerate"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      
      <div className="flex gap-2">
        <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 break-all">
          {uuid}
        </code>
        <button 
          onClick={copy}
          className={`px-3 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};
