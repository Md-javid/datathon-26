import React, { useState } from 'react';
import { FIRRecord, CrimeType, CaseStatus } from '../types/crime';
import { DISTRICTS, STATIONS, CRIME_SEVERITY, IPC_SECTIONS } from '../data/mockCrimeData';
import { ShieldCheck, X, User, MapPin, FileText, Users, Scale } from 'lucide-react';

interface AddCrimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: FIRRecord) => void;
  totalRecordsCount: number;
}

export const AddCrimeModal: React.FC<AddCrimeModalProps> = ({
  isOpen,
  onClose,
  onAddRecord,
  totalRecordsCount,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [error, setError] = useState<string>('');

  // Category 1: Complainant Details
  const [complainantName, setComplainantName] = useState('');
  const [complainantPhone, setComplainantPhone] = useState('');
  const [complainantAddress, setComplainantAddress] = useState('');

  // Category 2: Time & Place of Incident
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [policeStation, setPoliceStation] = useState(STATIONS[DISTRICTS[0]][0]);
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [incidentHour, setIncidentHour] = useState(new Date().getHours());
  const [locationLandmark, setLocationLandmark] = useState('');

  // Category 3: Offence Details
  const [crimeType, setCrimeType] = useState<CrimeType>('Theft');
  const [motive, setMotive] = useState('');
  const [offenceStatement, setOffenceStatement] = useState('');

  // Category 4: Suspect & Witness Information
  const [accusedName, setAccusedName] = useState('');
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [priorCases, setPriorCases] = useState(0);
  const [witnessDetails, setWitnessDetails] = useState('');

  // Category 5: Administrative & Property Details
  const [stolenProperty, setStolenProperty] = useState('');
  const [stolenValue, setStolenValue] = useState(0);
  const [gdEntryNumber, setGdEntryNumber] = useState(`GD-2025-${Math.floor(1000 + Math.random() * 9000)}`);
  const [registeringOfficer, setRegisteringOfficer] = useState('Insp. V. Sharma (SCRB)');
  const [status, setStatus] = useState<CaseStatus>('Under Investigation');

  if (!isOpen) return null;

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    if (STATIONS[d] && STATIONS[d].length > 0) {
      setPoliceStation(STATIONS[d][0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!complainantName.trim()) {
      setError('Validation Error: Please enter Complainant Name in Section 1.');
      setActiveStep(1);
      return;
    }
    if (!complainantPhone.trim()) {
      setError('Validation Error: Please enter Complainant Phone Number in Section 1.');
      setActiveStep(1);
      return;
    }
    if (!offenceStatement.trim()) {
      setError('Validation Error: Please provide a Detailed Description of the Criminal Act in Section 3.');
      setActiveStep(3);
      return;
    }
    if (!accusedName.trim()) {
      setError("Validation Error: Please provide Accused Name or explicitly enter 'Unknown' in Section 4.");
      setActiveStep(4);
      return;
    }

    setError('');

    const firId = `FIR-2025-${String(totalRecordsCount + 1).padStart(5, '0')}`;
    const severity = CRIME_SEVERITY[crimeType] || 4;
    const isRepeatOffender = priorCases >= 2;
    const monthStr = incidentDate.substring(0, 7);
    const dayOfWeek = new Date(incidentDate).toLocaleDateString('en-US', { weekday: 'long' });
    const timeOfDay = incidentHour < 6 || incidentHour > 20 ? 'Night' : 'Day';

    const priorityScore = severity * 2 + priorCases * 3 + (isRepeatOffender ? 5 : 0) + (status === 'Pending' ? 3 : 0);

    const newRecord: FIRRecord = {
      firId,
      date: incidentDate,
      hour: incidentHour,
      crimeType,
      district,
      policeStation,
      latitude: 12.9716,
      longitude: 77.5946,
      accusedName: accusedName.trim() || 'Unknown Suspect',
      age,
      gender,
      priorCases,
      isRepeatOffender,
      status,
      severity,
      unemploymentRate: 14.5,
      populationDensity: 8500,
      month: monthStr,
      dayOfWeek,
      timeOfDay,
      priorityScore,
      ipcSection: IPC_SECTIONS[crimeType] || 'IPC 379 / BNS 303',

      // Section 154 CrPC Extensions
      complainantName: complainantName || 'Anonymous Informant',
      complainantPhone: complainantPhone || 'N/A',
      complainantAddress: complainantAddress || 'N/A',
      incidentLocationLandmark: locationLandmark || policeStation,
      motive: motive || 'Financial Gain',
      witnessDetails: witnessDetails || 'Under Verification',
      stolenPropertyDetails: stolenProperty || 'None',
      stolenValue: stolenValue || 0,
      gdEntryNumber,
      registeringOfficer
    };

    onAddRecord(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>Official FIR Registration (Sec 154 CrPC / Sec 173 BNSS)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Karnataka State Police e-Complaint Form</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Error Message */}
        {error && (
          <div className="bg-rose-950/50 border border-rose-500/50 text-rose-400 text-xs p-3 rounded-lg flex items-center gap-2 font-medium">
            <X className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 5 Category Navigation Tabs */}
        <div className="flex border-b border-slate-800 text-xs font-medium overflow-x-auto">
          {[
            { id: 1, label: '1. Complainant', icon: User },
            { id: 2, label: '2. Incident Time/Place', icon: MapPin },
            { id: 3, label: '3. Offence Details', icon: FileText },
            { id: 4, label: '4. Suspect & Witness', icon: Users },
            { id: 5, label: '5. Admin & Property', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStep === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStep(tab.id)}
                className={`px-3 py-2 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                  isActive
                    ? 'border-amber-400 text-amber-300 font-bold bg-slate-950'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category 1: Complainant Details */}
          {activeStep === 1 && (
            <div className="space-y-3">
              <h4 className="font-bold text-amber-300">Section 1: Complainant / Informant Identity</h4>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Complainant Full Name:</label>
                <input
                  type="text"
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  placeholder="e.g. Suresh Gowda"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Phone Number:</label>
                  <input
                    type="text"
                    value={complainantPhone}
                    onChange={(e) => setComplainantPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Residential Address:</label>
                  <input
                    type="text"
                    value={complainantAddress}
                    onChange={(e) => setComplainantAddress(e.target.value)}
                    placeholder="House No, Street, Village/Town"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Category 2: Time & Place of Incident */}
          {activeStep === 2 && (
            <div className="space-y-3">
              <h4 className="font-bold text-amber-300">Section 2: Time and Location of Incident</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">District Jurisdiction:</label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Police Station:</label>
                  <select
                    value={policeStation}
                    onChange={(e) => setPoliceStation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  >
                    {(STATIONS[district] || []).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Date of Offence:</label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Hour of Offence (0-23):</label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={incidentHour}
                    onChange={(e) => setIncidentHour(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Nearest Landmark:</label>
                  <input
                    type="text"
                    value={locationLandmark}
                    onChange={(e) => setLocationLandmark(e.target.value)}
                    placeholder="Near Bus Stand / Metro Station"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Category 3: Details of Offence */}
          {activeStep === 3 && (
            <div className="space-y-3">
              <h4 className="font-bold text-amber-300">Section 3: Offence Categorization & Legal Sections</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Crime Classification:</label>
                  <select
                    value={crimeType}
                    onChange={(e) => setCrimeType(e.target.value as CrimeType)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Theft">Theft</option>
                    <option value="Assault">Assault</option>
                    <option value="Burglary">Burglary</option>
                    <option value="Chain Snatching">Chain Snatching</option>
                    <option value="Drug Trafficking">Drug Trafficking</option>
                    <option value="Murder">Murder</option>
                    <option value="Cyber Crime">Cyber Crime</option>
                    <option value="Domestic Violence">Domestic Violence</option>
                    <option value="Vehicle Theft">Vehicle Theft</option>
                    <option value="Fraud">Fraud</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Applicable Law / IPC / BNS Section:</label>
                  <input
                    type="text"
                    value={IPC_SECTIONS[crimeType]}
                    readOnly
                    className="w-full bg-slate-950 border border-slate-800 text-amber-400 font-mono rounded p-2 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Known Motive / Reason:</label>
                <input
                  type="text"
                  value={motive}
                  onChange={(e) => setMotive(e.target.value)}
                  placeholder="e.g. Financial gain, Personal rivalry"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Detailed Description of Criminal Act:</label>
                <textarea
                  rows={2}
                  value={offenceStatement}
                  onChange={(e) => setOffenceStatement(e.target.value)}
                  placeholder="Write a clear statement of what happened..."
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Category 4: Suspect and Witness Information */}
          {activeStep === 4 && (
            <div className="space-y-3">
              <h4 className="font-bold text-amber-300">Section 4: Accused Suspect & Witness Particulars</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-slate-400 block mb-1 font-medium">Accused / Suspect Name (or 'Unknown'):</label>
                  <input
                    type="text"
                    value={accusedName}
                    onChange={(e) => setAccusedName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar (or Unknown)"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Est. Age:</label>
                  <input
                    type="number"
                    min={18}
                    max={90}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Gender:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Prior Arrest Record Count:</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={priorCases}
                    onChange={(e) => setPriorCases(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Witness Details (Names & Contact Numbers):</label>
                <input
                  type="text"
                  value={witnessDetails}
                  onChange={(e) => setWitnessDetails(e.target.value)}
                  placeholder="e.g. Witness 1: Vijay (Ph: 98450 12345)"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Category 5: Administrative & Property Details */}
          {activeStep === 5 && (
            <div className="space-y-3">
              <h4 className="font-bold text-amber-300">Section 5: Administrative & Property Particulars</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Stolen / Damaged Property Details:</label>
                  <input
                    type="text"
                    value={stolenProperty}
                    onChange={(e) => setStolenProperty(e.target.value)}
                    placeholder="e.g. Gold Chain (25g), Cash ₹50,000"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Estimated Value (₹):</label>
                  <input
                    type="number"
                    value={stolenValue}
                    onChange={(e) => setStolenValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">GD Entry Number:</label>
                  <input
                    type="text"
                    value={gdEntryNumber}
                    onChange={(e) => setGdEntryNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Registering Officer:</label>
                  <input
                    type="text"
                    value={registeringOfficer}
                    onChange={(e) => setRegisteringOfficer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CaseStatus)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Pending">Pending</option>
                    <option value="Solved">Solved</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
            <div className="flex gap-2">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(s => s - 1)}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs rounded border border-slate-800 font-medium"
                >
                  ← Previous Section
                </button>
              )}
              {activeStep < 5 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(s => s + 1)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded font-medium"
                >
                  Next Section →
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs rounded font-medium border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded flex items-center gap-1.5 transition shadow"
              >
                <ShieldCheck className="w-4 h-4" /> Save Official FIR Record
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
