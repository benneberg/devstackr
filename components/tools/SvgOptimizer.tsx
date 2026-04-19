import React, { useState, useEffect } from 'react';
import { Image, Copy, Check, Trash2, Zap, Download, Maximize2, Minimize2 } from 'lucide-react';

export const SvgOptimizer: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ original: number; optimized: number } | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setStats(null);
      return;
    }

    // Simple SVG optimization logic (removing metadata, comments, etc.)
    let optimized = input
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/<\?xml[\s\S]*?\?>/g, '') // Remove XML declaration
      .replace(/<!DOCTYPE[\s\S]*?>/g, '') // Remove DOCTYPE
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .trim();

    setOutput(optimized);
    setStats({
      original: new Blob([input]).size,
      optimized: new Blob([optimized]).size
    });
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const savings = stats ? ((stats.original - stats.optimized) / stats.original * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Image size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">SVG Optimizer</h2>
            <p className="text-sm text-gray-500">Reduce SVG file size and clean up code.</p>
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
            onClick={handleDownload}
            disabled={!output}
            className="flex-1 md:flex-none px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input & Stats */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Original SVG Code</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste SVG code here..."
              className="w-full h-80 bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {stats && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center justify-around animate-in fade-in slide-in-from-top-2">
              <div className="text-center">
                <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Original</span>
                <span className="text-xl font-bold text-emerald-900">{(stats.original / 1024).toFixed(2)} KB</span>
              </div>
              <div className="h-10 w-px bg-emerald-200" />
              <div className="text-center">
                <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Optimized</span>
                <span className="text-xl font-bold text-emerald-900">{(stats.optimized / 1024).toFixed(2)} KB</span>
              </div>
              <div className="h-10 w-px bg-emerald-200" />
              <div className="text-center">
                <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Savings</span>
                <span className="text-xl font-bold text-emerald-900">{savings}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Preview & Output */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Preview</h3>
            <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 relative group">
              {output ? (
                <div 
                  className="w-full h-full flex items-center justify-center p-8"
                  dangerouslySetInnerHTML={{ __html: output }}
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center gap-2">
                  <Image size={32} className="opacity-20" />
                  <span className="text-xs">No preview available</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Optimized Code</h3>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Optimized SVG will appear here..."
              className="w-full h-40 bg-gray-900 text-gray-100 border border-gray-800 rounded-xl p-4 font-mono text-xs focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
