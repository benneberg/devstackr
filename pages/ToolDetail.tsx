import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TOOLS } from '../data/tools';
import { useUser } from '../contexts/UserContext';
import { Heart, Share2, ExternalLink, Play, ChevronLeft, ShieldCheck, Zap, Info, Code, FileText, Settings, Layers, CheckCircle2 } from 'lucide-react';
import { getToolComponent } from '../components/ToolRegistry';
import { getToolReadiness } from '../types';
import Markdown from 'react-markdown';

type TabType = 'overview' | 'technical' | 'examples' | 'specs' | 'pipeline';

export const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, toggleFavorite, addToRecent } = useUser();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const toolContainerRef = useRef<HTMLDivElement>(null);

  const tool = TOOLS.find(t => t.id === id);
  const isFavorite = user?.favorites.includes(tool?.id || '');

  useEffect(() => {
    if (!tool) {
        navigate('/tools');
    }
  }, [tool, navigate]);

  if (!tool || !user) return null;

  const ToolComponent = tool.isLocalModule ? getToolComponent(tool.id) : null;

  const handleLaunch = () => {
    addToRecent(tool.id);
    if (tool.embedUrl) {
       window.open(tool.embedUrl, '_blank');
    } else if (tool.isLocalModule && ToolComponent) {
       setIsActive(true);
       setTimeout(() => {
         toolContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }, 100);
    } else {
      window.open(tool.url, '_blank');
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Info size={16} /> },
    { id: 'technical', label: 'Technical', icon: <Settings size={16} /> },
    { id: 'examples', label: 'Examples', icon: <FileText size={16} /> },
  ];

  if (tool.openSpecs) {
    tabs.push({ id: 'specs', label: 'Specs', icon: <Code size={16} /> });
  }

  if (tool.pipeline) {
    tabs.push({ id: 'pipeline', label: 'Pipeline', icon: <Layers size={16} /> });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <Link to="/tools" className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-all group">
           <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Catalog
        </Link>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => toggleFavorite(tool.id)}
             className={`p-3 rounded-2xl border transition-all ${isFavorite ? 'bg-red-50 border-red-100 text-red-500 shadow-lg shadow-red-500/10' : 'bg-white border-gray-100 text-gray-400 hover:text-red-400 hover:border-red-100'}`}
           >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
           </button>
           <button className="p-3 rounded-2xl border border-gray-100 bg-white text-gray-400 hover:text-gray-900 transition-all">
              <Share2 size={20} />
           </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
           <div className="flex items-center gap-3">
             <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
               {tool.category}
             </span>
             {tool.certification?.status && (
                <span className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${
                  tool.certification.status === 'stable' ? 'bg-green-50 text-green-600 border-green-100' :
                  tool.certification.status === 'certified' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-gray-50 text-gray-600 border-gray-100'
                }`}>
                  {tool.certification.status === 'stable' && <ShieldCheck size={12} />}
                  {tool.certification.status}
                </span>
             )}
           </div>
           
           <h1 className="text-6xl font-bold text-gray-900 tracking-tight leading-none">{tool.name}</h1>
           <p className="text-xl text-gray-500 leading-relaxed font-medium">{tool.description}</p>
           
           <div className="flex flex-wrap gap-2 pt-2">
             {tool.tags.map(t => (
               <span key={t} className="px-4 py-1.5 bg-white border border-gray-100 text-gray-400 rounded-xl text-xs font-bold transition-all hover:border-gray-300 hover:text-gray-600 cursor-default">#{t}</span>
             ))}
           </div>
        </div>

        <div className="lg:col-span-5">
           <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                 <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Popularity</div>
                    <div className="text-2xl font-bold text-gray-900">★ {tool.rating} <span className="text-gray-300 font-medium text-sm ml-1">({tool.userCount} uses)</span></div>
                 </div>
                 <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Zap size={24} fill="currentColor" />
                 </div>
              </div>

              <button 
                onClick={handleLaunch}
                className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-[1.5rem] font-bold shadow-xl shadow-gray-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-xl group"
              >
                <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                {isActive ? 'Restart Tool' : 'Launch Tool'}
              </button>

              <div className="flex items-center gap-3 text-xs text-gray-400 font-medium justify-center">
                 <CheckCircle2 size={14} className="text-green-500" /> Runs locally in your browser
              </div>
           </div>
        </div>
      </div>

      {/* Active Tool Workspace */}
      {isActive && ToolComponent ? (
        <div ref={toolContainerRef} className="pt-12 border-t border-gray-100 animate-fade-in">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                 <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500">
                    <Zap size={20} fill="currentColor" />
                 </div>
                 Interactive Workspace
              </h2>
              <button 
                onClick={() => setIsActive(false)} 
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-500 border border-gray-100 rounded-xl hover:border-red-100 transition-all"
              >
                 Close Workspace
              </button>
           </div>
           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-8 md:p-12 min-h-[600px]">
              <ToolComponent />
           </div>
        </div>
      ) : (
        /* Preview / Info Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-gray-100">
            {/* Left Column (Preview & Tabs) */}
            <div className="lg:col-span-8 space-y-10">
                <div 
                   className="bg-gray-50 rounded-[3rem] aspect-video flex items-center justify-center overflow-hidden relative group border border-gray-100 shadow-inner cursor-pointer hover:shadow-2xl transition-all duration-700"
                   onClick={handleLaunch}
                >
                    {tool.isLocalModule ? (
                       <div className="text-center z-10 bg-white p-10 rounded-[2.5rem] shadow-2xl group-hover:scale-105 transition-transform duration-500 border border-gray-50">
                          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">🔧</div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Click to Launch</h3>
                          <p className="text-gray-400 font-medium">Interactive {tool.name} Environment</p>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center text-gray-300 group-hover:text-blue-500 transition-colors">
                           <ExternalLink size={64} className="mb-4 opacity-50" />
                           <span className="font-bold text-sm uppercase tracking-widest">Opens in new tab</span>
                       </div>
                    )}
                </div>

                <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                   <div className="flex border-b border-gray-50 bg-gray-50/30 p-2">
                      {tabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all rounded-2xl ${
                            activeTab === tab.id 
                            ? 'text-white bg-gray-900 shadow-xl shadow-gray-900/10' 
                            : 'text-gray-400 hover:text-gray-900 hover:bg-white'
                          }`}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                   </div>

                   <div className="p-10">
                      {activeTab === 'overview' && (
                        <div className="space-y-10 animate-fade-in">
                           <p className="text-gray-500 leading-relaxed text-xl font-medium">
                             {tool.longDescription}
                           </p>
                           
                           <div className="space-y-6">
                              <h3 className="font-bold text-gray-900 text-[10px] uppercase tracking-[0.2em]">Key Capabilities</h3>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {tool.features.map(feat => (
                                     <li key={feat} className="flex items-center gap-4 text-gray-600 bg-gray-50 p-5 rounded-2xl border border-gray-100 group hover:border-blue-100 transition-all">
                                         <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Zap size={14} fill="currentColor" />
                                         </div>
                                         <span className="font-bold text-sm">{feat}</span>
                                     </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                      )}

                      {activeTab === 'technical' && (
                        <div className="space-y-10 animate-fade-in">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="space-y-6">
                                 <h4 className="font-bold text-gray-900 text-[10px] uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" /> Inputs
                                 </h4>
                                 <div className="space-y-3">
                                    {tool.inputs?.map(input => (
                                      <div key={input.name} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                         <div className="flex justify-between items-center mb-2">
                                            <span className="font-mono text-sm font-bold text-gray-900">{input.name}</span>
                                            <span className="text-[10px] px-2 py-1 bg-white border border-gray-200 text-gray-400 font-bold rounded-lg uppercase tracking-widest">{input.type}</span>
                                         </div>
                                         <p className="text-xs text-gray-500 font-medium leading-relaxed">{input.description}</p>
                                      </div>
                                    )) || <p className="text-sm text-gray-400 italic">No structured inputs defined.</p>}
                                 </div>
                              </div>
                              <div className="space-y-6">
                                 <h4 className="font-bold text-gray-900 text-[10px] uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" /> Outputs
                                 </h4>
                                 {tool.outputs ? (
                                   <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                      <div className="flex justify-between items-center mb-2">
                                         <span className="font-mono text-sm font-bold text-gray-900">Result</span>
                                         <span className="text-[10px] px-2 py-1 bg-white border border-gray-200 text-gray-400 font-bold rounded-lg uppercase tracking-widest">{tool.outputs.type}</span>
                                      </div>
                                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{tool.outputs.description}</p>
                                   </div>
                                 ) : <p className="text-sm text-gray-400 italic">No structured outputs defined.</p>}
                              </div>
                           </div>
                        </div>
                      )}

                      {activeTab === 'examples' && (
                        <div className="space-y-10 animate-fade-in">
                           {tool.example ? (
                             <div className="space-y-8">
                                <div className="space-y-3">
                                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Example Input</h4>
                                   <div className="relative group">
                                      <pre className="p-8 bg-gray-900 text-blue-400 rounded-[2rem] overflow-auto text-sm font-mono leading-relaxed shadow-2xl">
                                         {typeof tool.example.input === 'object' ? JSON.stringify(tool.example.input, null, 2) : tool.example.input}
                                      </pre>
                                      <div className="absolute top-4 right-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">JSON</div>
                                   </div>
                                </div>
                                <div className="space-y-3">
                                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Example Output</h4>
                                   <div className="relative group">
                                      <pre className="p-8 bg-gray-900 text-green-400 rounded-[2rem] overflow-auto text-sm font-mono leading-relaxed shadow-2xl">
                                         {typeof tool.example.output === 'object' ? JSON.stringify(tool.example.output, null, 2) : tool.example.output}
                                      </pre>
                                      <div className="absolute top-4 right-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">JSON</div>
                                   </div>
                                </div>
                             </div>
                           ) : <p className="text-sm text-gray-400 italic">No examples available for this tool.</p>}
                        </div>
                      )}

                      {activeTab === 'specs' && tool.openSpecs && (
                        <div className="animate-fade-in space-y-10">
                           <div className="grid grid-cols-3 gap-6">
                              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Completeness</div>
                                 <div className="text-3xl font-bold text-gray-900">{Math.round(tool.openSpecs.completeness * 100)}%</div>
                              </div>
                              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Stability</div>
                                 <div className="text-3xl font-bold text-gray-900 capitalize">{tool.openSpecs.stability}</div>
                              </div>
                              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Known Issues</div>
                                 <div className="text-3xl font-bold text-red-500">{tool.openSpecs.knownIssues}</div>
                              </div>
                           </div>
                           <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-500 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none">
                              <div className="markdown-body">
                                <Markdown>{tool.openSpecs.content || ''}</Markdown>
                              </div>
                           </div>
                        </div>
                      )}

                      {activeTab === 'pipeline' && tool.pipeline && (
                        <div className="space-y-10 animate-fade-in">
                           <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center gap-6">
                              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                                 <Layers size={32} />
                              </div>
                              <div>
                                 <h4 className="text-xl font-bold text-blue-900 mb-1">Pipeline Compatible</h4>
                                 <p className="text-blue-700 font-medium">This tool is fully integrated with our automated data pipeline system.</p>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Accepts</div>
                                 <div className="flex flex-wrap gap-2">
                                    {tool.pipeline.accepts.map(type => (
                                      <span key={type} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 uppercase tracking-widest">{type}</span>
                                    ))}
                                 </div>
                              </div>
                              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Produces</div>
                                 <div className="flex flex-wrap gap-2">
                                    {tool.pipeline.produces.map(type => (
                                      <span key={type} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 uppercase tracking-widest">{type}</span>
                                    ))}
                                 </div>
                              </div>
                              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Stateless</div>
                                 <div className="text-2xl font-bold text-gray-900">{tool.pipeline.stateless ? 'Yes' : 'No'}</div>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
            </div>

            {/* Right Column (Meta) */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                    <h3 className="font-bold text-gray-900 text-[10px] uppercase tracking-[0.2em]">Readiness Profile</h3>
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Pipeline Confidence</span>
                                <span className="text-gray-900">{Math.round(getToolReadiness(tool).pipelineConfidence * 100)}%</span>
                            </div>
                            <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${getToolReadiness(tool).pipelineConfidence >= 0.7 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                    style={{ width: `${getToolReadiness(tool).pipelineConfidence * 100}%` }}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Reliability Score</span>
                                <span className="text-gray-900">{Math.round(getToolReadiness(tool).reliability * 100)}%</span>
                            </div>
                            <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-600 transition-all duration-1000"
                                    style={{ width: `${getToolReadiness(tool).reliability * 100}%` }}
                                />
                            </div>
                        </div>
                        
                        <div className="pt-4 grid grid-cols-2 gap-4">
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Coverage</div>
                                <div className="text-2xl font-bold text-gray-900">{Math.round(getToolReadiness(tool).testCoverage)}%</div>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Complete</div>
                                <div className="text-2xl font-bold text-gray-900">{Math.round(getToolReadiness(tool).completeness)}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                    <h3 className="font-bold text-gray-900 text-[10px] uppercase tracking-[0.2em]">Metadata</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Type</span>
                            <span className="font-bold text-gray-900 capitalize text-sm">{tool.category}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">License</span>
                            <span className="font-bold text-gray-900 text-sm">MIT</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Version</span>
                            <span className="font-bold text-gray-900 text-sm">v1.2.0</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Last Update</span>
                            <span className="font-bold text-gray-900 text-sm">2 days ago</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform duration-700">
                       <ShieldCheck size={160} />
                    </div>
                    <div className="relative z-10">
                       <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                              <ShieldCheck className="text-blue-400" size={20} />
                           </div>
                           <h3 className="font-bold text-lg">Verified Tool</h3>
                       </div>
                       <p className="text-sm text-gray-400 leading-relaxed font-medium">
                           This tool runs entirely in your browser. No data is sent to external servers, ensuring maximum privacy and security for your sensitive information.
                       </p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};