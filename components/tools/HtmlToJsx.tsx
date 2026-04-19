import React, { useState, useEffect } from 'react';
import { Code, Copy, Check, Trash2, Zap, FileCode, AlertCircle } from 'lucide-react';

export const HtmlToJsx: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      // Simple HTML to JSX conversion logic
      let jsx = input
        .replace(/class=/g, 'className=')
        .replace(/for=/g, 'htmlFor=')
        .replace(/tabindex=/g, 'tabIndex=')
        .replace(/onclick=/g, 'onClick=')
        .replace(/onchange=/g, 'onChange=')
        .replace(/onsubmit=/g, 'onSubmit=')
        .replace(/style="([^"]*)"/g, (match, styleStr) => {
          const styleObj = styleStr.split(';').reduce((acc: any, style: string) => {
            const [key, value] = style.split(':').map(s => s.trim());
            if (key && value) {
              const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              acc[camelKey] = value;
            }
            return acc;
          }, {});
          return `style={${JSON.stringify(styleObj)}}`;
        })
        .replace(/<([a-z0-9]+)([^>]*)\/>/gi, '<$1$2></$1>') // Ensure self-closing tags are handled
        .replace(/<([a-z0-9]+)([^>]*)\s*>/gi, (match, tag, attrs) => {
          // Handle self-closing tags like img, br, input, hr
          const selfClosing = ['img', 'br', 'input', 'hr', 'meta', 'link'].includes(tag.toLowerCase());
          if (selfClosing && !attrs.endsWith('/')) {
            return `<${tag}${attrs} />`;
          }
          return match;
        });

      setOutput(jsx);
      setError(null);
    } catch (e: any) {
      setError(`Conversion Error: ${e.message}`);
      setOutput('');
    }
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <FileCode size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">HTML to JSX Converter</h2>
            <p className="text-sm text-gray-500">Convert standard HTML code into React-compatible JSX.</p>
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
            {copied ? 'Copied!' : 'Copy JSX'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HTML Input */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Code size={14} className="text-blue-500" />
            HTML Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML code here..."
            className="w-full h-96 bg-gray-50 border border-gray-200 rounded-2xl p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        {/* JSX Output */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" fill="currentColor" />
            JSX Output
          </label>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl h-96 flex flex-col">
            <pre className="flex-1 overflow-auto p-4 font-mono text-xs text-blue-400 custom-scrollbar">
              {output || 'JSX will appear here...'}
            </pre>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="text-sm font-medium">
            <p className="font-bold mb-1">Conversion Error</p>
            <p className="opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-blue-900">What changes?</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            <span><code>class</code> → <code>className</code></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            <span><code>for</code> → <code>htmlFor</code></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            <span>Inline styles → Object syntax</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            <span>Self-closing tags (img, input, etc.)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            <span>Event handlers (onclick → onClick)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
