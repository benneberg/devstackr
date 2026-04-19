import React, { useState } from 'react';
import { Link, Copy, Check, Trash2, Plus, X } from 'lucide-react';

interface QueryParam {
  key: string;
  value: string;
}

export const QueryStringWidget: React.FC = () => {
  const [url, setUrl] = useState('');
  const [params, setParams] = useState<QueryParam[]>([]);
  const [copied, setCopied] = useState(false);

  const parseUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);
      const searchParams = new URLSearchParams(urlObj.search);
      const newParams: QueryParam[] = [];
      searchParams.forEach((value, key) => {
        newParams.push({ key, value });
      });
      setParams(newParams);
    } catch (e) {
      try {
        const searchParams = new URLSearchParams(inputUrl.startsWith('?') ? inputUrl.slice(1) : inputUrl);
        const newParams: QueryParam[] = [];
        searchParams.forEach((value, key) => {
          newParams.push({ key, value });
        });
        setParams(newParams);
      } catch (e2) {
        setParams([]);
      }
    }
  };

  const rebuildUrl = () => {
    try {
      const searchParams = new URLSearchParams();
      params.forEach(p => {
        if (p.key) searchParams.append(p.key, p.value);
      });
      const queryString = searchParams.toString();
      let baseUrl = url.split('?')[0];
      if (!baseUrl && queryString) return `?${queryString}`;
      return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    } catch (e) {
      return url;
    }
  };

  const handleParamChange = (index: number, field: 'key' | 'value', val: string) => {
    const newParams = [...params];
    newParams[index][field] = val;
    setParams(newParams);
    setUrl(rebuildUrl());
  };

  const addParam = () => {
    setParams([...params, { key: '', value: '' }]);
  };

  const removeParam = (index: number) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
    setUrl(rebuildUrl());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rebuildUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Query Parser</span>
        <div className="flex gap-2">
          <button onClick={() => { setUrl(''); setParams([]); }} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
          <button onClick={handleCopy} className="text-gray-400 hover:text-blue-600 transition-colors">
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <input
        type="text"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          parseUrl(e.target.value);
        }}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[10px] font-mono focus:outline-none focus:border-blue-500 transition-colors"
        placeholder="Paste URL..."
      />

      <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
        {params.map((param, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={param.key}
              onChange={(e) => handleParamChange(index, 'key', e.target.value)}
              placeholder="Key"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-blue-500 transition-all"
            />
            <input
              type="text"
              value={param.value}
              onChange={(e) => handleParamChange(index, 'value', e.target.value)}
              placeholder="Value"
              className="flex-[2] bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-blue-500 transition-all"
            />
            <button onClick={() => removeParam(index)} className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={12} />
            </button>
          </div>
        ))}
        <button 
          onClick={addParam}
          className="w-full py-1.5 border border-dashed border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-all"
        >
          + Add Parameter
        </button>
      </div>
    </div>
  );
};
