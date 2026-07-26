import React from 'react';
import { Role } from '../types/crime';
import { 
  LayoutDashboard, MapPin, GitFork, MessageSquare, 
  TrendingUp, ClipboardList, Bell, Database
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedCrime: string;
  setSelectedCrime: (crime: string) => void;
  filteredCount: number;
  role: Role;
}

export interface NavItem {
  id: string;
  label: string;
  description: string;
  icon: any;
  minRole: Role;
}

export const CRIME_TYPES_LIST = [
  'All Crimes', 'Theft', 'Assault', 'Burglary', 'Chain Snatching',
  'Drug Trafficking', 'Murder', 'Cyber Crime', 'Domestic Violence', 'Vehicle Theft', 'Fraud'
];

export const ALL_NAV_ITEMS: NavItem[] = [
  { id: 'reports', label: 'Raw Data & Reports', description: 'Full FIR database & CSV/PDF export', icon: Database, minRole: 'Constable' },
  { id: 'cases', label: 'Open Case Files', description: 'Prioritized list of FIR cases', icon: ClipboardList, minRole: 'Constable' },
  { id: 'alerts', label: 'Live Alerts', description: 'Real-time incident updates', icon: Bell, minRole: 'Constable' },
  { id: 'heatmap', label: 'Crime Map & Hotspots', description: 'Location breakdown on map', icon: MapPin, minRole: 'Station Inspector' },
  { id: 'network', label: 'Criminal Connections', description: 'Links between suspects', icon: GitFork, minRole: 'Station Inspector' },
  { id: 'agentic', label: 'AI Crime Assistant', description: 'Ask questions in plain English', icon: MessageSquare, minRole: 'Station Inspector' },
  { id: 'predictive', label: 'Future Risk Forecast', description: '30-day patrol risk planning', icon: TrendingUp, minRole: 'District SP' },
  { id: 'command', label: 'State Overview', description: 'Strategic crime stats & numbers', icon: LayoutDashboard, minRole: 'State DGP' },
];

const ROLE_RANK: Record<Role, number> = {
  'Constable': 1,
  'Station Inspector': 2,
  'District SP': 3,
  'State DGP': 4
};

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  role
}) => {
  const currentRank = ROLE_RANK[role] || 4;

  // Filter accessible modules cleanly based on active role
  const accessibleItems = ALL_NAV_ITEMS.filter(
    (item) => currentRank >= ROLE_RANK[item.minRole]
  );

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 text-slate-200 flex flex-col justify-between shrink-0">
      <div className="space-y-4">
        {/* Navigation Menu Header */}
        <div>
          <h2 className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-3 px-2">
            System Modules
          </h2>
          <nav className="space-y-1">
            {accessibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <div className="flex-1">
                    <div className="text-xs font-medium leading-tight">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
        <p className="font-medium text-slate-300">Karnataka State Police</p>
        <p className="text-[10px]">State Crime Records Bureau</p>
      </div>
    </aside>
  );
};
