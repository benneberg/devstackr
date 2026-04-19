import React, { useState } from 'react';
import { FileCode, Copy, Check, Wand2 } from 'lucide-react';

export const ZodSchemaGenerator: React.FC = () => {
  const [json, setJson] = useState('{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com",\n  "isActive": true,\n  "tags": ["dev", "react"]\n}');
  const [schema, setSchema] = useState('');
  const [copied, setCopied] = useState(false);

  const generateZod = () => {
    try {
      const obj = JSON.parse(json);
      let zodStr = 'import { z } from "zod";\n\nexport const schema = z.object({\n';
      
      for (const key in obj) {
        const val = obj[key];
        const type = typeof val;
        let zodType = 'z.any()';
        
        if (val === null) zodType = 'z.null()';
        else if (Array.isArray(val)) zodType = 'z.array(z.any())';
        else if (type === 'string') zodType = 'z.string()';
        else if (type === 'number') zodType = 'z.number()';
        else if (type === 'boolean') zodType = 'z.boolean()';
        else if (type === 'object') zodType = 'z.object({})';
        
        zodStr += `  ${key}: ${zodType},\n`;
      }
      
      zodStr += '});\n\nexport type SchemaType = z.infer<typeof schema>;';
      setSchema(zodStr);
    } catch (e) {
      setSchema('Error: Invalid JSON input');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(schema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Input JSON</label>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="w-full h-80 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={generateZod}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Wand2 size={20} />
            Generate Zod Schema
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Zod Schema (TypeScript)</label>
          <div className="relative">
            <pre className="w-full h-80 p-4 bg-gray-900 text-blue-400 font-mono text-xs overflow-auto rounded-xl border border-gray-800">
              {schema || "// Click generate to see output"}
            </pre>
            {schema && (
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
