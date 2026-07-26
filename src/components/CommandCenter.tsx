import React, { useMemo } from 'react';
import { FIRRecord } from '../types/crime';
import { DISTRICTS } from '../data/mockCrimeData';
import { CRIME_TYPES_LIST } from './Sidebar';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { 
  FileText, CheckCircle2, Clock, Users, AlertTriangle, BarChart2, 
  PieChart as PieIcon, TrendingUp, Filter, RotateCcw, Shield, Award, Activity, Truck
} from 'lucide-react';

interface CommandCenterProps {
  data: FIRRecord[];
  selectedDistrict?: string;
  setSelectedDistrict?: (d: string) => void;
  selectedCrime?: string;
  setSelectedCrime?: (c: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ 
  data, 
  selectedDistrict = 'All Districts',
  setSelectedDistrict,
  selectedCrime = 'All Crimes',
  setSelectedCrime
}) => {
  // Metrics Calculation
  const totalCases = data.length;
  const solvedCount = data.filter(d => d.status === 'Solved').length;
  const clearanceRate = totalCases > 0 ? ((solvedCount / totalCases) * 100).toFixed(1) : '0';
  const pendingCount = data.filter(d => d.status === 'Pending').length;
  const repeatOffenders = data.filter(d => d.isRepeatOffender).length;
  const highSeverityCount = data.filter(d => d.severity >= 8).length;

  // Monthly Trend Data
  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(d => {
      map[d.month] = (map[d.month] || 0) + 1;
    });
    return Object.keys(map).sort().map(month => ({ month, count: map[month] }));
  }, [data]);

  // Crime Type Pie Chart Data
  const crimeTypeData = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(d => {
      map[d.crimeType] = (map[d.crimeType] || 0) + 1;
    });
    const colors = ['#6366f1', '#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#a855f7', '#fb7185', '#10b981', '#f97316', '#64748b'];
    return Object.keys(map).map((type, index) => ({
      name: type,
      value: map[type],
      color: colors[index % colors.length]
    })).sort((a, b) => b.value - a.value);
  }, [data]);

  // District Comparison Bar Chart Data (Top Districts by Crime Volume)
  const districtComparisonData = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(d => {
      map[d.district] = (map[d.district] || 0) + 1;
    });
    return Object.keys(map)
      .map(district => ({ district, cases: map[district] }))
      .sort((a, b) => b.cases - a.cases)
      .slice(0, 10);
  }, [data]);

  // Hourly Peak Clock Data (0-23 hours)
  const hourlyPeakData = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 0; h < 24; h++) map[h] = 0;
    data.forEach(d => {
      map[d.hour] = (map[d.hour] || 0) + 1;
    });
    return Object.keys(map).map(h => ({
      hour: `${String(h).padStart(2, '0')}:00`,
      count: map[Number(h)]
    }));
  }, [data]);

  const handleResetFilters = () => {
    if (setSelectedDistrict) setSelectedDistrict('All Districts');
    if (setSelectedCrime) setSelectedCrime('All Crimes');
  };

  return (
    <div className="space-y-6">
      {/* PROMINENT TOP FILTER TOOLBAR */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span>Director General of Police (DGP) — Statewide Intelligence Command Center</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Official Crime Clearance Matrix, IPC/BNSS Legal Analytics & Statewide Patrol Force Readiness
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Database Synced: {data.length.toLocaleString()} Live FIR Records
          </div>
        </div>

        {/* Filter Selection Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-semibold flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Select District (31 Karnataka Districts):</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict && setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white font-medium rounded-lg p-2.5 focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="All Districts">All Districts (Statewide)</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-semibold flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select Crime Category:</span>
            </label>
            <select
              value={selectedCrime}
              onChange={(e) => setSelectedCrime && setSelectedCrime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white font-medium rounded-lg p-2.5 focus:border-indigo-400 focus:outline-none cursor-pointer"
            >
              {CRIME_TYPES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleResetFilters}
              className="flex-1 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold py-2.5 px-3 rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total State FIRs</span>
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-white">{totalCases.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-1">Synced to SCRB Database</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold text-slate-400 uppercase">State Clearance Rate</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-emerald-400">{clearanceRate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">{solvedCount.toLocaleString()} Solved Cases</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Investigations</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-rose-400">{pendingCount.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-1">Pending Chargesheet</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold text-slate-400 uppercase">Recidivism Index</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-amber-400">{repeatOffenders.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-1">Repeat Offender Arrests</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold text-slate-400 uppercase">Patrol Force Readiness</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold mt-2 text-emerald-400">92.8%</p>
          <p className="text-[11px] text-slate-400 mt-1">PCR Mobile Fleet Active</p>
        </div>
      </div>

      {/* DGP Strategic Analysis Reports Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> Conviction & Charge-Sheet Efficiency
          </span>
          <p className="text-xs text-slate-300 leading-snug">
            Karnataka State Police maintained a <b>{clearanceRate}% overall clearance rate</b> under Sec 173 BNSS with average chargesheet turnaround reduced to <b>42 days</b>.
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-400" /> High-Priority Syndicate Intercept
          </span>
          <p className="text-xs text-slate-300 leading-snug">
            Targeted network graph analysis identified <b>Accused_12 syndicate</b> in Jayanagar PS, dismantling 18 co-accused links across Bengaluru Urban.
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-400" /> Proactive Patrol Sectoring
          </span>
          <p className="text-xs text-slate-300 leading-snug">
            30-day forecast models deployed <b>42 new mobile patrol sectors</b> during peak shift vulnerability windows (20:00 - 22:00 IST).
          </p>
        </div>
      </div>

      {/* Row 1: Crime Trend & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Monthly Crime Volume Trend</span>
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#818cf8', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-sky-400" />
            <span>Offense Breakdown by Category</span>
          </h3>
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={crimeTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {crimeTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Top Districts Comparison & Hourly Peak Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-400" />
            <span>Top Karnataka Districts by Crime Volume</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtComparisonData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="district" type="category" stroke="#64748b" fontSize={10} width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Bar dataKey="cases" fill="#f59e0b" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>24-Hour Peak Offense Time Clock</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyPeakData}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
