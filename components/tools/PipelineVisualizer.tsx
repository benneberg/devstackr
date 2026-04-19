import React, { useState } from 'react';
import { GitBranch, Play, Copy, Check, Share2, Plus, Trash2 } from 'lucide-react';

const PipelineVisualizer: React.FC = () => {
  const [steps, setSteps] = useState<any[]>([
    { id: '1', name: 'Source: API', type: 'source', output: 'json' },
    { id: '2', name: 'Transform: Filter', type: 'transform', input: 'json', output: 'json' },
    { id: '3', name: 'Sink: Database', type: 'sink', input: 'json' }
  ]);
  const [copied, setCopied] = useState(false);

  const addStep = (type: string) => {
    const newStep = {
      id: Math.random().toString(36).substr(2, 9),
      name: `New ${type}`,
      type,
      input: type === 'source' ? null : 'json',
      output: type === 'sink' ? null : 'json'
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(steps, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <GitBranch size={20} className="text-blue-600" />
          Pipeline Definition
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={() => addStep('source')} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-bold">
            <Plus size={16} />
            Add Source
          </button>
          <button onClick={() => addStep('transform')} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-bold">
            <Plus size={16} />
            Add Transform
          </button>
          <button onClick={() => addStep('sink')} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-bold">
            <Plus size={16} />
            Add Sink
          </button>
        </div>
      </div>

      <div className="relative min-h-[400px] bg-gray-50 border border-gray-200 rounded-2xl p-8 overflow-auto flex items-center justify-center gap-12">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className="relative group">
              <div className={`w-48 p-4 bg-white border-2 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                step.type === 'source' ? 'border-green-200' : 
                step.type === 'sink' ? 'border-red-200' : 
                'border-blue-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    step.type === 'source' ? 'bg-green-50 text-green-600' : 
                    step.type === 'sink' ? 'bg-red-50 text-red-600' : 
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {step.type}
                  </span>
                  <button onClick={() => removeStep(step.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={step.name}
                  onChange={(e) => {
                    setSteps(steps.map(s => s.id === step.id ? { ...s, name: e.target.value } : s));
                  }}
                  className="w-full font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 text-sm"
                />
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase">
                  <span>In: {step.input || 'None'}</span>
                  <span>Out: {step.output || 'None'}</span>
                </div>
              </div>
              
              {/* Connection Line */}
              {idx < steps.length - 1 && (
                <div className="absolute top-1/2 -right-12 w-12 h-0.5 bg-gray-200 -translate-y-1/2">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gray-200 rounded-full" />
                </div>
              )}
            </div>
          </React.Fragment>
        ))}

        {steps.length === 0 && (
          <div className="text-center text-gray-400 space-y-2">
            <GitBranch size={48} strokeWidth={1} />
            <p>Add steps to build your pipeline</p>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
          {copied ? 'Copied Pipeline!' : 'Export Pipeline JSON'}
        </button>
      </div>
    </div>
  );
};

export default PipelineVisualizer;
