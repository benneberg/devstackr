import React, { useState } from 'react';
import { Eye, Play, Copy, Check } from 'lucide-react';

const TypeInferenceVisualizer: React.FC = () => {
  const [code, setCode] = useState<string>('let x = 10;\nlet y = "hello";\nlet z = { a: 1, b: "two" };');
  const [inferences, setInferences] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const visualizeInferences = () => {
    // Mock inference logic for now
    const lines = code.split('\n');
    const results = lines.map((line, idx) => {
      if (line.includes('let x = 10')) return { line: idx + 1, variable: 'x', inferredType: 'number' };
      if (line.includes('let y = "hello"')) return { line: idx + 1, variable: 'y', inferredType: 'string' };
      if (line.includes('let z = { a: 1, b: "two" }')) return { line: idx + 1, variable: 'z', inferredType: '{ a: number; b: string; }' };
      return null;
    }).filter(Boolean);
    
    setInferences(results);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(inferences, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">TypeScript Code</label>
            <button
              onClick={visualizeInferences}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
            >
              <Play size={16} />
              Visualize Inferences
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-blue-100 rounded-2xl border border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-inner"
            placeholder="Enter TypeScript code here..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Inferred Types</label>
            {inferences.length > 0 && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            )}
          </div>
          <div className="w-full h-96 p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-2xl border border-gray-200 overflow-auto shadow-inner">
            {inferences.length > 0 ? (
              <div className="space-y-4">
                {inferences.map((inf, idx) => (
                  <div key={idx} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Line {inf.line}</span>
                      <span className="text-xs font-mono text-gray-400">{inf.variable}</span>
                    </div>
                    <div className="text-sm font-mono text-gray-900">{inf.inferredType}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <Eye size={48} strokeWidth={1} />
                <p>Click "Visualize Inferences" to see types</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeInferenceVisualizer;
