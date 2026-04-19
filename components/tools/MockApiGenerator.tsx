import React, { useState, useEffect } from 'react';
import { Server, Copy, Check, Trash2, Zap, Play, Globe, Code, FileJson, AlertCircle } from 'lucide-react';
import { faker } from '@faker-js/faker';

export const MockApiGenerator: React.FC = () => {
  const [schema, setSchema] = useState<string>(JSON.stringify({
    id: 'datatype.uuid',
    name: 'person.fullName',
    email: 'internet.email',
    avatar: 'image.avatar',
    bio: 'lorem.sentence',
    createdAt: 'date.past'
  }, null, 2));
  const [count, setCount] = useState(10);
  const [output, setOutput] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateData = () => {
    try {
      const parsedSchema = JSON.parse(schema);
      const data = Array.from({ length: count }).map(() => {
        const item: any = {};
        Object.entries(parsedSchema).forEach(([key, value]) => {
          if (typeof value === 'string') {
            const [namespace, method] = value.split('.');
            if (namespace && method && (faker as any)[namespace] && (faker as any)[namespace][method]) {
              item[key] = (faker as any)[namespace][method]();
            } else {
              item[key] = value; // Fallback to literal string
            }
          } else {
            item[key] = value;
          }
        });
        return item;
      });
      setOutput(data);
      setError(null);
    } catch (e: any) {
      setError(`Schema Error: ${e.message}`);
      setOutput([]);
    }
  };

  useEffect(() => {
    generateData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(output, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Server size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mock API Generator</h2>
            <p className="text-sm text-gray-500">Generate fake REST APIs from JSON schemas.</p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex items-center bg-gray-100 rounded-xl px-3 border border-gray-200">
            <span className="text-xs font-bold text-gray-500 mr-2">Count:</span>
            <input 
              type="number" 
              value={count} 
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-12 bg-transparent border-none text-sm font-bold text-gray-900 focus:outline-none"
            />
          </div>
          <button 
            onClick={generateData}
            className="flex-1 md:flex-none px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play size={16} fill="currentColor" /> Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schema Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Code size={14} className="text-blue-500" />
              JSON Schema Definition
            </label>
            <button onClick={() => setSchema('{}')} className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder="Define your schema using Faker.js methods..."
            className="w-full h-96 bg-gray-50 border border-gray-200 rounded-2xl p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl flex items-start gap-2 text-xs">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Output Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <FileJson size={14} className="text-emerald-500" />
              Mock API Response
            </label>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl h-96 flex flex-col">
            <pre className="flex-1 overflow-auto p-4 font-mono text-xs text-emerald-400 custom-scrollbar">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-blue-900">How to use Mock API Generator</h3>
        </div>
        <p className="text-sm text-blue-700 leading-relaxed mb-4">
          Define your data structure using <a href="https://fakerjs.dev/api/" target="_blank" rel="noreferrer" className="underline font-bold">Faker.js</a> namespaces and methods. 
          For example, use <code>"name": "person.fullName"</code> to generate realistic names.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {['person.fullName', 'internet.email', 'image.avatar', 'date.past', 'lorem.sentence', 'datatype.uuid', 'finance.amount', 'commerce.productName'].map(ex => (
            <code key={ex} className="bg-white/50 p-2 rounded text-[10px] text-blue-800 border border-blue-100">{ex}</code>
          ))}
        </div>
      </div>
    </div>
  );
};
