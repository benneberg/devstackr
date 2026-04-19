import React, { useState } from 'react';
import { Activity, Play, Copy, Check, BarChart3, AlertCircle } from 'lucide-react';

const ApiLoadTester: React.FC = () => {
  const [url, setUrl] = useState<string>('https://api.example.com/v1/users');
  const [requests, setRequests] = useState<number>(100);
  const [concurrency, setConcurrency] = useState<number>(10);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runLoadTest = () => {
    setLoading(true);
    // Mock load test execution
    setTimeout(() => {
      const mockResults = {
        totalRequests: requests,
        successfulRequests: Math.floor(requests * 0.99),
        failedRequests: Math.ceil(requests * 0.01),
        avgLatency: "42ms",
        p95Latency: "115ms",
        p99Latency: "240ms",
        throughput: "150 req/sec",
        errors: [
          { code: 500, count: 1, message: "Internal Server Error" }
        ]
      };
      setResults(mockResults);
      setLoading(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              Test Configuration
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Target URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="https://api.example.com/..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Requests</label>
                <input
                  type="number"
                  value={requests}
                  onChange={(e) => setRequests(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Concurrency</label>
                <input
                  type="number"
                  value={concurrency}
                  onChange={(e) => setConcurrency(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            <button
              onClick={runLoadTest}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Play size={18} />
                  Run Load Test
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-purple-600" />
                Test Results
              </h3>
              {results && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Results'}
                </button>
              )}
            </div>

            {results ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="text-xs font-bold text-blue-400 uppercase mb-1">Avg Latency</div>
                    <div className="text-xl font-bold text-blue-900">{results.avgLatency}</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="text-xs font-bold text-purple-400 uppercase mb-1">Throughput</div>
                    <div className="text-xl font-bold text-purple-900">{results.throughput}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                    <div className="text-xs font-bold text-green-400 uppercase mb-1">Success</div>
                    <div className="text-xl font-bold text-green-900">{results.successfulRequests}</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="text-xs font-bold text-red-400 uppercase mb-1">Failed</div>
                    <div className="text-xl font-bold text-red-900">{results.failedRequests}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Latency Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-gray-500 w-8">P95</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[60%]" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{results.p95Latency}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-gray-500 w-8">P99</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[85%]" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{results.p99Latency}</span>
                    </div>
                  </div>
                </div>

                {results.failedRequests > 0 && (
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="text-orange-600 mt-0.5" size={20} />
                    <div>
                      <div className="text-sm font-bold text-orange-900">Error Summary</div>
                      <div className="text-xs text-orange-700">
                        {results.errors.map((err: any, i: number) => (
                          <div key={i}>{err.count}x HTTP {err.code}: {err.message}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 py-20">
                <Activity size={64} strokeWidth={1} />
                <p>Configure and run a test to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiLoadTester;
