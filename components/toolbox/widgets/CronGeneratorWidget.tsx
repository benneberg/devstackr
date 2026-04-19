import React, { useState, useEffect } from 'react';
import cronstrue from 'cronstrue';
import { Clock, Info } from 'lucide-react';

export const CronGeneratorWidget: React.FC = () => {
  const [cron, setCron] = useState('0 0 * * *');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    try {
      setExplanation(cronstrue.toString(cron));
    } catch (e) {
      setExplanation('Invalid expression');
    }
  }, [cron]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cron Generator</span>
        <Clock size={14} className="text-gray-400" />
      </div>
      
      <div className="space-y-3">
        <input 
          type="text" 
          value={cron}
          onChange={(e) => setCron(e.target.value)}
          placeholder="* * * * *"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
        />
        
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
          <Info className="text-blue-500 shrink-0 mt-0.5" size={14} />
          <p className="text-[11px] text-blue-700 font-medium leading-tight">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
};
