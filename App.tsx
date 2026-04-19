import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { Dashboard } from './pages/Dashboard';
import { ToolCatalog } from './pages/ToolCatalog';
import { ToolDetail } from './pages/ToolDetail';
import { PipelineBuilder } from './pages/PipelineBuilder';
import { Login } from './pages/Login';
import { ToolboxPanel } from './components/toolbox/ToolboxPanel';
import { Terminal, Layout, Search, Settings, LogOut, Box, Menu, X, Code2, Zap } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useUser();
  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500 bg-gray-50">Loading DevTools...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useUser();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isToolboxOpen, setToolboxOpen] = useState(false);

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all text-sm font-medium ${
          isActive 
            ? 'bg-white/10 text-white shadow-sm' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-40 w-64 h-full bg-[#0F1115] border-r border-white/5 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 flex items-center gap-3">
           <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-black shadow-lg shadow-white/10">
             <Code2 size={20} />
           </div>
           <div>
             <span className="font-bold text-xl tracking-tight text-white block leading-none">DevTools</span>
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 block">Engineering v1</span>
           </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <NavItem to="/" icon={Layout} label="Dashboard" />
          <NavItem to="/tools" icon={Search} label="All Tools" />
          <NavItem to="/pipelines" icon={Zap} label="Pipelines" />
          
          <div className="pt-8 pb-3 px-5 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Workspace</div>
          <button 
             onClick={() => { setToolboxOpen(true); setSidebarOpen(false); }}
             className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all text-left text-sm font-medium group"
          >
             <Box size={18} className="group-hover:scale-110 transition-transform" />
             <span>Worksets</span>
          </button>
        </nav>

        <div className="p-6 mt-auto">
           <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-lg">
                    {user?.userId.slice(0, 2).toUpperCase()}
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">Senior Engineer</p>
                    <button onClick={logout} className="text-[10px] text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors font-bold uppercase tracking-wider">
                       <LogOut size={10} /> Sign Out
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-900 p-2 -ml-2">
                  <Menu size={20} />
              </button>
              <div className="hidden md:block text-gray-400 text-sm">v1.0.0</div>
            </div>
            
            <button 
                onClick={() => setToolboxOpen(!isToolboxOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isToolboxOpen 
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
            >
                <Box size={16} />
                <span className="hidden sm:inline">Toolbox</span>
            </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
           <div className="max-w-6xl mx-auto">
             {children}
           </div>
        </div>

        {/* Toolbox Panel Overlay */}
        <ToolboxPanel isOpen={isToolboxOpen} onClose={() => setToolboxOpen(false)} />
      </main>
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <LayoutShell>
             <Routes>
               <Route path="/" element={<Dashboard />} />
               <Route path="/tools" element={<ToolCatalog />} />
               <Route path="/tools/:id" element={<ToolDetail />} />
               <Route path="/pipelines" element={<PipelineBuilder />} />
               <Route path="/pipelines/:id" element={<PipelineBuilder />} />
             </Routes>
          </LayoutShell>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

import { ErrorBoundary } from './components/ui/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <UserProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </UserProvider>
    </ErrorBoundary>
  );
};

export default App;