import { FIRRecord, CrimeType, CaseStatus, CriminalNode, SecurityAuditLog } from '../types/crime';

// ALL OFFICIAL 31 DISTRICTS OF KARNATAKA
export const DISTRICTS = [
  'Bengaluru Urban',
  'Bengaluru Rural',
  'Ramanagara',
  'Chikkaballapura',
  'Kolar',
  'Tumakuru',
  'Shivamogga',
  'Chitradurga',
  'Davanagere',
  'Mysuru',
  'Mandya',
  'Hassan',
  'Kodagu',
  'Chamarajanagar',
  'Dakshina Kannada',
  'Udupi',
  'Uttara Kannada',
  'Belagavi',
  'Dharwad',
  'Gadag',
  'Haveri',
  'Vijayapura',
  'Bagalkote',
  'Kalaburagi',
  'Yadgir',
  'Bidar',
  'Raichur',
  'Koppal',
  'Ballari',
  'Vijayanagara',
  'Chikkamagaluru'
];

// REAL POLICE STATIONS IN ALL 31 DISTRICTS OF KARNATAKA
export const STATIONS: Record<string, string[]> = {
  'Bengaluru Urban': ['Koramangala PS', 'Jayanagar PS', 'Indiranagar PS', 'Whitefield PS', 'BTM Layout PS', 'HSR Layout PS', 'Electronic City PS', 'Rajajinagar PS', 'Malleshwaram PS', 'Cubbon Park PS', 'Halasuru PS', 'Yeshwanthpur PS'],
  'Bengaluru Rural': ['Devanahalli Town PS', 'Doddaballapura PS', 'Nelamangala Town PS', 'Hoskote Town PS', 'Vijayapura Rural PS'],
  'Ramanagara': ['Ramanagara Town PS', 'Channapatna Town PS', 'Kanakapura Town PS', 'Magadi PS'],
  'Chikkaballapura': ['Chikkaballapura Town PS', 'Gauribidanur PS', 'Chintamani Town PS', 'Sidlaghatta PS', 'Bagepalli PS'],
  'Kolar': ['Kolar Town PS', 'KGF Oorgaum PS', 'Bangarapet PS', 'Mulbagal PS', 'Malur PS'],
  'Tumakuru': ['Tumakuru Town PS', 'Kyathsandra PS', 'Kunigal PS', 'Madhugiri PS', 'Tiptur Town PS', 'Sira Town PS'],
  'Shivamogga': ['Shivamogga Town PS', 'Doddapet PS', 'Jayanagara Shivamogga PS', 'Sagara Town PS', 'Thirthahalli PS', 'Bhadravathi PS'],
  'Chitradurga': ['Chitradurga Town PS', 'Challakere PS', 'Hiriyur PS', 'Holalkere PS', 'Hosadurga PS'],
  'Davanagere': ['Davanagere City PS', 'Vidyanagar PS', 'Harihar Town PS', 'Channagiri PS', 'Honnali PS'],
  'Mysuru': ['Devaraja PS', 'Lashkar PS', 'Nazarbad PS', 'Vontikoppal PS', 'Krishnaraja PS', 'Kuvempunagar PS', 'Jayalakshmipuram PS', 'Hunsur PS'],
  'Mandya': ['Mandya Town PS', 'Maddur Town PS', 'Srirangapatna PS', 'Malavalli PS', 'Nagarnagere PS'],
  'Hassan': ['Hassan City PS', 'Hassan Extension PS', 'Arsikere Town PS', 'Channarayapatna PS', 'Sakleshpur PS'],
  'Kodagu': ['Madikeri Town PS', 'Virajpet PS', 'Somwarpet PS', 'Kushalनगर PS'],
  'Chamarajanagar': ['Chamarajanagar Town PS', 'Kollegal Town PS', 'Gundlupet PS', 'Yelandur PS'],
  'Dakshina Kannada': ['Pandeshwar (Mangaluru South) PS', 'Bunder (Mangaluru North) PS', 'Kadri PS', 'Urwa PS', 'Surathkal PS', 'Bantwal PS', 'Puttur Town PS'],
  'Udupi': ['Udupi Town PS', 'Manipal PS', 'Kundapura PS', 'Karkala Town PS', 'Kaup PS'],
  'Uttara Kannada': ['Karwar Town PS', 'Sirsi Town PS', 'Bhatkal Town PS', 'Kumta PS', 'Dandeli PS', 'Haliyal PS'],
  'Belagavi': ['Camp PS Belagavi', 'Shahapur PS', 'Tilakwadi PS', 'Market PS', 'Gokak Town PS', 'Chikkodi PS', 'Bailhongal PS'],
  'Dharwad': ['Hubballi Suburban PS', 'Gokul Road PS', 'Navanagar PS', 'Dharwad Town PS', 'Vidyagiri PS'],
  'Gadag': ['Gadag Town PS', 'Betageri PS', 'Ronn PS', 'Shirhatti PS', 'Mundargi PS'],
  'Haveri': ['Haveri Town PS', 'Ranebennur Town PS', 'Byadgi PS', 'Hangal PS', 'Shiggaon PS'],
  'Vijayapura': ['Vijayapura Gol Gumbaz PS', 'Gandhi Chowk PS', 'APMC PS', 'Indi PS', 'Muddebihal PS'],
  'Bagalkote': ['Bagalkote Town PS', 'Navanagar Bagalkote PS', 'Jamkhandi Town PS', 'Ilkal PS', 'Badami PS'],
  'Kalaburagi': ['Gulbarga Central PS', 'Brahmpur PS', 'Ashok Nagar PS', 'Station Bazaar PS', 'Sedam PS', 'Shahabad PS'],
  'Yadgir': ['Yadgir Town PS', 'Shahapur Yadgir PS', 'Shorapur PS', 'Gurmatkal PS'],
  'Bidar': ['Bidar New Town PS', 'Bidar Market PS', 'Bhalki PS', 'Basavakalyan PS', 'Humnabad PS'],
  'Raichur': ['Raichur West PS', 'Raichur East PS', 'Sindhanur PS', 'Manvi PS', 'Devadurga PS'],
  'Koppal': ['Koppal Town PS', 'Gangavathi PS', 'Yelbarga PS', 'Kushtagi PS'],
  'Ballari': ['Ballari City PS', 'Brucepet PS', 'Cowal Bazaar PS', 'Siruguppa PS'],
  'Vijayanagara': ['Hospet Town PS', 'Hampi PS', 'Harapanahalli PS', 'Kudligi PS'],
  'Chikkamagaluru': ['Chikkamagaluru Town PS', 'Basavanahalli PS', 'Kadur PS', 'Tarikere PS', 'Mudigere PS']
};

