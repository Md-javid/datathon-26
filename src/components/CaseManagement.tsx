import React, { useState, useMemo } from 'react';
import { FIRRecord } from '../types/crime';
import { ClipboardList, Search, Filter, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface CaseManagementProps {
  data: FIRRecord[];
}

export const CaseManagement: React.FC<CaseManagementProps> = ({ data }) => {
  const [searchFir, setSearchFir] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [expandedFir, setExpandedFir] = useState<string | null>(null);

  const cases = useMemo(() => {
    return data.filter((c) => {
      const matchesSearch = c.firId.toLowerCase().includes(searchFir.toLowerCase()) ||
                            c.accusedName.toLowerCase().includes(searchFir.toLowerCase()) ||
                            c.policeStation.toLowerCase().includes(searchFir.toLowerCase());
      
      let matchesPriority = true;
      if (priorityFilter === 'Critical') matchesPriority = c.priorityScore >= 25;
      else if (priorityFilter === 'High') matchesPriority = c.priorityScore >= 18 && c.priorityScore < 25;
      else if (priorityFilter === 'Medium') matchesPriority = c.priorityScore >= 12 && c.priorityScore < 18;
      else if (priorityFilter === 'Low') matchesPriority = c.priorityScore < 12;

      return matchesSearch && matchesPriority;
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }, [data, searchFir, priorityFilter]);

  const getPriorityBadge = (score: number) => {
    if (score >= 25) return <span className="bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-semibold px-2 py-0.5 rounded">Critical Priority</span>;
    if (score >= 18) return <span className="bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-semibold px-2 py-0.5 rounded">High Priority</span>;
    if (score >= 12) return <span className="bg-yellow-950 text-yellow-300 border border-yellow-500/40 text-[10px] font-semibold px-2 py-0.5 rounded">Medium Priority</span>;
    return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">Standard Priority</span>;
  };

  const getActionPlan = (c: FIRRecord) => {
    const plans: string[] = [];
    
    if (c.status === 'Pending') {
      plans.push('• Expedite initial investigation and witness interviews.');
      plans.push(`• Dispatch patrol team to ${c.policeStation} jurisdiction.`);
    } else if (c.status === 'Under Investigation') {
      plans.push(`• Gather CCTV footage near ${c.district} incident location.`);
      plans.push('• Record statements under Section 161 CrPC.');
    } else if (c.status === 'Solved') {
      plans.push('• File formal charge sheet with district magistrate court.');
      plans.push('• Prepare prosecution brief for trial proceedings.');
    }

    if (c.isRepeatOffender) {
      plans.push('• Cross-check suspect contacts with known criminal network links.');
      plans.push('• Escalate to specialized anti-gang unit for monitoring.');
    }
    
    if (c.crimeType.toLowerCase().includes('theft') || c.crimeType.toLowerCase().includes('burglary')) {
      plans.push('• Initiate stolen property recovery protocols.');
    } else if (c.crimeType.toLowerCase().includes('assault') || c.crimeType.toLowerCase().includes('murder') || c.crimeType.toLowerCase().includes('violence')) {
      plans.push('• Secure forensics and medical examination reports immediately.');
    }

    if (plans.length === 0) {
       plans.push('• Monitor case progress and update SCRB database.');
    }

    return plans.slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-400" />
            <span>Open Case Files & Prioritization</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranks open FIR cases based on severity level, prior suspect records, and days under investigation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search FIR ID, Suspect, Station..."
              value={searchFir}
              onChange={(e) => setSearchFir(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-900 text-amber-300 font-medium border-none focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Standard Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case List Table */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-3">
          <span>Showing <b>{cases.length}</b> FIR Records</span>
          <span>Sorted by Investigation Priority Score</span>
        </div>

        <div className="space-y-2">
          {cases.slice(0, 10).map((c) => {
            const isExpanded = expandedFir === c.firId;
            return (
              <div key={c.firId} className="bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden transition">
                <div
                  onClick={() => setExpandedFir(isExpanded ? null : c.firId)}
                  className="p-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 cursor-pointer hover:bg-slate-900/60"
                >
                  <div className="flex items-center gap-3">
                    {getPriorityBadge(c.priorityScore)}
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{c.firId}</span>
                        <span className="text-xs text-indigo-400 font-mono font-normal">({c.ipcSection})</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {c.crimeType} | {c.policeStation} ({c.district})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <p className="text-slate-300 font-medium">{c.accusedName} ({c.gender}, {c.age})</p>
                      <p className="text-slate-500 text-[10px]">{c.date} ({c.timeOfDay})</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      c.status === 'Solved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                      c.status === 'Pending' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                      'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {c.status}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Case Context */}
                {isExpanded && (
                  <div className="bg-slate-900 p-4 border-t border-slate-800 text-xs text-slate-300 space-y-3">
                    <h5 className="font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Case File Details & Suggested Action
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                        <p><strong>Prior Arrest Record:</strong> {c.priorCases} offenses logged.</p>
                        <p><strong>Repeat Offender:</strong> {c.isRepeatOffender ? 'Yes (Repeat offender flag active)' : 'No'}</p>
                        <p><strong>IPC/BNS Section:</strong> {c.ipcSection}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                        <p className="text-indigo-300 font-semibold">Recommended Action Plan:</p>
                        {getActionPlan(c).map((plan, idx) => (
                          <p key={idx}>{plan}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
