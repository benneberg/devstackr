import React, { useState, useMemo } from 'react';
import { Bug, Search, Filter, Trash2, Copy, Check, AlertCircle, FileText, ChevronRight, Zap } from 'lucide-react';

interface StackFrame {
  method: string;
  file: string;
  line: string;
  column: string;
  isInternal: boolean;
}

export const ErrorStackParser: React.FC = () => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const frames = useMemo(() => {
    if (!input.trim()) return [];

    const lines = input.split('\n');
    const parsedFrames: StackFrame[] = [];

    lines.forEach(line => {
      // Basic regex for common stack trace formats (Node, Chrome, Firefox)
      const match = line.match(/at\s+(?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+))\)?/);
      if (match) {
        const [, method, file, lineNum, col] = match;
        const isInternal = file.includes('node_modules') || file.includes('node:internal');
        parsedFrames.push({
          method: method || '<anonymous>',
          file: file || 'unknown',
          line: lineNum || '0',
          column: col || '0',
          isInternal
        });
      }
    });

    return parsedFrames;
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(frames, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const framework = useMemo(() => {
    const lower = input.toLowerCase();
    if (lower.includes('react')) return 'React';
    if (lower.includes('node:internal')) return 'Node.js';
    if (lower.includes('python')) return 'Python';
    return 'Unknown';
  }, [input]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Bug size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Stack Trace Parser</h2>
            <p className="text-sm text-gray-500">Extract file paths and line numbers from raw error stacks.</p>
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
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} className="text-blue-500" />
              Raw Stack Trace
            </label>
            {framework !== 'Unknown' && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                Detected: {framework}
              </span>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your error stack trace here..."
            className="w-full h-96 bg-gray-50 border border-gray-200 rounded-2xl p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        {/* Parsed Output */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" fill="currentColor" />
            Structured Output
          </label>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-96 flex flex-col">
            <div className="flex-1 overflow-auto p-4 space-y-2 custom-scrollbar">
              {frames.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                  <Bug size={48} className="opacity-20" />
                  <p className="text-sm italic">No valid stack frames detected.</p>
                </div>
              ) : (
                frames.map((frame, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-xl border transition-all ${
                      frame.isInternal ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-blue-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <ChevronRight size={14} className="mt-1 text-blue-500" />
                      <div className="space-y-1">
                        <div className="font-mono text-xs font-bold text-gray-900 break-all">{frame.method}</div>
                        <div className="font-mono text-[10px] text-gray-500 break-all">
                          {frame.file}:{frame.line}:{frame.column}
                        </div>
                      </div>
                    </div>
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
