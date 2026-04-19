import React, { useState, useEffect } from 'react';
import { Database, Trash2, RefreshCw, Plus, Search, ChevronRight, ChevronDown, FileCode, HardDrive } from 'lucide-react';

interface StorageItem {
  key: string;
  value: string;
  type: 'localStorage' | 'indexedDB';
  dbName?: string;
  storeName?: string;
}

export const AdvancedStorageManager: React.FC = () => {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'localStorage' | 'indexedDB'>('localStorage');

  const refreshStorage = async () => {
    setIsRefreshing(true);
    const newItems: StorageItem[] = [];

    // LocalStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        newItems.push({
          key,
          value: localStorage.getItem(key) || '',
          type: 'localStorage'
        });
      }
    }

    // IndexedDB (Basic discovery)
    try {
      if (window.indexedDB.databases) {
        const dbs = await window.indexedDB.databases();
        for (const dbInfo of dbs) {
          if (dbInfo.name) {
            newItems.push({
              key: dbInfo.name,
              value: `Version: ${dbInfo.version}`,
              type: 'indexedDB',
              dbName: dbInfo.name
            });
          }
        }
      }
    } catch (e) {
      console.error('Failed to list IndexedDB databases', e);
    }

    setItems(newItems);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    refreshStorage();
  }, []);

  const deleteItem = (item: StorageItem) => {
    if (item.type === 'localStorage') {
      localStorage.removeItem(item.key);
    } else if (item.type === 'indexedDB' && item.dbName) {
      window.indexedDB.deleteDatabase(item.dbName);
    }
    refreshStorage();
    if (selectedItem?.key === item.key) setSelectedItem(null);
  };

  const clearAll = () => {
    if (activeTab === 'localStorage') {
      localStorage.clear();
    }
    refreshStorage();
  };

  const filteredItems = items.filter(item => 
    item.type === activeTab &&
    (item.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.value.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Database size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Advanced Storage Manager</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Inspect & Manage Browser State</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={refreshStorage}
            className={`p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
          <button 
            onClick={clearAll}
            className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('localStorage')}
          className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'localStorage' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          LocalStorage
        </button>
        <button 
          onClick={() => setActiveTab('indexedDB')}
          className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'indexedDB' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          IndexedDB
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col">
          <div className="p-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search keys..." 
                className="w-full pl-9 pr-3 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm italic">No items found</div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-3 rounded-xl transition-all group flex items-center justify-between ${selectedItem?.key === item.key ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {item.type === 'localStorage' ? <FileCode size={16} className="shrink-0" /> : <HardDrive size={16} className="shrink-0" />}
                    <span className="text-sm font-semibold truncate">{item.key}</span>
                  </div>
                  <ChevronRight size={14} className={`shrink-0 transition-transform ${selectedItem?.key === item.key ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-50/30 overflow-y-auto p-6">
          {selectedItem ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedItem.key}</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{selectedItem.type}</p>
                </div>
                <button 
                  onClick={() => deleteItem(selectedItem)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Item"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Value</label>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">
                    {selectedItem.value}
                  </pre>
                </div>
              </div>

              {selectedItem.type === 'localStorage' && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                    <strong>Tip:</strong> You can edit this value directly in your browser's DevTools Application tab for real-time updates.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                <Database size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Select an item to inspect</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Browse your application's local state and databases to debug persistent data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
