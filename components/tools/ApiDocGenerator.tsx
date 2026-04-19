import React, { useState } from 'react';
import { BookOpen, Play, Copy, Check, FileText } from 'lucide-react';

const ApiDocGenerator: React.FC = () => {
  const [spec, setSpec] = useState<string>('openapi: 3.0.0\ninfo:\n  title: User API\n  version: 1.0.0\npaths:\n  /users:\n    get:\n      summary: List users\n      responses:\n        "200":\n          description: Success');
  const [docs, setDocs] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateDocs = () => {
    // Mock documentation generation logic
    const generated = `# User API Documentation
Version: 1.0.0

## Endpoints

### GET /users
List all users in the system.

**Responses:**
- **200 OK**: Success. Returns an array of user objects.

**Example Request:**
\`\`\`bash
curl -X GET https://api.example.com/users
\`\`\`

**Example Response:**
\`\`\`json
[
  { "id": 1, "name": "John Doe" }
]
\`\`\``;
    setDocs(generated);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(docs);
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
              onClick={generateDocs}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
            >
              <Play size={16} />
              Generate Documentation
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
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Generated Documentation</label>
            {docs && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Markdown'}
              </button>
            )}
          </div>
          <div className="w-full h-96 p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-2xl border border-gray-200 overflow-auto shadow-inner">
            {docs ? (
              <pre className="whitespace-pre-wrap">{docs}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <FileText size={48} strokeWidth={1} />
                <p>Click "Generate Documentation" to see the result</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocGenerator;