// REAL GEOGRAPHIC COORDINATES FOR ALL 31 DISTRICT HEADQUARTERS IN KARNATAKA
export const DISTRICT_COORDS: Record<string, [number, number]> = {
  'Bengaluru Urban': [12.9716, 77.5946],
  'Bengaluru Rural': [13.2925, 77.8008],
  'Ramanagara': [12.7209, 77.2799],
  'Chikkaballapura': [13.4355, 77.7315],
  'Kolar': [13.1367, 78.1291],
  'Tumakuru': [13.3379, 77.1173],
  'Shivamogga': [13.9299, 75.5681],
  'Chitradurga': [14.2251, 76.3980],
  'Davanagere': [14.4644, 75.9218],
  'Mysuru': [12.2958, 76.6394],
  'Mandya': [12.5218, 76.8951],
  'Hassan': [13.0072, 76.0962],
  'Kodagu': [12.4244, 75.7382],
  'Chamarajanagar': [11.9261, 76.9437],
  'Dakshina Kannada': [12.9141, 74.8560],
  'Udupi': [13.3409, 74.7421],
  'Uttara Kannada': [14.8158, 74.1302],
  'Belagavi': [15.8497, 74.4977],
  'Dharwad': [15.3647, 75.1240],
  'Gadag': [15.4320, 75.6318],
  'Haveri': [14.7958, 75.3992],
  'Vijayapura': [16.8302, 75.7100],
  'Bagalkote': [16.1853, 75.6961],
  'Kalaburagi': [17.3297, 76.8343],
  'Yadgir': [16.7700, 77.1300],
  'Bidar': [17.9104, 77.5199],
  'Raichur': [16.2076, 77.3556],
  'Koppal': [15.3517, 76.1557],
  'Ballari': [15.1394, 76.9214],
  'Vijayanagara': [15.2689, 76.3909],
  'Chikkamagaluru': [13.3161, 75.7720]
};

