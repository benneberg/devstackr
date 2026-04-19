import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, AlertCircle, FileJson, FileText, FileCode, Table } from 'lucide-react';
import yaml from 'js-yaml';
import Papa from 'papaparse';
import { xml2json, json2xml } from 'xml-js';

type Format = 'json' | 'yaml' | 'csv' | 'xml';

export const UniversalDataTransformer: React.FC = () => {
  const [input, setInput] = useState('');
  const [inputFormat, setInputFormat] = useState<Format>('json');
  const [outputFormat, setOutputFormat] = useState<Format>('yaml');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      let parsedData: any;

      // Parse input
      switch (inputFormat) {
        case 'json':
          parsedData = JSON.parse(input);
          break;
        case 'yaml':
          parsedData = yaml.load(input);
          break;
        case 'csv':
          const csvResult = Papa.parse(input, { header: true, dynamicTyping: true });
          if (csvResult.errors.length > 0) {
            throw new Error(`CSV Error: ${csvResult.errors[0].message}`);
          }
          parsedData = csvResult.data;
          break;
        case 'xml':
          const xmlJson = xml2json(input, { compact: true, spaces: 2 });
          parsedData = JSON.parse(xmlJson);
          break;
      }

      // Transform to output
      let transformed: string = '';
      switch (outputFormat) {
        case 'json':
          transformed = JSON.stringify(parsedData, null, 2);
          break;
        case 'yaml':
          transformed = yaml.dump(parsedData);
          break;
        case 'csv':
          const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
          transformed = Papa.unparse(dataArray);
          break;
        case 'xml':
          transformed = json2xml(JSON.stringify(parsedData), { compact: true, spaces: 2 });
          break;
      }

      setOutput(transformed);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  }, [input, inputFormat, outputFormat]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formats: { id: Format; label: string; icon: any }[] = [
    { id: 'json', label: 'JSON', icon: FileJson },
    { id: 'yaml', label: 'YAML', icon: FileCode },
    { id: 'csv', label: 'CSV', icon: Table },
    { id: 'xml', label: 'XML', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Input Format</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setInputFormat(f.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    inputFormat === f.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${inputFormat.toUpperCase()} here...`}
            className="w-full h-80 bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Output Format</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOutputFormat(f.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    outputFormat === f.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative group">
            <textarea
              value={output}
              readOnly
              placeholder="Transformed output will appear here..."
              className="w-full h-80 bg-gray-900 text-gray-100 border border-gray-800 rounded-xl p-4 font-mono text-sm focus:outline-none resize-none"
            />
            {output && (
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="text-sm font-medium">
            <p className="font-bold mb-1">Transformation Error</p>
            <p className="opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <RefreshCw size={20} />
          </div>
          <h3 className="font-bold text-blue-900">Why use Universal Data Transformer?</h3>
        </div>
        <p className="text-sm text-blue-700 leading-relaxed">
          Modern development often requires moving data between different ecosystems. Whether you're converting a legacy XML API to JSON, 
          turning a spreadsheet (CSV) into a configuration file (YAML), or preparing data for a database, this tool handles the heavy lifting 
          with schema inference and robust error handling.
        </p>
      </div>
    </div>
  );
};
