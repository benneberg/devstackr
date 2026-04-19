import React, { useState } from 'react';
import { ArrowRightLeft, Play, Copy, Check, Plus, Trash2, Link } from 'lucide-react';

const DataMapper: React.FC = () => {
  const [sourceFields, setSourceFields] = useState<string[]>(['id', 'username', 'email', 'created_at']);
  const [targetFields, setTargetFields] = useState<string[]>(['userId', 'name', 'contactEmail', 'timestamp']);
  const [mappings, setMappings] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const addMapping = (source: string, target: string) => {
    if (mappings.find(m => m.source === source || m.target === target)) return;
    setMappings([...mappings, { source, target }]);
  };

  const removeMapping = (idx: number) => {
    setMappings(mappings.filter((_, i) => i !== idx));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(mappings, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 min-h-[400px]">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ArrowRightLeft size={20} className="text-blue-600" />
              Source Schema
            </h3>
            <div className="space-y-2">
              {sourceFields.map((field) => (
                <div key={field} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-pointer group">
                  <span className="text-sm font-mono text-gray-700">{field}</span>
                  <Plus size={14} className="text-gray-300 group-hover:text-blue-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 min-h-[400px]">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Link size={20} className="text-purple-600" />
              Mappings
            </h3>
            <div className="space-y-3">
              {mappings.map((mapping, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-100 rounded-xl shadow-sm">
                  <div className="flex-1 text-right font-mono text-xs font-bold text-purple-900">{mapping.source}</div>
                  <ArrowRightLeft size={14} className="text-purple-400" />
                  <div className="flex-1 font-mono text-xs font-bold text-purple-900">{mapping.target}</div>
                  <button onClick={() => removeMapping(idx)} className="text-purple-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {mappings.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 py-20">
                  <Link size={48} strokeWidth={1} />
                  <p className="text-xs text-center">Click fields to create mappings</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 min-h-[400px]">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ArrowRightLeft size={20} className="text-green-600" />
              Target Schema
            </h3>
            <div className="space-y-2">
              {targetFields.map((field) => (
                <div key={field} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-green-50 hover:border-green-100 transition-colors cursor-pointer group">
                  <span className="text-sm font-mono text-gray-700">{field}</span>
                  <Plus size={14} className="text-gray-300 group-hover:text-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
          {copied ? 'Copied Mappings!' : 'Export Mapping JSON'}
        </button>
      </div>
    </div>
  );
};

export default DataMapper;
