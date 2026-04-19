import React, { useState } from 'react';
import { Database, Plus, Trash2, Play, Copy, Check, FileCode } from 'lucide-react';

const DbSchemaDesigner: React.FC = () => {
  const [tables, setTables] = useState<any[]>([
    { name: 'users', columns: [{ name: 'id', type: 'integer', primaryKey: true }, { name: 'username', type: 'varchar(50)', primaryKey: false }] }
  ]);
  const [sql, setSql] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateSql = () => {
    const ddl = tables.map(table => {
      const cols = table.columns.map((col: any) => 
        `  ${col.name} ${col.type}${col.primaryKey ? ' PRIMARY KEY' : ''}`
      ).join(',\n');
      return `CREATE TABLE ${table.name} (\n${cols}\n);`;
    }).join('\n\n');
    setSql(ddl);
  };

  const addTable = () => {
    setTables([...tables, { name: 'new_table', columns: [{ name: 'id', type: 'integer', primaryKey: true }] }]);
  };

  const removeTable = (idx: number) => {
    setTables(tables.filter((_, i) => i !== idx));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Database Tables</label>
            <div className="flex items-center gap-2">
              <button
                onClick={addTable}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-bold text-sm"
              >
                <Plus size={16} />
                Add Table
              </button>
              <button
                onClick={generateSql}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
              >
                <Play size={16} />
                Generate SQL
              </button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-auto pr-2">
            {tables.map((table, idx) => (
              <div key={idx} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={table.name}
                    onChange={(e) => {
                      const newTables = [...tables];
                      newTables[idx].name = e.target.value;
                      setTables(newTables);
                    }}
                    className="font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 text-lg"
                  />
                  <button onClick={() => removeTable(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="space-y-2">
                  {table.columns.map((col: any, cidx: number) => (
                    <div key={cidx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={col.name}
                        className="flex-1 text-xs font-mono bg-gray-50 border border-gray-100 rounded px-2 py-1"
                        placeholder="Column name"
                      />
                      <span className="text-[10px] text-gray-400 font-mono uppercase">{col.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Generated SQL DDL</label>
            {sql && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy SQL'}
              </button>
            )}
          </div>
          <div className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-blue-100 rounded-2xl border border-gray-800 overflow-auto shadow-inner">
            {sql ? (
              <pre>{sql}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
                <FileCode size={48} strokeWidth={1} />
                <p>Click "Generate SQL" to see the code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DbSchemaDesigner;
