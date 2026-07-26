import React from 'react';
import { Role } from '../types/crime';
import { Lock, FileCheck, Building2, User, PlusCircle } from 'lucide-react';
import { KARNATAKA_EMBLEM_BASE64 } from '../assets/logoBase64';

interface HeaderProps {
  role: Role;
  setRole: (role: Role) => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ role, setRole, onOpenAddModal }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md sticky top-0 z-50">
      {/* Top Banner Bar */}
      <div className="bg-slate-950 px-6 py-1.5 flex flex-wrap justify-between items-center text-xs text-slate-300 border-b border-slate-800/80">
        <div className="flex items-center gap-3 font-medium">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold tracking-wide">
            <Building2 className="w-3.5 h-3.5" /> GOVERNMENT OF KARNATAKA | STATE CRIME RECORDS BUREAU
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Police Network: Active (1,100+ Police Stations)
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-cyan-400" /> Encrypted System
          </span>
          <span className="flex items-center gap-1.5">
            <FileCheck className="w-3 h-3 text-indigo-400" /> Audit Log Active
          </span>
        </div>
      </div>

      {/* Main Header Branding with Official Government of Karnataka Emblem Image */}
      <div className="px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          {/* OFFICIAL GOVERNMENT OF KARNATAKA EMBLEM IMAGE */}
          <div className="w-14 h-14 bg-slate-950/80 rounded-lg p-1 border border-amber-400/40 shadow-md flex items-center justify-center shrink-0">
            <img 
              src={KARNATAKA_EMBLEM_BASE64} 
              alt="Government of Karnataka State Emblem" 
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white font-sans">
                Karnataka State Police
              </h1>
              <span className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded border border-amber-500/40">
                SCRB IntelliCrime Platform
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              State Crime Records Bureau — Conversational AI, Link Analysis & Spatio-Temporal Analytics
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Register New FIR Button */}
          <button
            onClick={onOpenAddModal}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" /> Register New FIR Record
          </button>

          {/* Access Role Selector */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg shadow-inner">
            <User className="w-4 h-4 text-amber-400" />
            <label className="text-xs text-slate-300 font-medium">Access Level:</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="bg-slate-900 border border-slate-700 text-amber-300 text-xs font-semibold rounded px-2 py-0.5 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="Constable">Police Constable</option>
              <option value="Station Inspector">Station Inspector</option>
              <option value="District SP">District Superintendent (SP)</option>
              <option value="State DGP">Director General of Police (DGP)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
