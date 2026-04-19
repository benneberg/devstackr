import React, { useState } from 'react';
import * as diff from 'diff';
import { Split } from 'lucide-react';

export const DiffCheckerWidget: React.FC = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');

  const diffResult = diff.diffLines(oldText, newText);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Diff</span>
        <Split size={14} className="text-gray-400" />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <textarea 
          value={oldText}
          onChange={(e) => setOldText(e.target.value)}
          placeholder="Old"
          className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
        <textarea 
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="New"
          className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      <div className="max-h-32 overflow-auto bg-gray-900 rounded-lg p-3 font-mono text-[10px] leading-tight">
        {diffResult.map((part, index) => (
          <span
            key={index}
            className={`${
              part.added ? 'bg-emerald-900/50 text-emerald-300' : 
              part.removed ? 'bg-red-900/50 text-red-300 line-through' : 
              'text-gray-400'
            }`}
          >
            {part.value}
          </span>
        ))}
        {(!oldText && !newText) && <p className="text-gray-600 italic">Enter text to compare...</p>}
      </div>
    </div>
  );
};
