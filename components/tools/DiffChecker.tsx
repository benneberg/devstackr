import React, { useState, useMemo } from 'react';
import { Split, Columns, FileJson, FileText, ArrowRightLeft } from 'lucide-react';
import * as diff from 'diff';

export const DiffChecker: React.FC = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [mode, setMode] = useState<'text' | 'json'>('text');

  const diffResult = useMemo(() => {
    if (mode === 'json') {
      try {
        const oldObj = JSON.parse(oldText || '{}');
        const newObj = JSON.parse(newText || '{}');
        return diff.diffJson(oldObj, newObj);
      } catch (e) {
        return diff.diffLines(oldText, newText);
      }
    }
    return diff.diffLines(oldText, newText);
  }, [oldText, newText, mode]);

  const formatJson = (text: string) => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch (e) {
      return text;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setMode('text')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${mode === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileText size={16} /> Text Diff
          </button>
          <button
            onClick={() => setMode('json')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${mode === 'json' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileJson size={16} /> JSON Diff
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (mode === 'json') {
                setOldText(formatJson(oldText));
                setNewText(formatJson(newText));
              }
            }}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Prettify JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Original</label>
          <textarea
            className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Paste original text here..."
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Changed</label>
          <textarea
            className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Paste changed text here..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
          <ArrowRightLeft size={18} className="text-gray-400" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Comparison Result</h3>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="font-mono text-sm leading-relaxed">
            {diffResult.map((part, index) => (
              <span
                key={index}
                className={`${
                  part.added ? 'bg-emerald-100 text-emerald-900' : 
                  part.removed ? 'bg-red-100 text-red-900 line-through decoration-red-300' : 
                  'text-gray-600'
                } px-0.5 rounded`}
              >
                {part.value}
              </span>
            ))}
          </pre>
          {(!oldText && !newText) && (
            <div className="py-12 text-center text-gray-400">
              <Split size={48} className="mx-auto mb-4 opacity-20" />
              <p>Enter text above to see the differences</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
