import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ContextBanner } from '../components/dashboard/ContextBanner';
import { TOOLS, PIPELINES } from '../data/tools';
import { Wrench, Heart, Clock, LayoutGrid, ClipboardCheck, Plus, Settings, ExternalLink, X, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, updateUser } = useUser();
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    const checkContext = async () => {
        if (!user || !user.customization.clipboardMonitoring) return;
        const hasActive = user.suggestedWorksets.find(s => s.expiresAt > Date.now() && !s.dismissedAt);
        if (!hasActive) {
           const newSuggestion = {
             id: `ctx-${Date.now()}`,
             title: 'JSON Data',
             trigger: 'json',
             tools: ['json-format', 'jwt-decode'],
             expiresAt: Date.now() + 86400000
           };
           await updateUser({
             suggestedWorksets: [...user.suggestedWorksets, newSuggestion]
           });
        }
    };
    const interval = setInterval(checkContext, 5000);
    return () => clearInterval(interval);
  }, [user, updateUser]);

  if (!user) return null;

  const activeWorkset = user.suggestedWorksets.find(s => s.expiresAt > Date.now() && !s.dismissedAt);
  const recentTools = user.recentlyUsed.map(id => TOOLS.find(t => t.id === id)).filter(Boolean);
  const favoriteTools = user.favorites.map(id => TOOLS.find(t => t.id === id)).filter(Boolean);

  const dismissContext = async () => {
    if (!activeWorkset) return;
    const updated = user.suggestedWorksets.map(s => 
      s.id === activeWorkset.id ? { ...s, dismissedAt: Date.now() } : s
    );
    await updateUser({ suggestedWorksets: updated });
  };

  const enableContext = async () => {
    await updateUser({ customization: { ...user.customization, clipboardMonitoring: true }});
  };

  const toggleClipboardMonitoring = async () => {
    await updateUser({ customization: { ...user.customization, clipboardMonitoring: !user.customization.clipboardMonitoring }});
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
             <LayoutGrid size={14} /> Overview
           </div>
           <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-none mb-4">Dashboard</h1>
           <p className="text-gray-500 text-lg font-medium max-w-2xl">Welcome back. Here is your personalized development workspace and recent activity.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setIsCustomizing(true)}
             className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm active:scale-95"
           >
              <Settings size={18} /> Customize
           </button>
           <Link 
             to="/tools"
             className="px-5 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-gray-900/20 active:scale-95"
           >
              <Plus size={18} /> Add Tool
           </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Total Tools" 
          value={TOOLS.length} 
          icon={<LayoutGrid size={22} />} 
          iconColorClass="text-blue-600 bg-blue-50"
          to="/tools"
        />
        <StatsCard 
          label="Favorites" 
          value={user.favorites.length} 
          icon={<Heart size={22} />} 
          iconColorClass="text-amber-500 bg-amber-50"
          to="/tools?filter=favorites"
        />
        <StatsCard 
          label="Recent" 
          value={user.recentlyUsed.length} 
          icon={<Clock size={22} />} 
          iconColorClass="text-emerald-500 bg-emerald-50"
          to="/tools?filter=recent"
        />
        <StatsCard 
          label="Pipelines" 
          value={PIPELINES.length} 
          icon={<Zap size={22} fill="currentColor" />} 
          iconColorClass="text-purple-500 bg-purple-50"
          to="/pipelines"
        />
      </div>

      {/* Customize Modal */}
      {isCustomizing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Customize Workspace</h2>
              <button onClick={() => setIsCustomizing(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Clipboard Monitoring</h3>
                  <p className="text-sm text-gray-500">Suggest tools based on clipboard content</p>
                </div>
                <button 
                  onClick={toggleClipboardMonitoring}
                  className={`w-12 h-6 rounded-full transition-colors relative ${user.customization.clipboardMonitoring ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${user.customization.clipboardMonitoring ? 'translate-x-6' : ''}`} />
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 leading-relaxed">
                  More customization options coming soon, including theme selection and layout management.
                </p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setIsCustomizing(false)}
                className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Banner */}
      {activeWorkset ? (
        <ContextBanner suggestion={activeWorkset} onDismiss={dismissContext} />
      ) : !user.customization.clipboardMonitoring && (
        <div className="bg-white border border-gray-200 border-dashed rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <ClipboardCheck className="text-gray-400" size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Enable Smart Suggestions?</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md">
                DevTools can check your clipboard for JSON, Colors, or GitHub links to suggest the right tools instantly.
            </p>
            <button 
                onClick={enableContext}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline"
            >
                Enable Context Awareness
            </button>
        </div>
      )}

      {/* Pipelines Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pipeline Templates</h2>
            <Link to="/pipelines" className="text-sm font-medium text-gray-500 hover:text-gray-900">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PIPELINES.map(pipeline => (
                <Link key={pipeline.id} to={`/pipelines/${pipeline.id}`} className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                         <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Zap size={24} fill="currentColor" />
                         </div>
                         <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded-full text-gray-500 uppercase tracking-widest">
                           {pipeline.steps.length} Steps
                         </span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{pipeline.name}</h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">{pipeline.description}</p>
                    <div className="flex items-center gap-2">
                       {pipeline.steps.map((step, i) => (
                         <React.Fragment key={step.id}>
                           <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400" title={step.title}>
                             {i + 1}
                           </div>
                           {i < pipeline.steps.length - 1 && <ArrowRight size={12} className="text-gray-300" />}
                         </React.Fragment>
                       ))}
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* Favorites Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Favorite Tools</h2>
            <Link to="/tools" className="text-sm font-medium text-gray-500 hover:text-gray-900">View All</Link>
        </div>
        {favoriteTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favoriteTools.map(tool => (
                    <Link key={tool.id} to={`/tools/${tool.id}`} className="group block bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                             <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors text-gray-400">
                                <Wrench size={20} />
                             </div>
                             {tool.rating >= 4.5 && (
                               <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                                 ★ {tool.rating}
                               </span>
                             )}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{tool.description}</p>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 w-fit group-hover:bg-gray-50 transition-colors">
                           Open <ExternalLink size={12} className="text-gray-400" />
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="text-gray-400 italic py-12 text-center bg-white border border-gray-200 border-dashed rounded-2xl">
                No favorites yet.
            </div>
        )}
      </section>

      {/* Recent Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recently Used</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
             {recentTools.length > 0 ? recentTools.map(tool => (
                <Link key={tool.id} to={`/tools/${tool.id}`} className="snap-start flex-shrink-0 w-72 bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                       <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                         {tool.category}
                       </span>
                    </div>
                    <div className="mb-4">
                       <h3 className="font-bold text-gray-900 text-lg mb-1">{tool.name}</h3>
                       <p className="text-sm text-gray-500 truncate">{tool.description}</p>
                    </div>
                    <div className="w-full py-2 border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                       Open <ExternalLink size={14} />
                    </div>
                </Link>
             )) : (
                 <span className="text-gray-400 text-sm">No recent history.</span>
             )}
        </div>
      </section>
    </div>
  );
};