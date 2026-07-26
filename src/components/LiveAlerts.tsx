import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle, Radio, Volume2, Filter } from 'lucide-react';

interface AlertItem {
  id: string;
  time: string;
  district: string;
  policeStation: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH RISK' | 'ELEVATED' | 'AMBER ALERT';
  description: string;
  actionTaken: boolean;
}

export const LiveAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'ALT-9041',
      time: '10 Mins Ago (22:05 IST)',
      district: 'Bengaluru Urban',
      policeStation: 'Jayanagar PS',
      title: '🔴 CRITICAL: Syndicate Kingpin Accused_12 Location Activity',
      severity: 'CRITICAL',
      description: 'CDR co-location triangulation detected 18 phone connections past midnight between Accused_12 and Accused_78 near 4th Block Jayanagar. High burglary / drug trafficking risk.',
      actionTaken: false
    },
    {
      id: 'ALT-9042',
      time: '24 Mins Ago (21:50 IST)',
      district: 'Belagavi',
      policeStation: 'Camp Police Station',
      title: '⚡ AMBER ALERT: Escaped Recidivism Suspect Boundary Crossing',
      severity: 'AMBER ALERT',
      description: 'Escaped suspect with 5 prior motor vehicle theft charges spotted moving along NH-48 towards Hubballi. ANPR highway camera flag triggered.',
      actionTaken: false
    },
    {
      id: 'ALT-9043',
      time: '45 Mins Ago (21:30 IST)',
      district: 'Bengaluru Urban',
      policeStation: 'Koramangala PS',
      title: '⚠️ HIGH RISK: Spatio-Temporal Burglary Anomaly (+2.5σ)',
      severity: 'HIGH RISK',
      description: 'Statistical crime forecast algorithms flagged a 2.5 sigma anomaly spike for afternoon residential burglaries between 14:00 - 16:00 IST in Koramangala 5th Block.',
      actionTaken: true
    },
    {
      id: 'ALT-9044',
      time: '1 Hour Ago (21:15 IST)',
      district: 'Dakshina Kannada',
      policeStation: 'Mangaluru North PS',
      title: '🟡 ELEVATED: Chain Snatching Cluster Alert',
      severity: 'ELEVATED',
      description: '3 motorcycle-borne chain snatching incidents logged within 45 minutes along MG Road. Motorcycle patrol units dispatched.',
      actionTaken: true
    },
    {
      id: 'ALT-9045',
      time: '2 Hours Ago (20:15 IST)',
      district: 'Mysuru',
      policeStation: 'Devaraja PS',
      title: '🟡 ELEVATED: Cyber Fraud Ring Financial Intercept',
      severity: 'ELEVATED',
      description: 'Multiple phishing complaint calls originating from fake bank customer executive numbers targeting senior citizens in Gokulam.',
      actionTaken: true
    }
  ]);

  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const toggleAction = (alertObj: AlertItem) => {
    // 1. Immediately update the UI
    setAlerts(prev => prev.map(a => a.id === alertObj.id ? { ...a, actionTaken: !a.actionTaken } : a));

    // 2. Dispatch Silently via Twilio SMS
    if (!alertObj.actionTaken) {
      const twilioSid = import.meta.env.VITE_TWILIO_SID || "";
      const twilioAuth = import.meta.env.VITE_TWILIO_AUTH || "";
      const twilioFrom = import.meta.env.VITE_TWILIO_FROM || "+15342483874";
      const onDutyOfficerPhone = import.meta.env.VITE_TWILIO_TO || "+919787275491";
      
      const message = `🚨 KSP DISPATCH: ${alertObj.title}. Loc: ${alertObj.district} (${alertObj.policeStation}). Respond immediately.`;
      
      const formData = new URLSearchParams();
      formData.append('To', onDutyOfficerPhone);
      formData.append('From', twilioFrom);
      formData.append('Body', message);

      const targetUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

      // Completely silent background API call!
      fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${twilioSid}:${twilioAuth}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      })
      .then(res => res.json())
      .then(data => console.log("Twilio Success:", data))
      .catch(err => console.error("Twilio Dispatch error:", err));
    }
  };

  const filteredAlerts = alerts.filter(a => selectedSeverity === 'ALL' || a.severity === selectedSeverity);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <span>Crucial Incident Dispatch & Emergency Live Alerts</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time critical incident feed, kingpin location alerts, and high-priority police dispatch alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-amber-400 font-semibold">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Sirens & Sound Alerts: ENABLED</span>
          </div>

          <div className="bg-rose-950/80 text-rose-300 border border-rose-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{alerts.filter(a => !a.actionTaken).length} Active Crucial Alerts</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
        <Filter className="w-4 h-4 text-slate-400 ml-1" />
        <span className="text-slate-300 font-semibold">Filter Priority:</span>
        {['ALL', 'CRITICAL', 'AMBER ALERT', 'HIGH RISK', 'ELEVATED'].map(sev => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(sev)}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
              selectedSeverity === sev
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {filteredAlerts.map(a => {
          let sevColor = 'bg-rose-950/70 border-rose-600 text-rose-200';
          let badgeColor = 'bg-rose-600 text-white';

          if (a.severity === 'AMBER ALERT') {
            sevColor = 'bg-amber-950/70 border-amber-500 text-amber-200';
            badgeColor = 'bg-amber-500 text-slate-950 font-bold';
          } else if (a.severity === 'HIGH RISK') {
            sevColor = 'bg-orange-950/70 border-orange-500 text-orange-200';
            badgeColor = 'bg-orange-500 text-white';
          } else if (a.severity === 'ELEVATED') {
            sevColor = 'bg-slate-900 border-slate-700 text-slate-200';
            badgeColor = 'bg-slate-700 text-slate-200';
          }

          return (
            <div key={a.id} className={`p-4 rounded-xl border ${sevColor} shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition`}>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${badgeColor}`}>
                    {a.severity}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{a.id}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-medium">{a.district} ({a.policeStation})</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-400 text-[11px]">{a.time}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{a.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{a.description}</p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => toggleAction(a)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                    a.actionTaken
                      ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-sm'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{a.actionTaken ? 'Dispatch Actioned' : 'Dispatch Patrol Unit'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
