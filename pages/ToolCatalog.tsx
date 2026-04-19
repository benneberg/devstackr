import React, { useState, useMemo, useEffect } from 'react';
import { TOOLS } from '../data/tools';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, LayoutGrid, List, SlidersHorizontal, ExternalLink, Heart, Clock, ShieldCheck, Zap, X, ArrowRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
// import { getToolReadiness } from '../types';

export const ToolCatalog: React.FC = () => {
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState<string | null>(filterParam);

  useEffect(() => {
    if (filterParam) {
      setActiveFilter(filterParam);
    } else {
      setActiveFilter(null);
    }
  }, [filterParam]);

  const categories = ['All', ...Array.from(new Set(TOOLS.map(t => t.category)))];

  const filteredTools = useMemo(() => {
    const searchLower = search.toLowerCase();
    let baseTools = TOOLS;

    if (activeFilter === 'favorites' && user) {
      baseTools = TOOLS.filter(t => user.favorites.includes(t.id));
    } else if (activeFilter === 'recent' && user) {
      baseTools = TOOLS.filter(t => user.recentlyUsed.includes(t.id));
    } else if (activeFilter === 'categories') {
      // When in categories mode, we might want to show all tools but grouped, 
      // or just let the user pick a category. For now, we'll just show all tools
      // but keep the category filter visible.
      baseTools = TOOLS;
    }

    return baseTools.filter(tool => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchLower) || 
        tool.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.longDescription.toLowerCase().includes(searchLower);
      
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, activeFilter, user]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setActiveFilter(null);
    setSearchParams({});
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
             <Search size={14} /> Discovery
           </div>
           <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-none mb-4">
             {activeFilter === 'favorites' ? 'Favorite Tools' : activeFilter === 'recent' ? 'Recently Used' : 'Tool Catalog'}
           </h1>
           <p className="text-gray-500 text-lg font-medium max-w-2xl">Explore our comprehensive collection of engineering and development utilities.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
           <button 
             onClick={() => setViewMode('grid')}
             className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
           >
              <LayoutGrid size={20} />
           </button>
           <button 
             onClick={() => setViewMode('list')}
             className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
           >
              <List size={20} />
           </button>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="sticky top-20 z-20 bg-gray-50/80 backdrop-blur-md py-4 -mx-4 px-4 md:-mx-8 md:px-8 border-y border-gray-200/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, tags, or description..." 
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           
           <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/10' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between px-2">
         <div className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-bold">{filteredTools.length}</span> tools
         </div>
         {(search || selectedCategory !== 'All' || activeFilter) && (
           <button 
             onClick={clearFilters}
             className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
           >
             <X size={14} /> Clear Filters
           </button>
         )}
      </div>

      {/* Tools Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map(tool => {
            const isFavorite = user.favorites.includes(tool.id);
            return (
              <Link 
                key={tool.id} 
                to={`/tools/${tool.id}`}
                className="group bg-white border border-gray-100 rounded-[2rem] p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-6">
                   <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-500">
                      <Zap size={28} />
                   </div>
                   <div className={`p-2.5 rounded-xl transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-300'}`}>
                      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                   </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded-lg">
                      {tool.category}
                    </span>
                    {tool.rating >= 4.7 && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        ★ {tool.rating}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">{tool.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-8">
                   {tool.tags.slice(0, 3).map(tag => (
                     <span key={tag} className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">#{tag}</span>
                   ))}
                </div>

                <div className="w-full py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl text-center group-hover:bg-gray-900 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  Open Tool <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTools.map(tool => (
            <Link 
              key={tool.id} 
              to={`/tools/${tool.id}`}
              className="flex items-center gap-6 bg-white border border-gray-100 p-6 rounded-3xl hover:shadow-xl hover:border-blue-100 transition-all group"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Zap size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tool.category}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{tool.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {tool.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] text-gray-400">#{tag}</span>
                  ))}
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredTools.length === 0 && (
        <div className="py-32 text-center">
           <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-gray-300" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">No tools found</h3>
           <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
           <button 
             onClick={clearFilters}
             className="mt-6 px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all"
           >
             Clear all filters
           </button>
        </div>
      )}
    </div>
  );
};
