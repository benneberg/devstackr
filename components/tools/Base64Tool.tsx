import React, { useState, useEffect } from 'react';
import { Hash, Copy, Check, Trash2, RefreshCw, AlertCircle, Zap } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
      setError(null);
    } catch (e) {
      setError('Invalid Base64 input');
      setOutput('');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Hash size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Base64 Encoder/Decoder</h2>
            <p className="text-sm text-gray-500">Encode and decode text to/from Base64 format.</p>
          </div>
        </div>
        <button 
          onClick={toggleMode}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95"
        >
          <RefreshCw size={16} />
          Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{mode === 'encode' ? 'Text' : 'Base64'}</label>
            <button onClick={() => setInput('')} className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste ${mode === 'encode' ? 'text' : 'Base64'} here...`}
            className="w-full h-80 bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{mode === 'encode' ? 'Base64' : 'Text'}</label>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Output'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="w-full h-80 bg-gray-900 text-gray-100 border border-gray-800 rounded-xl p-4 font-mono text-sm focus:outline-none resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="text-sm font-medium">
            <p className="font-bold mb-1">Decoding Error</p>
            <p className="opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-blue-900">Why use Base64?</h3>
        </div>
        <p className="text-sm text-blue-700 leading-relaxed">
          Base64 is used to encode binary data into ASCII text. It's commonly used for embedding images in HTML/CSS, 
          passing data in URLs, or encoding authentication headers. This tool provides a fast, local way to inspect 
          and generate Base64 strings.
        </p>
      </div>
    </div>
  );
};
