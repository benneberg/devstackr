import React, { useState } from 'react';
import { Network, Play, Copy, Check, Share2 } from 'lucide-react';

const GraphqlVisualizer: React.FC = () => {
  const [schema, setSchema] = useState<string>('type User {\n  id: ID!\n  username: String!\n  email: String!\n  posts: [Post!]!\n}\n\ntype Post {\n  id: ID!\n  title: String!\n  content: String!\n  author: User!\n}');
  const [visualData, setVisualData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const visualizeSchema = () => {
    // Mock visualization logic
    const nodes = [
      { id: 'User', type: 'object', fields: ['id', 'username', 'email', 'posts'] },
      { id: 'Post', type: 'object', fields: ['id', 'title', 'content', 'author'] }
    ];
    const edges = [
      { from: 'User', to: 'Post', label: 'posts', relationship: 'one-to-many' },
      { from: 'Post', to: 'User', label: 'author', relationship: 'many-to-one' }
    ];
    setVisualData({ nodes, edges });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(visualData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">GraphQL SDL Schema</label>
            <button
              onClick={visualizeSchema}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
            >
              <Play size={16} />
              Visualize Schema
            </button>
          </div>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-blue-100 rounded-2xl border border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-inner"
            placeholder="Enter GraphQL schema here..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Schema Visualization</label>
            {visualData && (
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
            {visualData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {visualData.nodes.map((node: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">{node.id}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{node.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {node.fields.map((field: string, fidx: number) => (
                          <div key={fidx} className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            {field}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-400 uppercase">Relationships</div>
                  {visualData.edges.map((edge: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="flex-1 text-right font-bold text-sm text-gray-700">{edge.from}</div>
                      <div className="flex flex-col items-center gap-1">
                        <Share2 size={16} className="text-blue-400 rotate-90" />
                        <span className="text-[10px] font-mono text-gray-400 uppercase">{edge.label}</span>
                      </div>
                      <div className="flex-1 font-bold text-sm text-gray-700">{edge.to}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <Network size={48} strokeWidth={1} />
                <p>Click "Visualize Schema" to see the graph</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphqlVisualizer;
