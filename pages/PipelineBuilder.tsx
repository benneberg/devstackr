import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PIPELINES, TOOLS } from '../data/tools';
import { Pipeline, PipelineStep, PipelineContext, getToolReadiness } from '../types';
import { runPipeline, validatePipeline } from '../lib/pipelineService';
import { PipelinePlanner } from '../src/services/pipelineService';
import { 
  Play, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Settings2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Zap, 
  Wand2,
  Copy,
  ChevronDown,
  ChevronUp,
  Search,
  Clock,
  Info
} from 'lucide-react';

export const PipelineBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [initialInput, setInitialInput] = useState('');
  const [context, setContext] = useState<PipelineContext | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] });
  
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [diffStepId, setDiffStepId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(TOOLS.map(t => t.category)))];

  useEffect(() => {
    if (pipeline) {
      setValidation(validatePipeline(pipeline));
    }
  }, [pipeline]);

  useEffect(() => {
    if (id) {
      const found = PIPELINES.find(p => p.id === id);
      if (found) {
        setPipeline(JSON.parse(JSON.stringify(found))); // Deep clone
      } else {
        // If not found in templates, maybe it's a custom one (not implemented yet)
        navigate('/tools');
      }
    } else {
      // New empty pipeline
      setPipeline({
        id: `custom-${Date.now()}`,
        name: "New Pipeline",
        description: "Custom workflow built by you.",
        steps: []
      });
    }
  }, [id, navigate]);

  const handleRun = async () => {
    if (!pipeline || pipeline.steps.length === 0) return;
    
    setIsRunning(true);
    setError(null);
    setContext(null);
    
    try {
      const result = await runPipeline(
        pipeline, 
        initialInput,
        (stepId) => setActiveStepId(stepId),
        (stepId, output) => {
          // Optional: update UI as steps complete
        }
      );
      setContext(result);
    } catch (err: any) {
      setError(err.message || "An error occurred during pipeline execution.");
    } finally {
      setIsRunning(false);
      setActiveStepId(null);
    }
  };

  const addStep = (toolId: string) => {
    if (!pipeline) return;
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return;

    const newStep: PipelineStep = {
      id: `step-${Date.now()}`,
      toolId: toolId,
      title: tool.name
    };

    setPipeline({
      ...pipeline,
      steps: [...pipeline.steps, newStep]
    });
    setIsAddingStep(false);
    setSearchTerm('');
  };

  const removeStep = (stepId: string) => {
    if (!pipeline) return;
    setPipeline({
      ...pipeline,
      steps: pipeline.steps.filter(s => s.id !== stepId)
    });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (!pipeline) return;
    const newSteps = [...pipeline.steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setPipeline({ ...pipeline, steps: newSteps });
  };

  const updateStepConfig = (stepId: string, key: string, value: any) => {
    if (!pipeline) return;
    setPipeline({
      ...pipeline,
      steps: pipeline.steps.map(s => s.id === stepId ? {
        ...s,
        config: { ...s.config, [key]: value }
      } : s)
    });
  };

  const handleAutoBuild = async () => {
    if (!initialInput) return;
    
    setIsRunning(true);
    try {
      const capabilities = await PipelinePlanner.decomposeIntent(initialInput);
      const plan = PipelinePlanner.createPlan(capabilities);
      
      if (plan.steps.length > 0) {
        const newPipeline: Pipeline = {
          id: `auto-${Date.now()}`,
          name: "AI Generated Pipeline",
          description: `Capabilities: ${capabilities.join(" → ")}`,
          steps: plan.steps.map((s, i) => ({
            id: `step-${i}-${Date.now()}`,
            toolId: s.tool.id,
            title: s.tool.name
          }))
        };
        setPipeline(newPipeline);
        if (plan.warnings.length > 0) {
          setError(`Pipeline built with warnings: ${plan.warnings.join(" ")}`);
        }
      } else {
        setError("AI could not determine a valid tool sequence for this input.");
      }
    } catch (err: any) {
      setError(`Auto-build failed: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    if (!pipeline) return;
    // Mock save: in a real app, this would go to Firestore
    const savedPipelines = JSON.parse(localStorage.getItem('custom_pipelines') || '[]');
    const existingIndex = savedPipelines.findIndex((p: any) => p.id === pipeline.id);
    
    if (existingIndex >= 0) {
      savedPipelines[existingIndex] = pipeline;
    } else {
      savedPipelines.push(pipeline);
    }
    
    localStorage.setItem('custom_pipelines', JSON.stringify(savedPipelines));
    alert("Pipeline saved locally!");
  };

  if (!pipeline) return null;

  const filteredTools = TOOLS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
           <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
             <Zap size={14} fill="currentColor" /> Pipeline Builder
           </div>
           <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{pipeline.name}</h1>
           <p className="text-gray-500">{pipeline.description}</p>
        </div>
        <div className="flex gap-3">
           {!validation.isValid && (
             <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
               <AlertCircle size={14} />
               {validation.errors.length} Issues
             </div>
           )}
           <button 
             onClick={handleSave}
             className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
             title="Save Pipeline"
           >
              <Copy size={18} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Steps */}
        <div className="lg:col-span-7 space-y-6">
          {/* Initial Input */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <ArrowRight size={18} className="text-blue-600" /> Initial Input
              </h3>
              <button 
                onClick={() => setInitialInput('')}
                className="text-xs text-gray-500 hover:text-red-600 font-medium"
              >
                Clear
              </button>
            </div>
            <textarea 
              className="w-full h-40 p-6 font-mono text-base md:text-sm focus:outline-none resize-none"
              placeholder="Paste your data here (JSON, URL, Text...)"
              value={initialInput}
              onChange={(e) => setInitialInput(e.target.value)}
            />
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 px-2 flex items-center gap-2">
              Pipeline Steps ({pipeline.steps.length})
            </h3>
            
            {pipeline.steps.map((step, index) => {
              const tool = TOOLS.find(t => t.id === step.toolId);
              const isActive = activeStepId === step.id;
              const hasOutput = context?.stepOutputs[step.id];
              
              return (
                <div 
                  key={step.id} 
                  className={`relative bg-white border rounded-2xl transition-all ${
                    isActive ? 'border-blue-500 ring-4 ring-blue-50 shadow-lg' : 'border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{step.title}</h4>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                          {tool?.category}
                        </span>
                        {tool && getToolReadiness(tool).pipelineConfidence < 0.7 && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                            <AlertCircle size={10} /> Low Confidence
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {tool?.description} 
                        {tool && ` • Reliability: ${Math.round(getToolReadiness(tool).reliability * 100)}%`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setExpandedStepId(expandedStepId === step.id ? null : step.id)}
                        className={`p-1.5 rounded-lg transition-colors ${expandedStepId === step.id ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                        title="Step Settings"
                      >
                        <Settings2 size={16} />
                      </button>
                      <button 
                        onClick={() => moveStep(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg disabled:opacity-30"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        onClick={() => moveStep(index, 'down')}
                        disabled={index === pipeline.steps.length - 1}
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg disabled:opacity-30"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button 
                        onClick={() => removeStep(step.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Step Status Indicator */}
                  {isActive && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-blue-500 rounded-r-full animate-pulse" />
                  )}
                  {hasOutput && !isActive && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-green-500 rounded-r-full" />
                  )}

                  {/* Step Settings Panel */}
                  {expandedStepId === step.id && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50/50 rounded-b-2xl animate-in slide-in-from-top-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Step Configuration</h5>
                          <div className="flex gap-2">
                            {tool?.inputTypes.map(type => (
                              <span key={type} className="text-[8px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded uppercase">In: {type}</span>
                            ))}
                            {tool?.outputTypes.map(type => (
                              <span key={type} className="text-[8px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded uppercase">Out: {type}</span>
                            ))}
                          </div>
                        </div>
                        
                        {tool?.parameters && tool.parameters.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tool.parameters.map(param => (
                              <div key={param.id} className="space-y-1">
                                <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                                  {param.name}
                                  {param.description && (
                                    <span className="group relative">
                                      <Info size={10} className="text-gray-400" />
                                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                        {param.description}
                                      </span>
                                    </span>
                                  )}
                                </label>
                                {param.type === 'select' ? (
                                  <select 
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-base md:text-xs focus:outline-none focus:border-blue-400"
                                    value={step.config?.[param.id] ?? param.default}
                                    onChange={(e) => updateStepConfig(step.id, param.id, e.target.value)}
                                  >
                                    {param.options?.map(opt => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                ) : param.type === 'number' ? (
                                  <input 
                                    type="number"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-base md:text-xs focus:outline-none focus:border-blue-400"
                                    value={step.config?.[param.id] ?? param.default}
                                    onChange={(e) => updateStepConfig(step.id, param.id, parseInt(e.target.value))}
                                  />
                                ) : (
                                  <input 
                                    type="text"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-base md:text-xs focus:outline-none focus:border-blue-400"
                                    value={step.config?.[param.id] ?? param.default}
                                    onChange={(e) => updateStepConfig(step.id, param.id, e.target.value)}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">No configurable parameters for this tool.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Step Button */}
            {isAddingStep ? (
              <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-xl animate-in zoom-in-95">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search tools..." 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-blue-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar no-scrollbar">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                          activeCategory === cat 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                  {filteredTools.length > 0 ? (
                    filteredTools.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => addStep(t.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-sm text-gray-900 group-hover:text-blue-700">{t.name}</div>
                          <div className="text-[10px] text-gray-500">{t.category}</div>
                        </div>
                        {!t.run && <span className="text-[8px] text-red-400 font-bold uppercase">No Run</span>}
                      </button>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 text-sm italic">
                      No tools found matching your search.
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setIsAddingStep(false)}
                  className="w-full mt-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={() => setIsAddingStep(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <Plus size={20} /> Add Step
                </button>

                {/* Pipeline Actions - Moved to bottom for better UX */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button 
                    onClick={handleRun}
                    disabled={isRunning || pipeline.steps.length === 0}
                    className="flex-1 px-6 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-900/20 disabled:opacity-50 active:scale-95"
                  >
                    {isRunning ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} fill="currentColor" />}
                    <span className="text-lg">Run Pipeline</span>
                  </button>
                  
                  <button 
                    onClick={handleAutoBuild}
                    disabled={!initialInput}
                    className="px-6 py-4 bg-blue-50 text-blue-700 font-bold rounded-2xl hover:bg-blue-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                  >
                    <Wand2 size={20} />
                    <span className="text-lg">Auto-Build</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col min-h-[600px]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-600" /> Execution Output
              </h3>
              {context && (
                <button 
                  onClick={() => {
                    const lastStep = pipeline.steps[pipeline.steps.length - 1];
                    const output = context.stepOutputs[lastStep.id];
                    navigator.clipboard.writeText(typeof output === 'string' ? output : JSON.stringify(output, null, 2));
                  }}
                  className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
                >
                  <Copy size={12} /> Copy Final
                </button>
              )}
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-gray-900 text-gray-100 font-mono text-sm custom-scrollbar">
              {isRunning ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                  <p className="animate-pulse">Executing pipeline steps...</p>
                </div>
              ) : error ? (
                <div className="flex items-start gap-3 text-red-400">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-1">Execution Failed</p>
                    <p className="text-xs opacity-80">{error}</p>
                  </div>
                </div>
              ) : context ? (
                <div className="space-y-8">
                  {pipeline.steps.map((step, i) => {
                    const output = context.stepOutputs[step.id];
                    const metrics = context.stepMetrics[step.id];
                    if (!output) return null;
                    
                    return (
                      <div key={step.id} className="space-y-2">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              Step {i + 1}: {step.title}
                            </span>
                            {metrics && (
                              <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                <Clock size={10} /> {metrics.duration}ms
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setDiffStepId(diffStepId === step.id ? null : step.id)}
                              className={`text-[10px] font-bold transition-colors ${diffStepId === step.id ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                              {diffStepId === step.id ? 'HIDE DIFF' : 'SHOW DIFF'}
                            </button>
                            <span className="text-[10px] text-green-500 font-bold">SUCCESS</span>
                          </div>
                        </div>
                        
                        {diffStepId === step.id ? (
                          <div className="grid grid-cols-2 gap-4 text-[11px]">
                            <div className="space-y-1">
                              <div className="text-[9px] text-gray-600 font-bold uppercase">Input</div>
                              <pre className="p-2 bg-gray-800/50 rounded border border-gray-800 overflow-x-auto">
                                {i === 0 ? initialInput : context.stepOutputs[pipeline.steps[i-1].id]}
                              </pre>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[9px] text-blue-400 font-bold uppercase">Output</div>
                              <pre className="p-2 bg-blue-900/20 rounded border border-blue-900/30 overflow-x-auto">
                                {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
                              </pre>
                            </div>
                          </div>
                        ) : (
                          <pre className="whitespace-pre-wrap break-all opacity-90">
                            {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
                          </pre>
                        )}
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t border-gray-800 text-center">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">End of Pipeline</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center space-y-4">
                  <Play size={48} className="opacity-20" />
                  <p className="max-w-[200px]">Configure your steps and click "Run Pipeline" to see results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
