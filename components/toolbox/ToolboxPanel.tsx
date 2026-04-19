import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { TOOLS } from '../../data/tools';
import { X, Plus, GripVertical, Box } from 'lucide-react';
import { JsonFormatterWidget } from './widgets/JsonFormatterWidget';
import { UuidGeneratorWidget } from './widgets/UuidGeneratorWidget';
import { ColorPickerWidget } from './widgets/ColorPickerWidget';
import { CronGeneratorWidget } from './widgets/CronGeneratorWidget';
import { DiffCheckerWidget } from './widgets/DiffCheckerWidget';
import { TextTransformerWidget } from './widgets/TextTransformerWidget';
import { TimestampConverterWidget } from './widgets/TimestampConverterWidget';
import { Base64Widget } from './widgets/Base64Widget';
import { QueryStringWidget } from './widgets/QueryStringWidget';
import { AdvancedStorageManager } from '../tools/AdvancedStorageManager';

// Map of widget components
const WIDGET_MAP: Record<string, React.FC<any>> = {
  "JsonFormatterWidget": JsonFormatterWidget,
  "StorageWidget": AdvancedStorageManager, // Reuse the tool as a widget
  "ColorPickerWidget": ColorPickerWidget,
  "UuidGeneratorWidget": UuidGeneratorWidget,
  "CronGeneratorWidget": CronGeneratorWidget,
  "DiffCheckerWidget": DiffCheckerWidget,
  "TextTransformerWidget": TextTransformerWidget,
  "TimestampConverterWidget": TimestampConverterWidget,
  "Base64Widget": Base64Widget,
  "QueryStringWidget": QueryStringWidget,
};

export const ToolboxPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useUser();
  const [isAdding, setIsAdding] = useState(false);

  if (!user || !isOpen) return null;

  const handleAddWidget = async (toolId: string) => {
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return;

    const newWidget = {
      i: `widget-${Date.now()}`,
      toolId: tool.id,
      x: 0, 
      y: 0, 
      w: 4, 
      h: 3,
      state: {}
    };

    await updateUser({
      devToolbox: {
        ...user.devToolbox,
        layout: [...user.devToolbox.layout, newWidget]
      }
    });
    setIsAdding(false);
  };

  const removeWidget = async (i: string) => {
    await updateUser({
      devToolbox: {
        ...user.devToolbox,
        layout: user.devToolbox.layout.filter(w => w.i !== i)
      }
    });
  };

  const updateWidgetState = async (i: string, newState: any) => {
    // In a real app, we debounce this
    const updatedLayout = user.devToolbox.layout.map(w => 
      w.i === i ? { ...w, state: newState } : w
    );
    await updateUser({
      devToolbox: { ...user.devToolbox, layout: updatedLayout }
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
      <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md">
        <div>
           <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
             DevToolbox
           </h2>
           <p className="text-xs text-gray-500">Quick access widgets</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAdding(true)}
            className="p-2 hover:bg-gray-100 rounded-full text-blue-600 transition-colors"
            title="Add Widget"
          >
            <Plus size={20} />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
        {user.devToolbox.layout.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center h-64 text-center px-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
               <Box className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-900 font-medium mb-1">Your toolbox is empty</p>
            <p className="text-sm text-gray-500 mb-4">Add widgets to access quick utilities without leaving your context.</p>
            <button 
                onClick={() => setIsAdding(true)} 
                className="text-sm font-bold text-blue-600 hover:underline"
            >
                Add your first widget
            </button>
          </div>
        )}

        {user.devToolbox.layout.map((widget) => {
          const tool = TOOLS.find(t => t.id === widget.toolId);
          const Component = tool?.widgetComponent ? WIDGET_MAP[tool.widgetComponent] : null;

          return (
            <div key={widget.i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col min-h-[250px] resize-y">
               <div className="bg-gray-50 px-3 py-2 flex justify-between items-center cursor-move border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{tool?.name}</span>
                  </div>
                  <button onClick={() => removeWidget(widget.i)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
               </div>
               <div className="flex-1 p-0 overflow-hidden relative">
                 {Component ? (
                   <div className="absolute inset-0 overflow-auto">
                     <Component 
                        toolId={widget.toolId} 
                        state={widget.state} 
                        onStateChange={(s: any) => updateWidgetState(widget.i, s)} 
                     />
                   </div>
                 ) : (
                   <div className="text-red-500 text-xs p-4">Widget not found</div>
                 )}
               </div>
            </div>
          );
        })}
      </div>

      {isAdding && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-gray-900">Add Widget</h3>
            <button onClick={() => setIsAdding(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>
          <div className="space-y-2 overflow-y-auto">
            {TOOLS.filter(t => t.isWidget).map(tool => (
              <button 
                key={tool.id}
                onClick={() => handleAddWidget(tool.id)}
                className="w-full text-left p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-500 transition-all flex justify-between items-center group shadow-sm"
              >
                <div>
                   <span className="font-bold text-gray-900 block">{tool.name}</span>
                   <span className="text-xs text-gray-500">{tool.description}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Plus size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};