export const CRIME_SEVERITY: Record<CrimeType, number> = {
  'Theft': 3,
  'Assault': 5,
  'Burglary': 4,
  'Chain Snatching': 4,
  'Drug Trafficking': 8,
  'Murder': 10,
  'Cyber Crime': 6,
  'Domestic Violence': 5,
  'Vehicle Theft': 3,
  'Fraud': 4
};

export const IPC_SECTIONS: Record<CrimeType, string> = {
  'Theft': 'IPC 379 / BNS 303',
  'Assault': 'IPC 351 / BNS 130',
  'Burglary': 'IPC 457 / BNS 331',
  'Chain Snatching': 'IPC 379A / BNS 304',
  'Drug Trafficking': 'NDPS Act Sec 20/22',
  'Murder': 'IPC 302 / BNS 101',
  'Cyber Crime': 'IT Act Sec 66D',
  'Domestic Violence': 'IPC 498A / BNS 85',
  'Vehicle Theft': 'IPC 379 / BNS 303',
  'Fraud': 'IPC 420 / BNS 318'
};

let seed = 42;
function pseudoRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateCrimeDataset(count: number = 2000): FIRRecord[] {
  seed = 42;
  const crimeTypes: CrimeType[] = [
    'Theft', 'Assault', 'Burglary', 'Chain Snatching', 'Drug Trafficking',
    'Murder', 'Cyber Crime', 'Domestic Violence', 'Vehicle Theft', 'Fraud'
  ];
  
  const records: FIRRecord[] = [];
  const startDate = new Date(2024, 0, 1);
  const daysRange = 730;

  for (let i = 0; i < count; i++) {
    const districtIndex = Math.floor(pseudoRandom() * DISTRICTS.length);
    const district = DISTRICTS[districtIndex];
    const stationList = STATIONS[district] || ['District Central PS'];
    const policeStation = stationList[Math.floor(pseudoRandom() * stationList.length)];
    const crimeType = crimeTypes[Math.floor(pseudoRandom() * crimeTypes.length)];

    const [baseLat, baseLon] = DISTRICT_COORDS[district] || [12.9716, 77.5946];
    const latitude = baseLat + (pseudoRandom() - 0.5) * 0.15;
    const longitude = baseLon + (pseudoRandom() - 0.5) * 0.15;

    const randomDays = Math.floor(pseudoRandom() * daysRange);
    const recordDate = new Date(startDate.getTime() + randomDays * 24 * 60 * 60 * 1000);
    const dateStr = recordDate.toISOString().split('T')[0];
    const monthStr = dateStr.substring(0, 7);

    const hour = Math.floor(pseudoRandom() * 24);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[recordDate.getDay()];
    const timeOfDay = (hour < 6 || hour > 20) ? 'Night' : 'Day';

    const priorCases = Math.floor(pseudoRandom() * 4);
    const isRepeatOffender = priorCases >= 2 || (crimeType === 'Drug Trafficking' && pseudoRandom() > 0.5);

    const severity = CRIME_SEVERITY[crimeType];
    const statusChoices: CaseStatus[] = ['Solved', 'Pending', 'Under Investigation'];
    const statusWeights = crimeType === 'Murder' ? [0.8, 0.1, 0.1] : [0.45, 0.35, 0.2];
    const statusRand = pseudoRandom();
    let status: CaseStatus = 'Under Investigation';
    if (statusRand < statusWeights[0]) status = 'Solved';
    else if (statusRand < statusWeights[0] + statusWeights[1]) status = 'Pending';

    const age = 18 + Math.floor(pseudoRandom() * 48);
    const gender = pseudoRandom() > 0.12 ? 'Male' : 'Female';
    const unemploymentRate = Math.round((5 + pseudoRandom() * 20) * 10) / 10;
    const populationDensity = Math.floor(1000 + pseudoRandom() * 14000);

    let priorityScore = severity * 2 + priorCases * 3 + (isRepeatOffender ? 5 : 0) + (status === 'Pending' ? 3 : 0);

    records.push({
      firId: `FIR-2025-${String(i + 1).padStart(5, '0')}`,
      date: dateStr,
      hour,
      crimeType,
      district,
      policeStation,
      latitude: Number(latitude.toFixed(5)),
      longitude: Number(longitude.toFixed(5)),
      accusedName: `Accused_${i + 1}`,
      age,
      gender,
      priorCases,
      isRepeatOffender,
      status,
      severity,
      unemploymentRate,
      populationDensity,
      month: monthStr,
      dayOfWeek,
      timeOfDay,
      priorityScore,
      ipcSection: IPC_SECTIONS[crimeType]
    });
  }

  return records;
}

