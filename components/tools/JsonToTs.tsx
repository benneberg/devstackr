import React, { useState, useEffect } from 'react';
import JsonToTS from 'json-to-ts';
import { FileJson, Code, Copy, Check, FileText, AlertTriangle } from 'lucide-react';

export const JsonToTs: React.FC = () => {
  const [json, setJson] = useState('{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com",\n  "isActive": true,\n  "roles": ["admin", "user"],\n  "profile": {\n    "bio": "Developer",\n    "avatar": "https://example.com/avatar.png"\n  }\n}');
  const [ts, setTs] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!json.trim()) {
      setTs('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(json);
      const interfaces = JsonToTS(parsed);
      setTs(interfaces.join('\n\n'));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON format');
      setTs('');
    }
  }, [json]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ts);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <FileJson size={14} /> JSON Input
            </label>
            <button 
              onClick={() => {
                try {
                  setJson(JSON.stringify(JSON.parse(json), null, 2));
                } catch (e) {}
              }}
              className="text-[10px] font-bold text-blue-600 hover:underline"
            >
              Prettify
            </button>
          </div>
          <textarea
            className="w-full h-96 p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Paste your JSON here..."
            value={json}
            onChange={(e) => setJson(e.target.value)}
          />
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
              <AlertTriangle className="text-red-500 shrink-0" size={16} />
              <p className="text-xs text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Code size={14} /> TypeScript Interfaces
            </label>
            <button 
              onClick={copyToClipboard}
              className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          <div className="w-full h-96 bg-gray-900 rounded-xl p-4 overflow-auto shadow-inner relative group">
            {ts ? (
              <pre className="text-sm font-mono text-blue-300 leading-relaxed">
                {ts}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <FileText size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Enter valid JSON to generate interfaces</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Code size={18} className="text-gray-400" /> Usage Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nested Objects</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Automatically creates separate interfaces for nested objects to keep your code modular.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Array Detection</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Detects array types and generates the appropriate `Type[]` syntax.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Zod Support</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Coming soon: Toggle between TypeScript interfaces and Zod runtime schemas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
