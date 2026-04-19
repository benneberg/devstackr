import React, { useState } from 'react';
import { WidgetProps } from '../../../types';
import { Copy, Check } from 'lucide-react';

export const JsonFormatterWidget: React.FC<WidgetProps> = ({ state, onStateChange }) => {
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(state.input || '');
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (e) {
      setError("Invalid JSON format");
      setOutput('');
    }
  };

  const copyOutput = () => {
      if(!output) return;
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col h-full text-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-500 font-medium">Input / Output</span>
        <div className="flex gap-2">
             {output && (
                <button onClick={copyOutput} className="text-gray-500 hover:text-gray-900" title="Copy">
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
             )}
            <button onClick={handleFormat} className="bg-gray-900 px-3 py-1 rounded text-white hover:bg-black font-medium transition-colors">
              Format
            </button>
        </div>
      </div>
      <textarea 
        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2 text-gray-700 font-mono resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        placeholder="Paste JSON here..."
        value={state.input || ''}
        onChange={(e) => onStateChange({ ...state, input: e.target.value })}
      />
      {error && <div className="text-red-500 mb-2 font-medium bg-red-50 p-2 rounded border border-red-100">{error}</div>}
      {output && (
        <pre className="flex-1 bg-white border border-gray-200 rounded-lg p-3 text-green-700 font-mono overflow-auto text-[11px]">
          {output}
        </pre>
      )}
    </div>
  );
};