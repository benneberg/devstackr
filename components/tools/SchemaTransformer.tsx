import React, { useState } from 'react';
import { Replace, Play, Copy, Check, FileJson } from 'lucide-react';

const SchemaTransformer: React.FC = () => {
  const [inputData, setInputData] = useState<string>('{\n  "id": 1,\n  "username": "johndoe",\n  "email": "john@example.com"\n}');
  const [mapping, setMapping] = useState<string>('{\n  "id": "userId",\n  "username": "name",\n  "email": "contactEmail"\n}');
  const [outputData, setOutputData] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const transformData = () => {
    try {
      const input = JSON.parse(inputData);
      const map = JSON.parse(mapping);
      const output: any = {};
      
      Object.keys(map).forEach(key => {
        if (input[key] !== undefined) {
          output[map[key]] = input[key];
        }
      });
      
      setOutputData(JSON.stringify(output, null, 2));
    } catch (error) {
      setOutputData('Error transforming data: ' + (error as Error).message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Input Data (JSON)</label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="w-full h-80 p-4 font-mono text-sm bg-gray-900 text-blue-100 rounded-2xl border border-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-inner"
            placeholder="Enter input JSON here..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Mapping Definition</label>
            <button
              onClick={transformData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
            >
              <Play size={16} />
              Transform
            </button>
          </div>
          <textarea
            value={mapping}
            onChange={(e) => setMapping(e.target.value)}
            className="w-full h-80 p-4 font-mono text-sm bg-gray-900 text-purple-100 rounded-2xl border border-gray-800 focus:ring-2 focus:ring-purple-500 outline-none resize-none shadow-inner"
            placeholder="Enter mapping JSON here..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Transformed Data</label>
            {outputData && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            )}
          </div>
          <div className="w-full h-80 p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-2xl border border-gray-200 overflow-auto shadow-inner">
            {outputData ? (
              <pre>{outputData}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <Replace size={48} strokeWidth={1} />
                <p>Click "Transform" to see the result</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaTransformer;
