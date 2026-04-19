import React from 'react';
import { SuggestedWorkset } from '../../types';
import { TOOLS, PIPELINES } from '../../data/tools';
import { Zap, X, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContextBanner: React.FC<{ 
  suggestion: SuggestedWorkset; 
  onDismiss: () => void 
}> = ({ suggestion, onDismiss }) => {
  const tools = TOOLS.filter(t => suggestion.tools.includes(t.id));
  const relevantPipelines = PIPELINES.filter(p => 
    p.steps.some(step => suggestion.tools.includes(step.toolId))
  );

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 relative overflow-hidden animate-in fade-in slide-in-from-top-4 shadow-sm">
      <div className="absolute top-0 right-0 p-3">
        <button onClick={onDismiss} className="text-blue-300 hover:text-blue-600 transition-colors">
          <X size={18} />
        </button>
      </div>
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm border border-blue-100">
          <Zap size={24} fill="currentColor" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-blue-900 mb-1 flex items-center gap-2">
            Context Detected: {suggestion.title}
          </h3>
          <p className="text-blue-700 text-sm mb-4 max-w-xl leading-relaxed">
            We detected a <span className="font-semibold">{suggestion.trigger}</span> context in your workflow. Here are some optimized tools and pipelines to help you proceed:
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {tools.map(tool => (
                <Link 
                  key={tool.id} 
                  to={`/tools/${tool.id}`}
                  className="group flex items-center gap-2 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 rounded-lg px-4 py-2 text-sm font-medium text-blue-900 transition-all shadow-sm"
                >
                  <span>{tool.name}</span>
                  <ArrowRight size={14} className="text-blue-300 group-hover:text-white" />
                </Link>
              ))}
            </div>

            {relevantPipelines.length > 0 && (
              <div className="pt-4 border-t border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Suggested Pipelines</p>
                <div className="flex flex-wrap gap-3">
                  {relevantPipelines.map(pipeline => (
                    <Link 
                      key={pipeline.id} 
                      to={`/pipelines/${pipeline.id}`}
                      className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-bold transition-all shadow-md shadow-blue-600/20"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>{pipeline.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
