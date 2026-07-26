export type Role = 'Constable' | 'Station Inspector' | 'District SP' | 'State DGP';

export type CrimeType = 
  | 'Theft' 
  | 'Assault' 
  | 'Burglary' 
  | 'Chain Snatching' 
  | 'Drug Trafficking' 
  | 'Murder' 
  | 'Cyber Crime' 
  | 'Domestic Violence' 
  | 'Vehicle Theft' 
  | 'Fraud';

export type CaseStatus = 'Solved' | 'Pending' | 'Under Investigation';

export interface FIRRecord {
  firId: string;
  date: string;
  hour: number;
  crimeType: CrimeType;
  district: string;
  policeStation: string;
  latitude: number;
  longitude: number;
  accusedName: string;
  age: number;
  gender: 'Male' | 'Female';
  priorCases: number;
  isRepeatOffender: boolean;
  status: CaseStatus;
  severity: number; // 1 - 10
  unemploymentRate: number;
  populationDensity: number;
  month: string; // YYYY-MM
  dayOfWeek: string;
  timeOfDay: 'Day' | 'Night';
  priorityScore: number;
  ipcSection: string;

  // CrPC 154 / BNSS 173 Extensions
  complainantName?: string;
  complainantPhone?: string;
  complainantAddress?: string;
  incidentLocationLandmark?: string;
  motive?: string;
  witnessDetails?: string;
  stolenPropertyDetails?: string;
  stolenValue?: number;
  gdEntryNumber?: string;
  registeringOfficer?: string;
}

export interface HotspotArea {
  district: string;
  policeStation: string;
  totalCases: number;
  avgSeverity: number;
  repeatOffenders: number;
  riskScore: number;
  lat: number;
  lng: number;
}

export interface NetworkLinkEvidence {
  associateId: string;
  associateName: string;
  evidenceType: 'Co-Accused in FIR' | 'Call Detail Records (CDR)' | 'Shared Jurisdiction' | 'Common Prison Record';
  details: string;
  confidenceRating: string;
}

export interface CriminalNode {
  id: string;
  name: string;
  crimeTypes: CrimeType[];
  policeStation: string;
  priorCases: number;
  connections: string[];
  connectionEvidence?: NetworkLinkEvidence[];
  centralityScore: number;
  isKingpin: boolean;
}

export interface LangGraphAgentStep {
  id: string;
  nodeName: string;
  agentRole: string;
  status: 'pending' | 'running' | 'completed';
  thought: string;
  input: string;
  output: string;
  timestamp: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  userRole: Role;
  action: string;
  details: string;
  ipAddress: string;
  status: 'AUTHORIZED' | 'ALERT_FLAG';
}
