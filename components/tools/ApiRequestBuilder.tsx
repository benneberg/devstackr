import React, { useState } from 'react';
import { Globe, Play, Plus, Trash2, Copy, Check, Code, Terminal, FileJson } from 'lucide-react';

export const ApiRequestBuilder: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleAddHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const handleRemoveHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const headerObj: Record<string, string> = {};
    headers.forEach(h => {
      if (h.key.trim()) headerObj[h.key] = h.value;
    });

    try {
      const options: RequestInit = {
        method,
        headers: headerObj,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const data = await res.json().catch(() => null);
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: data || 'No JSON response'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const generateCode = (lang: 'fetch' | 'axios' | 'curl') => {
    const headerObj: Record<string, string> = {};
    headers.forEach(h => {
      if (h.key.trim()) headerObj[h.key] = h.value;
    });

    if (lang === 'fetch') {
      return `fetch('${url}', {
  method: '${method}',
  headers: ${JSON.stringify(headerObj, null, 2)},
  ${['POST', 'PUT', 'PATCH'].includes(method) ? `body: JSON.stringify(${body || '{}'})` : ''}
}).then(res => res.json())
  .then(console.log);`;
    }

    if (lang === 'axios') {
      return `axios({
  method: '${method.toLowerCase()}',
  url: '${url}',
  headers: ${JSON.stringify(headerObj, null, 2)},
  ${['POST', 'PUT', 'PATCH'].includes(method) ? `data: ${body || '{}'}` : ''}
}).then(res => console.log(res.data));`;
    }

    if (lang === 'curl') {
      let curl = `curl -X ${method} "${url}"`;
      Object.entries(headerObj).forEach(([k, v]) => {
        curl += ` \\\n  -H "${k}: ${v}"`;
      });
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        curl += ` \\\n  -d '${body}'`;
      }
      return curl;
    }
    return '';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <select 
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input 
            type="text" 
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm font-mono text-sm"
            placeholder="Enter API URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button 
          onClick={sendRequest}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={18} fill="currentColor" />}
          Send
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Headers</span>
              </div>
              <button 
                onClick={handleAddHeader}
                className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1"
              >
                <Plus size={14} /> Add Header
              </button>
            </div>
            <div className="p-4 space-y-2">
              {headers.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Key" 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-500"
                    value={h.key}
                    onChange={(e) => handleHeaderChange(i, 'key', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Value" 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-500"
                    value={h.value}
                    onChange={(e) => handleHeaderChange(i, 'value', e.target.value)}
                  />
                  <button 
                    onClick={() => handleRemoveHeader(i)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                <FileJson size={16} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Body (JSON)</span>
              </div>
              <textarea 
                className="w-full h-48 p-4 font-mono text-sm focus:outline-none"
                placeholder='{"key": "value"}'
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-2">
            <button 
              onClick={() => setShowCode(!showCode)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Code size={18} />
              {showCode ? 'Hide Code Snippets' : 'Generate Code Snippets'}
            </button>
          </div>

          {showCode && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
              {['fetch', 'axios', 'curl'].map((lang: any) => (
                <div key={lang} className="bg-gray-900 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lang}</span>
                    <button 
                      onClick={() => copyToClipboard(generateCode(lang))}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-blue-300 overflow-x-auto">
                    {generateCode(lang)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm min-h-[400px] flex flex-col">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Response</span>
              </div>
              {response && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${response.status >= 200 && response.status < 300 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {response.status} {response.statusText}
                </span>
              )}
            </div>
            <div className="flex-1 p-4 overflow-auto bg-gray-50">
              {error && <p className="text-red-500 font-mono text-sm">{error}</p>}
              {response ? (
                <pre className="text-xs font-mono text-gray-700">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              ) : !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Play size={32} className="mb-2 opacity-20" />
                  <p className="text-sm">Send a request to see the response</p>
                </div>
              )}
              {loading && (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
