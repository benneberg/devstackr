import React, { useState } from 'react';
import { Type, Copy, Check, Trash2 } from 'lucide-react';

export const TextTransformerWidget: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTransform = (type: string) => {
    let result = text;
    const lines = text.split('\n');

    const toCamelCase = (str: string) => str.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
    const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).replace(/^_/, '');
    const toKebabCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '');

    switch (type) {
      case 'uppercase': result = text.toUpperCase(); break;
      case 'lowercase': result = text.toLowerCase(); break;
      case 'camel': result = lines.map(toCamelCase).join('\n'); break;
      case 'snake': result = lines.map(toSnakeCase).join('\n'); break;
      case 'kebab': result = lines.map(toKebabCase).join('\n'); break;
      case 'trim': result = lines.map(l => l.trim()).join('\n'); break;
      case 'deduplicate': result = Array.from(new Set(lines)).join('\n'); break;
      case 'sort': result = [...lines].sort((a, b) => a.localeCompare(b)).join('\n'); break;
    }
    setText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Transform</span>
        <div className="flex gap-2">
          <button onClick={() => setText('')} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
          <button onClick={handleCopy} className="text-gray-400 hover:text-blue-600 transition-colors">
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text..."
        className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors resize-none"
      />

      <div className="grid grid-cols-4 gap-1">
        <button onClick={() => handleTransform('uppercase')} className="px-1 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-gray-600 transition-colors">UPPER</button>
        <button onClick={() => handleTransform('lowercase')} className="px-1 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-gray-600 transition-colors">lower</button>
        <button onClick={() => handleTransform('camel')} className="px-1 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-gray-600 transition-colors">camel</button>
        <button onClick={() => handleTransform('snake')} className="px-1 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-gray-600 transition-colors">snake</button>
        <button onClick={() => handleTransform('kebab')} className="px-1 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-gray-600 transition-colors">kebab</button>
        <button onClick={() => handleTransform('trim')} className="px-1 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-gray-600 transition-colors">trim</button>
        <button onClick={() => handleTransform('deduplicate')} className="px-1 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-gray-600 transition-colors">dedup</button>
        <button onClick={() => handleTransform('sort')} className="px-1 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] font-bold text-gray-600 transition-colors">sort</button>
      </div>
    </div>
  );
};
