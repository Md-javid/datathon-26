import React from 'react';

interface ZohoCatalystModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZohoCatalystModal: React.FC<ZohoCatalystModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-2xl w-full p-6 text-slate-200 space-y-5 shadow-2xl relative">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h3 className="text-lg font-bold text-amber-400">Zoho Catalyst Serverless Deployment Architecture</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40 flex justify-between items-center">
            <div>
              <p className="font-bold text-emerald-400">Catalyst Client Web App Hosting</p>
              <p className="text-slate-400 text-[11px]">Vite + React TypeScript Single Page Application (SPA)</p>
            </div>
            <span className="bg-emerald-950 text-emerald-300 font-mono text-[10px] px-2 py-1 rounded font-bold">
              STATUS: DEPLOYED
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/40 space-y-1 font-mono">
            <p className="text-indigo-300 font-bold font-sans">📄 catalyst.json Configuration Snippet:</p>
            <pre className="text-[11px] text-slate-300 overflow-x-auto p-2 bg-slate-900 rounded">
{`{
  "client": {
    "source": "dist",
    "ignore": ["**/.*", "node_modules/**"]
  },
  "functions": [
    {
      "name": "langgraph_agent",
      "type": "python3.11",
      "entry": "main.py"
    }
  ]
}`}
            </pre>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <p className="font-bold text-white">Government Security Features on Catalyst:</p>
            <p>• Role-Based Access Control (RBAC) enforced via Catalyst Authentication.</p>
            <p>• Catalyst Data Store encrypted with AES-256 for FIR audit logging.</p>
            <p>• Compliant with MeitY Cloud Mandates & IT Act 2000 Guidelines.</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition"
          >
            Close Catalyst Panel
          </button>
        </div>
      </div>
    </div>
  );
};
