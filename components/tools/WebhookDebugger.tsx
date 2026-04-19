import React, { useState, useEffect } from 'react';
import { Webhook, Play, Copy, Check, Trash2, RefreshCw } from 'lucide-react';

const WebhookDebugger: React.FC = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [webhookUrl, setWebhookUrl] = useState<string>('https://ais-dev.run.app/api/webhook/xyz-123');
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);
    // Mock incoming webhooks
    const timer = setInterval(() => {
      const newWebhook = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Webhook-Tester' },
        payload: { event: 'user.created', data: { id: 1, name: 'John Doe' } }
      };
      setWebhooks(prev => [newWebhook, ...prev].slice(0, 10));
    }, 5000);

    return () => clearInterval(timer);
  };

  const clearWebhooks = () => {
    setWebhooks([]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Webhook size={20} className="text-blue-600" />
              Webhook Endpoint
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Your Debug URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-mono"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsListening(!isListening)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-bold shadow-sm ${
                isListening ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isListening ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Play size={18} />
                  Start Listening
                </>
              )}
            </button>
            
            <button
              onClick={clearWebhooks}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              Clear History
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <RefreshCw size={20} className="text-purple-600" />
              Incoming Payloads
            </h3>

            {webhooks.length > 0 ? (
              <div className="space-y-4">
                {webhooks.map((webhook, idx) => (
                  <div key={webhook.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded uppercase">{webhook.method}</span>
                        <span className="text-xs font-mono text-gray-400">{webhook.timestamp}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-400">ID: {webhook.id}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Headers</div>
                      <div className="text-xs font-mono text-gray-600 bg-white p-2 rounded border border-gray-100">
                        {JSON.stringify(webhook.headers, null, 2)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Payload</div>
                      <div className="text-xs font-mono text-gray-900 bg-white p-2 rounded border border-gray-100">
                        {JSON.stringify(webhook.payload, null, 2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 py-20">
                <Webhook size={64} strokeWidth={1} />
                <p>{isListening ? 'Waiting for incoming webhooks...' : 'Start listening to capture webhooks'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookDebugger;
