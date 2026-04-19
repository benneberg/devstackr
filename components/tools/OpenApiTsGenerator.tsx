import React, { useState } from 'react';
import { Zap, Play, Copy, Check, FileJson } from 'lucide-react';

const OpenApiTsGenerator: React.FC = () => {
  const [spec, setSpec] = useState<string>('openapi: 3.0.0\ninfo:\n  title: Sample API\n  version: 1.0.0\npaths:\n  /users:\n    get:\n      responses:\n        "200":\n          content:\n            application/json:\n              schema:\n                type: array\n                items:\n                  $ref: "#/components/schemas/User"\ncomponents:\n  schemas:\n    User:\n      type: object\n      properties:\n        id:\n          type: integer\n        name:\n          type: string');
  const [clientCode, setClientCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateClient = () => {
    // Mock client generation logic
    const generated = `/**
 * Generated TypeScript API Client
 * Version: 1.0.0
 */

export interface User {
  id: number;
  name: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.example.com') {
    this.baseUrl = baseUrl;
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(\`\${this.baseUrl}/users\`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }
}`;
    setClientCode(generated);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(clientCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">OpenAPI Spec (YAML/JSON)</label>
            <button
              onClick={generateClient}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
            >
              <Play size={16} />
              Generate Client
            </button>
          </div>
          <textarea
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-blue-100 rounded-2xl border border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-inner"
            placeholder="Enter OpenAPI spec here..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Generated TypeScript Client</label>
            {clientCode && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            )}
          </div>
          <div className="w-full h-96 p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-2xl border border-gray-200 overflow-auto shadow-inner">
            {clientCode ? (
              <pre>{clientCode}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <FileJson size={48} strokeWidth={1} />
                <p>Click "Generate Client" to see the code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenApiTsGenerator;
