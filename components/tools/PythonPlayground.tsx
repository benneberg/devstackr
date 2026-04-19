
import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Terminal, AlertTriangle, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export const PythonPlayground: React.FC = () => {
  const [code, setCode] = useState<string>(`# Write Python code here
def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))
print(f"1 + 1 = {1 + 1}")
`);
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScript = async () => {
      if (window.loadPyodide) {
        initPyodide();
        return;
      }

      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
      script.onload = () => initPyodide();
      script.onerror = () => setError("Failed to load Python runtime.");
      document.body.appendChild(script);
    };

    const initPyodide = async () => {
      try {
        const py = await window.loadPyodide();
        setPyodide(py);
        setIsLoading(false);
        // Redirect stdout
        py.setStdout({ batched: (msg: string) => appendToOutput(msg) });
      } catch (e) {
        setError("Failed to initialize Python environment.");
        setIsLoading(false);
      }
    };

    loadScript();
  }, []);

  const appendToOutput = (text: string) => {
    setOutput((prev) => prev + text + '\n');
  };

  const runCode = async () => {
    if (!pyodide) return;
    setIsRunning(true);
    setOutput(''); // Clear previous output
    setError(null);

    try {
      // Capture standard output
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);
      
      await pyodide.runPythonAsync(code);
      
      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      appendToOutput(stdout);

    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-gray-600" />
          <span className="font-bold text-gray-700 text-sm">main.py</span>
          {isLoading && <span className="text-xs text-gray-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Loading Runtime...</span>}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setOutput('')} 
            className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            title="Clear Output"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            onClick={runCode} 
            disabled={isLoading || isRunning}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              isLoading || isRunning 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
            }`}
          >
            {isRunning ? <Loader2 size={16} className="animate-spin"/> : <Play size={16} fill="currentColor" />}
            Run
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Editor */}
        <div className="flex-1 border-r border-gray-200 relative group">
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full resize-none p-4 font-mono text-sm leading-relaxed text-gray-800 focus:outline-none bg-white"
            spellCheck={false}
          />
          <div className="absolute top-2 right-2 text-xs text-gray-300 pointer-events-none group-hover:text-gray-400 transition-colors">Python 3.11</div>
        </div>

        {/* Output */}
        <div className="flex-1 bg-gray-900 text-gray-100 flex flex-col min-h-[200px] md:min-h-auto">
          <div className="px-4 py-2 bg-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700 flex justify-between">
            <span>Terminal</span>
            {error && <span className="text-red-400 flex items-center gap-1"><AlertTriangle size={12}/> Error</span>}
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto custom-scrollbar">
            {output ? (
              <pre className="whitespace-pre-wrap font-mono">{output}</pre>
            ) : (
              <div className="text-gray-600 italic">Ready to execute. Click Run.</div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border-l-2 border-red-500 text-red-200 text-xs font-mono whitespace-pre-wrap">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
