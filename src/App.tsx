import React, { useState, useMemo, useEffect } from 'react';
import { Role, FIRRecord } from './types/crime';
import { generateCrimeDataset } from './data/mockCrimeData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandCenter } from './components/CommandCenter';
import { CrimeHeatmap } from './components/CrimeHeatmap';
import { NetworkAnalysis } from './components/NetworkAnalysis';
import { AgenticAIAssistant } from './components/AgenticAIAssistant';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { CaseManagement } from './components/CaseManagement';
import { LiveAlerts } from './components/LiveAlerts';
import { ReportsExport } from './components/ReportsExport';
import { AddCrimeModal } from './components/AddCrimeModal';

const DEFAULT_PAGE_FOR_ROLE: Record<Role, string> = {
  'Constable': 'reports',
  'Station Inspector': 'cases',
  'District SP': 'predictive',
  'State DGP': 'command'
};

const STORAGE_KEY = 'KSP_INTELLICRIME_FIR_DATASET_V1';

export function App() {
  const [role, setRoleState] = useState<Role>('State DGP');
  const [activePage, setActivePage] = useState<string>('command');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [selectedCrime, setSelectedCrime] = useState<string>('All Crimes');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Load dataset with persistent LocalStorage / Database Sync
  const [fullDataset, setFullDataset] = useState<FIRRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored FIR dataset:', e);
    }
    return generateCrimeDataset(2000);
  });

  // Save to persistent storage whenever dataset changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullDataset));
    } catch (e) {
      console.error('Error syncing FIR dataset to storage:', e);
    }
  }, [fullDataset]);

  // Handle Role Change with Automatic Role-Specific Dashboard Switch
  const handleRoleChange = (newRole: Role) => {
    setRoleState(newRole);
    setActivePage(DEFAULT_PAGE_FOR_ROLE[newRole] || 'command');
  };

  const handleAddFIRRecord = (newRecord: FIRRecord) => {
    setFullDataset((prev) => [newRecord, ...prev]);
  };

  // Filter dataset dynamically
  const filteredData = useMemo(() => {
    return fullDataset.filter((item) => {
      const matchDistrict = selectedDistrict === 'All Districts' || item.district === selectedDistrict;
      const matchCrime = selectedCrime === 'All Crimes' || item.crimeType === selectedCrime;
      return matchDistrict && matchCrime;
    });
  }, [fullDataset, selectedDistrict, selectedCrime]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Government Header */}
      <Header
        role={role}
        setRole={handleRoleChange}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedCrime={selectedCrime}
          setSelectedCrime={setSelectedCrime}
          filteredCount={filteredData.length}
          role={role}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activePage === 'command' && (
            <CommandCenter 
              data={filteredData} 
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedCrime={selectedCrime}
              setSelectedCrime={setSelectedCrime}
            />
          )}
          {activePage === 'heatmap' && <CrimeHeatmap data={filteredData} />}
          {activePage === 'network' && <NetworkAnalysis data={filteredData} />}
          {activePage === 'agentic' && <AgenticAIAssistant data={filteredData} role={role} />}
          {activePage === 'predictive' && <PredictiveAnalytics data={filteredData} />}
          {activePage === 'cases' && <CaseManagement data={filteredData} />}
          {activePage === 'alerts' && <LiveAlerts />}
          {activePage === 'reports' && <ReportsExport data={filteredData} />}
        </main>
      </div>

      {/* Register New FIR Modal */}
      <AddCrimeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRecord={handleAddFIRRecord}
        totalRecordsCount={fullDataset.length}
      />

      {/* Official Government Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-center py-3 text-xs text-slate-400">
        <p><b>Karnataka State Police</b> — State Crime Records Bureau (SCRB)</p>
      </footer>
    </div>
  );
}

export default App;
