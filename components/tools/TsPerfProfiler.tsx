import React, { useState } from 'react';
import { Gauge, Play, Copy, Check, BarChart3 } from 'lucide-react';

const TsPerfProfiler: React.FC = () => {
  const [code, setCode] = useState<string>('type DeepTree<T> = T extends any ? { [K in keyof T]: DeepTree<T[K]> } : never;\n\ntype SlowType = DeepTree<{ a: { b: { c: string } } }>;');
  const [report, setReport] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const profilePerformance = () => {
    // Mock performance report
    const generated = {
      compilationTime: "150ms",
      typeCheckingTime: "120ms",
      slowestTypes: [
        { name: "DeepTree", time: "85ms", complexity: "High" },
        { name: "SlowType", time: "35ms", complexity: "Medium" }
      ],
      memoryUsage: "45MB",
      recommendations: [
        "Consider simplifying DeepTree to reduce recursive depth.",
        "Use interface instead of type for large objects."
      ]
    };
    setReport(generated);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">TypeScript Code</label>
            <button
              onClick={profilePerformance}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
            >
              <Play size={16} />
              Profile Performance
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-blue-100 rounded-2xl border border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-inner"
            placeholder="Enter TypeScript code here..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Performance Report</label>
            {report && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            )}
          </div>
          <div className="w-full h-96 p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-2xl border border-gray-200 overflow-auto shadow-inner">
            {report ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Total Time</div>
                    <div className="text-2xl font-bold text-blue-600">{report.compilationTime}</div>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Memory</div>
                    <div className="text-2xl font-bold text-purple-600">{report.memoryUsage}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-400 uppercase">Slowest Types</div>
                  {report.slowestTypes.map((type: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <span className="font-mono text-sm font-bold">{type.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full">{type.complexity}</span>
                        <span className="text-sm font-bold text-gray-700">{type.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-400 uppercase">Recommendations</div>
                  <ul className="space-y-1">
                    {report.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <BarChart3 size={48} strokeWidth={1} />
                <p>Click "Profile Performance" to see report</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TsPerfProfiler;
