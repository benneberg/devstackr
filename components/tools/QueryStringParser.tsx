import React, { useState, useEffect } from 'react';
import { Link, Copy, Check, Trash2, Plus, X, Globe, Zap } from 'lucide-react';

interface QueryParam {
  key: string;
  value: string;
}

export const QueryStringParser: React.FC = () => {
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
      // If not a full URL, try parsing as a query string
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Link size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Query String Parser</h2>
            <p className="text-sm text-gray-500">Parse, edit, and rebuild URL query parameters.</p>
          </div>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <Globe size={14} className="text-blue-500" />
          URL / Query String
        </label>
        <div className="relative group">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              parseUrl(e.target.value);
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="Paste URL or query string here..."
          />
          <button onClick={() => { setUrl(''); setParams([]); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" fill="currentColor" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Parameters</span>
          </div>
          <button 
            onClick={addParam}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <Plus size={14} /> Add Parameter
          </button>
        </div>
        <div className="p-6 space-y-3">
          {params.length === 0 && (
            <div className="text-center py-8 text-gray-400 italic text-sm">
              No parameters found. Add one to get started.
            </div>
          )}
          {params.map((param, index) => (
            <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
              <input
                type="text"
                value={param.key}
                onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                placeholder="Key"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-blue-500 transition-all"
              />
              <input
                type="text"
                value={param.value}
                onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-[2] bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-blue-500 transition-all"
              />
              <button 
                onClick={() => removeParam(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
