import React, { useState } from 'react';
import { Github, ExternalLink, Copy, Check, BookOpen, Code, Rocket, ShieldCheck, Layout } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'DevTools' | 'Games' | 'SaaS' | 'Library';
  features: string[];
  structure: string[];
}

const TEMPLATES: Template[] = [
  {
    id: 'devtools-core',
    name: 'Modern DevTools Architecture',
    description: 'A robust foundation for building browser-based developer tools with a focus on modularity and speed.',
    category: 'DevTools',
    features: ['Vite-powered', 'Tailwind CSS', 'Lucide Icons', 'Modular Registry System'],
    structure: ['/src/components/tools', '/src/data/registry.ts', '/src/hooks/useTool.ts']
  },
  {
    id: 'saas-starter',
    name: 'SaaS Dashboard Template',
    description: 'Clean, professional dashboard layout with user management, billing, and analytics views.',
    category: 'SaaS',
    features: ['Authentication Flow', 'Pricing Tables', 'Responsive Sidebar', 'Data Visualization'],
    structure: ['/src/pages/Dashboard', '/src/components/auth', '/src/services/api.ts']
  },
  {
    id: 'game-engine-lite',
    name: '2D Canvas Game Engine',
    description: 'Lightweight boilerplate for 2D games using HTML5 Canvas and a custom game loop.',
    category: 'Games',
    features: ['Game Loop (RAF)', 'Entity Component System', 'Asset Loader', 'Input Handling'],
    structure: ['/src/engine/core.ts', '/src/entities', '/src/assets/loader.ts']
  }
];

export const GithubTemplateLibrary: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedTemplate, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col min-h-[600px]">
      {/* Hero Header */}
      <div className="p-8 bg-gray-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Github size={32} className="text-indigo-400" />
            <h1 className="text-3xl font-bold tracking-tight">Best Practice Templates</h1>
          </div>
          <p className="text-gray-400 max-w-xl text-lg">
            Curated repository structures and boilerplates for high-performance web applications.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-100 bg-gray-50/30 p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Categories</label>
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`w-full text-left p-4 rounded-xl transition-all group ${selectedTemplate.id === t.id ? 'bg-white shadow-md border border-gray-100' : 'hover:bg-white/50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      t.category === 'DevTools' ? 'bg-indigo-100 text-indigo-700' :
                      t.category === 'SaaS' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {t.category}
                    </span>
                    {selectedTemplate.id === t.id && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
                  </div>
                  <h3 className={`font-bold text-sm ${selectedTemplate.id === t.id ? 'text-gray-900' : 'text-gray-600'}`}>
                    {t.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl space-y-10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                <p className="text-gray-500 leading-relaxed">{selectedTemplate.description}</p>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold transition-all"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Schema'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Rocket size={14} /> Key Features
                </h4>
                <ul className="space-y-3">
                  {selectedTemplate.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Layout size={14} /> Recommended Structure
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <ul className="space-y-2 font-mono text-xs text-gray-600">
                    {selectedTemplate.structure.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Code size={12} className="text-indigo-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                  <Github size={18} />
                  Clone Repository
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all">
                  <BookOpen size={18} />
                  Read Documentation
                </button>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
              <ShieldCheck size={20} className="text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Security Best Practice</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  All templates include pre-configured ESLint rules, Prettier settings, and basic CI/CD workflows to ensure code quality from day one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
