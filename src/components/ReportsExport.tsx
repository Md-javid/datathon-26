import React, { useState, useMemo } from 'react';
import { FIRRecord } from '../types/crime';
import { jsPDF } from 'jspdf';
import { Database, Download, FileText, Table, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReportsExportProps {
  data: FIRRecord[];
}

export const ReportsExport: React.FC<ReportsExportProps> = ({ data }) => {
  const [activeSubTab, setActiveSubTab] = useState<'raw' | 'pdf'>('raw');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reportType, setReportType] = useState('Monthly Crime Statistics');
  const [isGenerating, setIsGenerating] = useState(false);

  const pageSize = 15;

  // Filtered raw dataset
  const filteredRawData = useMemo(() => {
    return data.filter((row) => {
      const q = searchTerm.toLowerCase();
      return (
        row.firId.toLowerCase().includes(q) ||
        row.accusedName.toLowerCase().includes(q) ||
        row.district.toLowerCase().includes(q) ||
        row.policeStation.toLowerCase().includes(q) ||
        row.crimeType.toLowerCase().includes(q) ||
        row.ipcSection.toLowerCase().includes(q)
      );
    });
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredRawData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRawData.slice(start, start + pageSize);
  }, [filteredRawData, currentPage]);

  const downloadCSV = () => {
    const headers = ['FIR_ID', 'Date', 'Hour', 'Crime_Type', 'District', 'Police_Station', 'Latitude', 'Longitude', 'Accused_Name', 'Age', 'Gender', 'Prior_Cases', 'Status', 'Severity', 'IPC_Section'];
    const rows = filteredRawData.map((d) => [
      d.firId, d.date, d.hour, d.crimeType, d.district, d.policeStation, d.latitude, d.longitude, `"${d.accusedName}"`, d.age, d.gender, d.priorCases, d.status, d.severity, `"${d.ipcSection}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KSP_Crime_Records_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredRawData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'KSP_Crime_Records.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const generatePDFReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('KARNATAKA STATE POLICE - OFFICIAL CRIME REPORT', 14, 20);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Report Subject: ${reportType} | Date Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.text('--------------------------------------------------------------------------------', 14, 34);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('1. Executive Summary', 14, 44);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Total FIR Records Analyzed: ${data.length}`, 14, 52);
      const solved = data.filter(d => d.status === 'Solved').length;
      doc.text(`Statewide Solved Ratio: ${((solved / data.length) * 100).toFixed(1)}% (${solved} Solved Cases)`, 14, 60);
      doc.text(`Repeat Offenders Logged: ${data.filter(d => d.isRepeatOffender).length}`, 14, 68);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('2. Actionable Recommendations', 14, 82);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('• Deploy additional patrols to Koramangala & Jayanagar station jurisdictions.', 14, 90);
      doc.text('• Priority review of drug trafficking offenses in Hubli-Dharwad district.', 14, 98);
      doc.text('• Expedite charge sheet filings for repeat property crime offenses.', 14, 106);

      doc.save(`KSP_${reportType.replace(/\s+/g, '_')}_Report.pdf`);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <span>Raw Crime Database & Official Reports</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect raw FIR database entries, perform live searches, or export official PDF and CSV records.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('raw')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'raw' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <Table className="w-4 h-4" /> Raw FIR Data Table
          </button>
          <button
            onClick={() => setActiveSubTab('pdf')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'pdf' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> PDF Report Generator
          </button>
        </div>
      </div>

      {activeSubTab === 'raw' ? (
        /* Raw FIR Database Table */
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by FIR ID, Suspect, Station..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadCSV}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-semibold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Download CSV
              </button>
              <button
                onClick={downloadJSON}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-300 font-semibold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Download JSON
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">FIR ID</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Crime Category</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Police Station</th>
                  <th className="p-3">Suspect Name</th>
                  <th className="p-3 text-center">Prior Cases</th>
                  <th className="p-3 text-center">Severity</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">IPC / BNS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paginatedData.map((row) => (
                  <tr key={row.firId} className="hover:bg-slate-800/50 transition">
                    <td className="p-3 font-mono font-bold text-amber-400">{row.firId}</td>
                    <td className="p-3 text-slate-400">{row.date} ({row.hour}:00)</td>
                    <td className="p-3 font-medium text-white">{row.crimeType}</td>
                    <td className="p-3 text-slate-300">{row.district}</td>
                    <td className="p-3 text-indigo-300">{row.policeStation}</td>
                    <td className="p-3 text-white font-medium">{row.accusedName} ({row.gender}, {row.age})</td>
                    <td className="p-3 text-center font-bold">{row.priorCases}</td>
                    <td className="p-3 text-center font-mono">{row.severity}/10</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.status === 'Solved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                        row.status === 'Pending' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                        'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-[11px] font-mono">{row.ipcSection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Showing Page <b>{currentPage}</b> of <b>{totalPages}</b> ({filteredRawData.length} records)</span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* PDF Generator View */
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 shadow-sm max-w-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Generate Official PDF Briefing</span>
          </h3>

          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">Select Subject:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5 focus:outline-none"
            >
              <option value="Monthly Crime Statistics">Monthly Crime Statistics</option>
              <option value="District Performance Review">District Performance Review</option>
              <option value="Repeat Offender Link Analysis">Repeat Offender Link Analysis</option>
              <option value="Predictive Threat Assessment">Predictive Threat Assessment</option>
            </select>
          </div>

          <button
            onClick={generatePDFReport}
            disabled={isGenerating}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            {isGenerating ? 'Generating PDF...' : 'Download Official PDF Report'}
          </button>
        </div>
      )}
    </div>
  );
};
