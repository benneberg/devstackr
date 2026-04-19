import React, { useState } from 'react';
import { Code2, Play, Copy, Check } from 'lucide-react';
import * as ts from 'typescript';

const TsAstExplorer: React.FC = () => {
  const [code, setCode] = useState<string>('const x: number = 10;');
  const [ast, setAst] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const exploreAst = () => {
    try {
      const sourceFile = ts.createSourceFile(
        'test.ts',
        code,
        ts.ScriptTarget.Latest,
        true
      );

      // Simple recursive function to make AST readable
      const simplifyAst = (node: ts.Node): any => {
        const result: any = {
          kind: ts.SyntaxKind[node.kind],
        };

        const children: any[] = [];
        ts.forEachChild(node, (child) => {
          children.push(simplifyAst(child));
        });

        if (children.length > 0) {
          result.children = children;
        }

        // Add some properties for specific kinds
        if (ts.isIdentifier(node)) {
          result.name = node.text;
        } else if (ts.isLiteralExpression(node)) {
          result.text = node.text;
        }

        return result;
      };

      const simplified = simplifyAst(sourceFile);
      setAst(JSON.stringify(simplified, null, 2));
    } catch (error) {
      setAst('Error parsing AST: ' + (error as Error).message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ast);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">TypeScript Code</label>
            <button
              onClick={exploreAst}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
            >
              <Play size={16} />
              Explore AST
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-blue-100 rounded-2xl border border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-inner"
            placeholder="Enter TypeScript code here..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">AST Tree (JSON)</label>
            {ast && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            )}
          </div>
          <div className="w-full h-96 p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-2xl border border-gray-200 overflow-auto shadow-inner">
            {ast ? (
              <pre>{ast}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <Code2 size={48} strokeWidth={1} />
                <p>Click "Explore AST" to see the tree</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TsAstExplorer;