export function generateCriminalNetwork(): CriminalNode[] {
  return [
    {
      id: 'Accused_12',
      name: 'Accused_12 (Syndicate Leader)',
      crimeTypes: ['Drug Trafficking', 'Burglary'],
      policeStation: 'Jayanagar PS',
      priorCases: 8,
      connections: ['Accused_45', 'Accused_78', 'Accused_102', 'Accused_156'],
      connectionEvidence: [
        { associateId: 'Accused_45', associateName: 'Accused_45 (Koramangala PS)', evidenceType: 'Co-Accused in FIR', details: 'Named together in FIR-2024-00142 (NDPS Act Drug Trafficking ring)', confidenceRating: '98% High' },
        { associateId: 'Accused_78', associateName: 'Accused_78 (Jayanagar PS)', evidenceType: 'Call Detail Records (CDR)', details: '18 phone calls logged between active phone numbers during late-night hours', confidenceRating: '95% High' },
        { associateId: 'Accused_102', associateName: 'Accused_102 (Indiranagar PS)', evidenceType: 'Shared Jurisdiction', details: 'Fencing stolen property at common warehouse location in Indiranagar', confidenceRating: '89% High' },
        { associateId: 'Accused_156', associateName: 'Accused_156 (BTM Layout PS)', evidenceType: 'Common Prison Record', details: 'Inmates together at Parappana Agrahara Central Prison (2023)', confidenceRating: '92% High' }
      ],
      centralityScore: 0.94,
      isKingpin: true
    },
    {
      id: 'Accused_45',
      name: 'Accused_45',
      crimeTypes: ['Drug Trafficking'],
      policeStation: 'Koramangala PS',
      priorCases: 4,
      connections: ['Accused_12', 'Accused_78', 'Accused_210'],
      connectionEvidence: [
        { associateId: 'Accused_12', associateName: 'Accused_12 (Kingpin)', evidenceType: 'Co-Accused in FIR', details: 'Co-accused in drug distribution case FIR-2024-00142', confidenceRating: '98% High' },
        { associateId: 'Accused_78', associateName: 'Accused_78', evidenceType: 'Call Detail Records (CDR)', details: '8 phone calls logged past midnight', confidenceRating: '87% High' },
        { associateId: 'Accused_210', associateName: 'Accused_210', evidenceType: 'Shared Jurisdiction', details: 'Co-located at Electronic City checkpost', confidenceRating: '82% Med' }
      ],
      centralityScore: 0.72,
      isKingpin: false
    },
    {
      id: 'Accused_78',
      name: 'Accused_78',
      crimeTypes: ['Chain Snatching', 'Theft'],
      policeStation: 'Jayanagar PS',
      priorCases: 5,
      connections: ['Accused_12', 'Accused_45', 'Accused_315'],
      connectionEvidence: [
        { associateId: 'Accused_12', associateName: 'Accused_12 (Kingpin)', evidenceType: 'Call Detail Records (CDR)', details: '18 phone calls logged during incident dates', confidenceRating: '95% High' },
        { associateId: 'Accused_315', associateName: 'Accused_315', evidenceType: 'Co-Accused in FIR', details: 'Arrested together in chain snatching FIR-2024-00891', confidenceRating: '94% High' }
      ],
      centralityScore: 0.68,
      isKingpin: false
    },
    {
      id: 'Accused_102',
      name: 'Accused_102 (Sub-Hub)',
      crimeTypes: ['Burglary', 'Vehicle Theft'],
      policeStation: 'Indiranagar PS',
      priorCases: 6,
      connections: ['Accused_12', 'Accused_412', 'Accused_501'],
      connectionEvidence: [
        { associateId: 'Accused_12', associateName: 'Accused_12 (Kingpin)', evidenceType: 'Shared Jurisdiction', details: 'Receiving stolen vehicles for inter-state resale', confidenceRating: '89% High' },
        { associateId: 'Accused_412', associateName: 'Accused_412', evidenceType: 'Co-Accused in FIR', details: 'Co-accused in vehicle theft FIR-2024-00512', confidenceRating: '91% High' }
      ],
      centralityScore: 0.81,
      isKingpin: true
    },
    {
      id: 'Accused_156',
      name: 'Accused_156',
      crimeTypes: ['Drug Trafficking'],
      policeStation: 'BTM Layout PS',
      priorCases: 3,
      connections: ['Accused_12', 'Accused_210'],
      connectionEvidence: [
        { associateId: 'Accused_12', associateName: 'Accused_12 (Kingpin)', evidenceType: 'Common Prison Record', details: 'Parappana Agrahara prison block co-inmate record', confidenceRating: '92% High' }
      ],
      centralityScore: 0.55,
      isKingpin: false
    },
    {
      id: 'Accused_210',
      name: 'Accused_210',
      crimeTypes: ['Assault', 'Drug Trafficking'],
      policeStation: 'Electronic City PS',
      priorCases: 2,
      connections: ['Accused_45', 'Accused_156'],
      centralityScore: 0.44,
      isKingpin: false
    },
    {
      id: 'Accused_315',
      name: 'Accused_315',
      crimeTypes: ['Chain Snatching'],
      policeStation: 'Cubbon Park PS',
      priorCases: 4,
      connections: ['Accused_78'],
      centralityScore: 0.38,
      isKingpin: false
    },
    {
      id: 'Accused_412',
      name: 'Accused_412',
      crimeTypes: ['Vehicle Theft'],
      policeStation: 'Whitefield PS',
      priorCases: 3,
      connections: ['Accused_102'],
      centralityScore: 0.42,
      isKingpin: false
    },
    {
      id: 'Accused_501',
      name: 'Accused_501',
      crimeTypes: ['Cyber Crime', 'Fraud'],
      policeStation: 'HSR Layout PS',
      priorCases: 5,
      connections: ['Accused_102'],
      centralityScore: 0.51,
      isKingpin: false
    },
  ];
}

export const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  { id: 'AUD-901', timestamp: '2026-07-23 20:45:12', userRole: 'State DGP', action: 'STATEWIDE_RISK_QUERY', details: 'Queried 30-day spatio-temporal predictions for Hubballi-Dharwad', ipAddress: '10.240.12.89', status: 'AUTHORIZED' },
  { id: 'AUD-902', timestamp: '2026-07-23 20:41:05', userRole: 'District SP', action: 'NETWORK_LINK_DEEP_SEARCH', details: 'Extracted gang centrality matrix for Accused_12 in Jayanagar PS', ipAddress: '10.240.44.12', status: 'AUTHORIZED' },
  { id: 'AUD-903', timestamp: '2026-07-23 20:30:00', userRole: 'Station Inspector', action: 'CASE_PRIORITY_ESCALATION', details: 'Escalated FIR-2025-00142 to Special Task Force', ipAddress: '10.240.88.55', status: 'AUTHORIZED' },
  { id: 'AUD-904', timestamp: '2026-07-23 20:15:33', userRole: 'Constable', action: 'RESTRICTED_DATA_ATTEMPT', details: 'Attempted access to DGP-level predictive threat forecast', ipAddress: '10.240.99.04', status: 'ALERT_FLAG' },
];
