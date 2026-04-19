import React, { useState, useEffect } from 'react';
import { Type, Copy, Check, Trash2, SortAsc, SortDesc, Filter, Zap } from 'lucide-react';

const toCamelCase = (str: string) => str.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).replace(/^_/, '');
const toKebabCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '');
const toPascalCase = (str: string) => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

export const TextTransformer: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTransform = (type: string) => {
    let result = input;
    const lines = input.split('\n');

    switch (type) {
      case 'uppercase': result = input.toUpperCase(); break;
      case 'lowercase': result = input.toLowerCase(); break;
      case 'camel': result = lines.map(toCamelCase).join('\n'); break;
      case 'snake': result = lines.map(toSnakeCase).join('\n'); break;
      case 'kebab': result = lines.map(toKebabCase).join('\n'); break;
      case 'pascal': result = lines.map(toPascalCase).join('\n'); break;
      case 'trim': result = lines.map(l => l.trim()).join('\n'); break;
      case 'deduplicate': result = Array.from(new Set(lines)).join('\n'); break;
      case 'sort-asc': result = [...lines].sort((a, b) => a.localeCompare(b)).join('\n'); break;
      case 'sort-desc': result = [...lines].sort((a, b) => b.localeCompare(a)).join('\n'); break;
      case 'reverse': result = lines.map(l => l.split('').reverse().join('')).join('\n'); break;
    }
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output || input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Input Text</label>
            <button onClick={() => setInput('')} className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text to transform..."
            className="w-full h-80 bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Output</label>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Output'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Transformed text will appear here..."
            className="w-full h-80 bg-gray-900 text-gray-100 border border-gray-800 rounded-xl p-4 font-mono text-sm focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <TransformButton label="UPPERCASE" onClick={() => handleTransform('uppercase')} />
        <TransformButton label="lowercase" onClick={() => handleTransform('lowercase')} />
        <TransformButton label="camelCase" onClick={() => handleTransform('camel')} />
        <TransformButton label="snake_case" onClick={() => handleTransform('snake')} />
        <TransformButton label="kebab-case" onClick={() => handleTransform('kebab')} />
        <TransformButton label="PascalCase" onClick={() => handleTransform('pascal')} />
        <TransformButton label="Trim Lines" onClick={() => handleTransform('trim')} />
        <TransformButton label="Deduplicate" onClick={() => handleTransform('deduplicate')} />
        <TransformButton label="Sort ASC" onClick={() => handleTransform('sort-asc')} icon={<SortAsc size={14} />} />
        <TransformButton label="Sort DESC" onClick={() => handleTransform('sort-desc')} icon={<SortDesc size={14} />} />
        <TransformButton label="Reverse" onClick={() => handleTransform('reverse')} />
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-lg border border-gray-100 text-blue-600 shadow-sm">
            <Type size={20} />
          </div>
          <h3 className="font-bold text-gray-900">Text Transformation Power Tool</h3>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Quickly clean up messy logs, convert variable names between different programming conventions, or organize lists. 
          All transformations are performed locally in your browser.
        </p>
      </div>
    </div>
  );
};

const TransformButton: React.FC<{ label: string; onClick: () => void; icon?: React.ReactNode }> = ({ label, onClick, icon }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all active:scale-95"
  >
    {icon}
    {label}
  </button>
);
