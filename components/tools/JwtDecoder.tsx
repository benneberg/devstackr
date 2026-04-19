import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Shield, AlertTriangle, Clock, Key, CheckCircle2 } from 'lucide-react';

export const JwtDecoder: React.FC = () => {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setError(null);
      return;
    }

    try {
      // Decode payload
      const decodedPayload = jwtDecode(token);
      setPayload(decodedPayload);

      // Decode header (manually)
      const parts = token.split('.');
      if (parts.length >= 1) {
        const decodedHeader = JSON.parse(atob(parts[0]));
        setHeader(decodedHeader);
      }
      setError(null);
    } catch (err) {
      setError('Invalid JWT format');
      setHeader(null);
      setPayload(null);
    }
  }, [token]);

  const isExpired = payload?.exp ? Date.now() >= payload.exp * 1000 : false;
  const expirationDate = payload?.exp ? new Date(payload.exp * 1000).toLocaleString() : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Encoded Token</label>
        <textarea
          className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="Paste your JWT here..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      </div>

      {payload && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                <Key size={16} className="text-purple-500" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Header</span>
              </div>
              <pre className="p-4 text-sm font-mono text-gray-700 overflow-auto max-h-64">
                {JSON.stringify(header, null, 2)}
              </pre>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                <Shield size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Payload</span>
              </div>
              <pre className="p-4 text-sm font-mono text-gray-700 overflow-auto max-h-96">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-gray-400" /> Token Status
              </h3>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${isExpired ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  {isExpired ? (
                    <AlertTriangle className="text-red-500 shrink-0" size={20} />
                  ) : (
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                  )}
                  <div>
                    <p className={`font-bold text-sm ${isExpired ? 'text-red-900' : 'text-emerald-900'}`}>
                      {isExpired ? 'Token Expired' : 'Token Active'}
                    </p>
                    <p className={`text-xs ${isExpired ? 'text-red-700' : 'text-emerald-700'}`}>
                      {expirationDate ? `Expires on: ${expirationDate}` : 'No expiration claim found'}
                    </p>
                  </div>
                </div>

                {header?.alg === 'none' && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                    <div>
                      <p className="font-bold text-sm text-amber-900">Security Warning</p>
                      <p className="text-xs text-amber-700">
                        This token uses the "none" algorithm, which is highly insecure and should never be used in production.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Common Claims</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['iss', 'sub', 'aud', 'iat', 'nbf', 'jti'].map(claim => (
                      <div key={claim} className={`p-2 rounded-lg border text-xs flex justify-between items-center ${payload[claim] ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                        <span className="font-mono">{claim}</span>
                        <span>{payload[claim] ? '✓' : '✗'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 leading-relaxed">
                <Shield size={12} className="inline mr-1" />
                This tool runs entirely in your browser. Your token is never sent to any server.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
