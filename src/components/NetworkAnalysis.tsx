import React, { useState, useMemo } from 'react';
import { generateCriminalNetwork } from '../data/mockCrimeData';
import { FIRRecord, CriminalNode } from '../types/crime';
import { GitFork, Users, Network, Link, ShieldAlert, Layers, PhoneCall, ShieldCheck, Activity } from 'lucide-react';

interface NetworkAnalysisProps {
  data: FIRRecord[];
}

interface SyndicateHotspot {
  id: string;
  district: string;
  policeStation: string;
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  riskScore: number;
  kingpin: string;
  members: string[];
  primaryCrime: string;
  cdrCallLogs: number;
  patrolRecommendation: string;
}

export const NetworkAnalysis: React.FC<NetworkAnalysisProps> = ({ data }) => {
  const [minConnections, setMinConnections] = useState(2);
  const [selectedNode, setSelectedNode] = useState<CriminalNode | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'ELEVATED'>('ALL');

  const allNodes = useMemo(() => generateCriminalNetwork(), []);

  const filteredNodes = useMemo(() => {
    return allNodes.filter(n => n.connections.length >= minConnections);
  }, [allNodes, minConnections]);

  const kingpinCount = useMemo(() => {
    return allNodes.filter(n => n.isKingpin).length;
  }, [allNodes]);

  // Key gang syndicates across Karnataka police jurisdictions dynamically built from nodes
  const syndicateHotspots: SyndicateHotspot[] = useMemo(() => {
    const kingpins = allNodes.filter(n => n.isKingpin);
    return kingpins.map((k, idx) => {
      const riskScore = (k.centralityScore * 10).toFixed(1);
      const riskNum = Number(riskScore);
      let severity: 'CRITICAL' | 'HIGH' | 'ELEVATED' = 'ELEVATED';
      if (riskNum > 8.5) severity = 'CRITICAL';
      else if (riskNum > 7.5) severity = 'HIGH';
      
      return {
        id: `hotspot-${idx}`,
        district: 'Karnataka District', // Ideally from actual station mapping
        policeStation: k.policeStation,
        severity,
        riskScore: riskNum,
        kingpin: k.id,
        members: k.connections,
        primaryCrime: k.crimeTypes.join(', '),
        cdrCallLogs: k.connections.length * 5,
        patrolRecommendation: `Increase patrol frequency around ${k.policeStation} targeting ${k.crimeTypes[0]} syndicates.`
      };
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [allNodes]);

  const filteredHotspots = useMemo(() => {
    if (severityFilter === 'ALL') return syndicateHotspots;
    return syndicateHotspots.filter(h => h.severity === severityFilter);
  }, [syndicateHotspots, severityFilter]);

  return (
    <div className="space-y-6">
      {/* Top Controls Banner */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GitFork className="w-5 h-5 text-indigo-400" />
            <span>Criminal Connections & Suspect Link Graph</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic syndicate tracking, co-accused links, call detail record (CDR) intercepts, and criminal network centrality topology.
          </p>
        </div>

        {/* Connection Slider */}
        <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-300 font-medium">Minimum Shared Links:</span>
          <input
            type="range"
            min="1"
            max="4"
            value={minConnections}
            onChange={(e) => setMinConnections(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer w-24"
          />
          <span className="font-bold text-amber-400 font-mono text-sm w-4">{minConnections}</span>
        </div>
      </div>

      {/* THREAT LEVEL FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSeverityFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
            severityFilter === 'ALL' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          All Gang Corridors ({syndicateHotspots.length})
        </button>
        <button
          onClick={() => setSeverityFilter('CRITICAL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border flex items-center gap-1.5 ${
            severityFilter === 'CRITICAL' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-rose-400 border-slate-800 hover:bg-rose-950'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
          Critical Gang Corridors (Risk &gt; 8.5)
        </button>
        <button
          onClick={() => setSeverityFilter('HIGH')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border flex items-center gap-1.5 ${
            severityFilter === 'HIGH' ? 'bg-amber-600 text-slate-950 border-amber-500' : 'bg-slate-900 text-amber-400 border-slate-800 hover:bg-amber-950'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          High Risk Sectors (Risk 7.5-8.5)
        </button>
        <button
          onClick={() => setSeverityFilter('ELEVATED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border flex items-center gap-1.5 ${
            severityFilter === 'ELEVATED' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-emerald-400 border-slate-800 hover:bg-emerald-950'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Monitored Patrol Zones (Risk &lt; 7.5)
        </button>
      </div>

      {/* ACTIVE GANG CORRIDOR INTELLIGENCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredHotspots.map((h) => (
          <div
            key={h.id}
            className={`p-4 rounded-xl border transition space-y-2 shadow-sm ${
              h.severity === 'CRITICAL' ? 'bg-rose-950/70 border-rose-500' :
              h.severity === 'HIGH' ? 'bg-amber-950/70 border-amber-500' :
              'bg-emerald-950/70 border-emerald-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-white">{h.district}</h4>
                <p className="text-[11px] text-slate-300">{h.policeStation}</p>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border ${
                h.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-700' :
                h.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border-amber-700' :
                'bg-emerald-950 text-emerald-300 border-emerald-700'
              }`}>
                {h.severity} ({h.riskScore}/10)
              </span>
            </div>

            <div className="text-xs space-y-1">
              <p className="text-slate-200">
                <b>Leader:</b> <span className="text-amber-300 font-bold">{h.kingpin}</span>
              </p>
              <p className="text-slate-400 text-[10px] italic line-clamp-1">
                (Members: {h.members.join(', ')})
              </p>
              <p className="text-slate-300">
                <b>Crime Type:</b> {h.primaryCrime}
              </p>
              <p className="text-slate-400 flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-sky-400" />
                <span>CDR Intercepts: <b>{h.cdrCallLogs} calls</b></span>
              </p>
            </div>

            <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800/80 text-[11px]">
              <span className="font-bold text-indigo-300 block mb-0.5">👮 Tactical Action:</span>
              <p className="text-slate-300 leading-snug">{h.patrolRecommendation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GRAPH TOPOLOGY LINK VISUALIZER & EVIDENCE INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Suspect Ranking */}
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-3 flex items-center justify-between">
              <span>Graph Topology Stats</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400">Suspects Analyzed</p>
                <p className="text-2xl font-bold text-white mt-1">{filteredNodes.length}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400">Key Gang Hubs</p>
                <p className="text-2xl font-bold text-rose-400 mt-1">{kingpinCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-3 flex items-center justify-between">
              <span>Most Connected Suspects</span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/50">
                Centrality Rank
              </span>
            </h3>

            <div className="space-y-2">
              {allNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 rounded-lg border transition cursor-pointer flex justify-between items-center ${
                    node.isKingpin
                      ? 'bg-rose-950/50 border-rose-500/40 hover:bg-rose-900/50'
                      : selectedNode?.id === node.id
                      ? 'bg-indigo-950 border-indigo-500'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white">{node.name}</span>
                      {node.isKingpin && (
                        <span className="text-[9px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                          GANG HUB
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{node.policeStation} | {node.crimeTypes.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      Score: {node.centralityScore}
                    </span>
                    <p className="text-[10px] text-slate-400">{node.connections.length} Links</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive Suspect Network Graph & Evidence Drawer */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-md flex flex-col justify-between min-h-[460px]">
          <div className="flex justify-between items-center text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
            <span className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Network className="w-4 h-4 text-indigo-400" /> Interactive Suspect Link Topology Graph
            </span>
            <span>Click any suspect circle below to inspect evidence & CDR co-locations</span>
          </div>

          <div className="my-6 flex flex-wrap items-center justify-center gap-6 p-4">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const linkCount = node.connections.length;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`rounded-full border-2 transition-all cursor-pointer shadow flex flex-col items-center justify-center text-center ${
                    node.isKingpin
                      ? 'w-24 h-24 bg-rose-950 border-rose-500 text-white font-bold ring-2 ring-rose-500/30'
                      : isSelected
                      ? 'w-22 h-22 bg-indigo-700 border-amber-300 text-white'
                      : linkCount >= 3
                      ? 'w-20 h-20 bg-slate-900 border-indigo-500/60 hover:border-amber-400 text-slate-200'
                      : 'w-18 h-18 bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold leading-tight">{node.id}</span>
                  <span className="text-[10px] opacity-80 mt-0.5">{linkCount} {linkCount === 1 ? 'Link' : 'Links'}</span>
                </div>
              );
            })}
          </div>

          {selectedNode ? (
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div>
                  <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" /> {selectedNode.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Jurisdiction: <b>{selectedNode.policeStation}</b> | Offenses: <b>{selectedNode.crimeTypes.join(', ')}</b>
                  </p>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white font-bold">✕ Close</button>
              </div>

              <div>
                <h5 className="font-bold text-indigo-300 text-xs mb-2 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5" /> Connection Evidence Breakdown:
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] text-slate-300 bg-slate-950 rounded border border-slate-800">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[9px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-2">Connected Associate</th>
                        <th className="p-2">Evidence Type</th>
                        <th className="p-2">Investigation Details</th>
                        <th className="p-2 text-right">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {selectedNode.connectionEvidence ? (
                        selectedNode.connectionEvidence.map((ev, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/60">
                            <td className="p-2 font-bold text-amber-400 font-sans">{ev.associateName}</td>
                            <td className="p-2 text-indigo-300 font-sans">{ev.evidenceType}</td>
                            <td className="p-2 text-slate-300 font-sans">{ev.details}</td>
                            <td className="p-2 text-right font-bold text-emerald-400">{ev.confidenceRating}</td>
                          </tr>
                        ))
                      ) : (
                        selectedNode.connections.map((assoc, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-bold text-amber-400">{assoc}</td>
                            <td className="p-2 text-indigo-300">Co-Accused FIR</td>
                            <td className="p-2 text-slate-300">Co-located at {selectedNode.policeStation} jurisdiction</td>
                            <td className="p-2 text-right font-bold text-emerald-400">92% High</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 p-3 rounded-lg text-center text-xs text-slate-400 border border-slate-800">
              Click any suspect node circle (such as <b>Accused_12</b>) above to inspect connection evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
