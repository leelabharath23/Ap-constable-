import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Plus, 
  RotateCcw, 
  Check,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { UserProfile } from '../types';

interface DailyStudyReminderBadgeProps {
  userProfile: UserProfile;
  onNavigateToLectures?: () => void;
  onNavigateToQuiz?: () => void;
}

interface DailyStudyData {
  date: string;
  loggedHours: number;
  targetHours: number;
}

export const DailyStudyReminderBadge: React.FC<DailyStudyReminderBadgeProps> = ({
  userProfile,
  onNavigateToLectures,
  onNavigateToQuiz,
}) => {
  const isTelugu = userProfile.language === 'Telugu';
  const todayDateStr = new Date().toISOString().split('T')[0];

  // Load or initialize daily study tracker state
  const [studyData, setStudyData] = useState<DailyStudyData>(() => {
    try {
      const saved = localStorage.getItem('ap_police_daily_study_hours');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayDateStr) {
          return parsed;
        }
      }
    } catch {}
    return {
      date: todayDateStr,
      loggedHours: 2.5,
      targetHours: 6.0,
    };
  });

  const [showLogControls, setShowLogControls] = useState(false);

  // Initialize Recharts History Data (Study Hours vs Goal) for the last 7 days
  const [historyData, setHistoryData] = useState(() => {
    try {
      const saved = localStorage.getItem('ap_police_study_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { day: 'Mon', Study: 5.5, Goal: 6.0 },
      { day: 'Tue', Study: 6.2, Goal: 6.0 },
      { day: 'Wed', Study: 4.0, Goal: 6.0 },
      { day: 'Thu', Study: 7.1, Goal: 6.0 },
      { day: 'Fri', Study: 3.5, Goal: 6.0 },
      { day: 'Sat', Study: 5.0, Goal: 6.0 },
      { day: 'Today', Study: 2.5, Goal: 6.0 },
    ];
  });

  // Sync studyData to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ap_police_daily_study_hours', JSON.stringify(studyData));
    } catch {}
  }, [studyData]);

  // Sync today's logged hours dynamically to the Recharts history list
  useEffect(() => {
    setHistoryData(prev => {
      const updated = [...prev];
      const todayIdx = updated.findIndex(d => d.day === 'Today');
      if (todayIdx !== -1) {
        updated[todayIdx] = {
          ...updated[todayIdx],
          Study: studyData.loggedHours,
          Goal: studyData.targetHours
        };
      }
      try {
        localStorage.setItem('ap_police_study_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [studyData.loggedHours, studyData.targetHours]);

  const remainingHours = Math.max(0, Number((studyData.targetHours - studyData.loggedHours).toFixed(1)));
  const completionPct = Math.min(100, Math.round((studyData.loggedHours / studyData.targetHours) * 100));
  const isTargetAchieved = remainingHours <= 0;

  // Add study hours
  const handleAddHours = (hoursToAdd: number) => {
    setStudyData(prev => ({
      ...prev,
      date: todayDateStr,
      loggedHours: Number(Math.min(14, prev.loggedHours + hoursToAdd).toFixed(1)),
    }));
  };

  // Reset today
  const handleReset = () => {
    setStudyData({
      date: todayDateStr,
      loggedHours: 0,
      targetHours: studyData.targetHours,
    });
  };

  // Mark target complete
  const handleMarkComplete = () => {
    setStudyData(prev => ({
      ...prev,
      loggedHours: prev.targetHours,
    }));
  };

  return (
    <div 
      id="daily-study-reminder-badge-container" 
      className={`rounded-xl border transition-all duration-300 shadow-xs overflow-hidden ${
        isTargetAchieved
          ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-300/60'
          : 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300/60'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Left: Reminder Badge and Message */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Daily Reminder Pill */}
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isTargetAchieved
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-amber-500 text-white shadow-xs'
              }`}>
                {isTargetAchieved ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
                <span>
                  {isTargetAchieved 
                    ? (isTelugu ? 'లక్ష్యం పూర్తయింది' : 'Target Achieved') 
                    : (isTelugu ? 'నేటి స్టడీ రిమైండర్' : 'Daily Reminder')}
                </span>
              </span>

              {/* 4-Month Strategy Tag */}
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700">
                {isTelugu ? '4-నెలల ప్రిపరేషన్ వ్యూహం' : '4-Month Strategy Pace'}
              </span>

              <span className="text-xs font-mono font-bold text-slate-600">
                {studyData.loggedHours}h / {studyData.targetHours}h {isTelugu ? 'పూర్తయింది' : 'done'} ({completionPct}%)
              </span>
            </div>

            {/* Main Remaining Hours Headline */}
            <div className="flex items-center space-x-2 pt-0.5">
              <h3 className={`text-base sm:text-lg font-black tracking-tight ${
                isTargetAchieved ? 'text-emerald-950' : 'text-amber-950'
              }`}>
                {isTargetAchieved ? (
                  <span>
                    🎉 {isTelugu 
                      ? `ఈరోజు లక్ష్యం నెరవేరింది! (${studyData.loggedHours} గంటల అధ్యయనం పూర్తి)` 
                      : `Daily target completed! (${studyData.loggedHours} hrs logged today)`}
                  </span>
                ) : (
                  <span>
                    ⏱️ {isTelugu
                      ? `నేడు ఇంకా ${remainingHours} గంటల అధ్యయనం అవసరం`
                      : `${remainingHours} hrs study remaining today to stay on track`}
                  </span>
                )}
              </h3>
            </div>

            {/* Subtitle / Roadmap Explanation */}
            <p className={`text-xs ${isTargetAchieved ? 'text-emerald-800' : 'text-amber-800'} max-w-2xl leading-relaxed`}>
              {isTargetAchieved
                ? (isTelugu 
                    ? 'అద్భుతం! మీరు 4-నెలల పోలీస్ కానిస్టేబుల్ టైమ్‌లైన్‌కు అనుగుణంగా సరైన వేగంతో చదువుతున్నారు. రేపటి కోసం రిలాక్స్ అవ్వండి లేదా రివిజన్ చేయండి.'
                    : "Outstanding consistency! You've met today's 4-month benchmark. Keep up this discipline to master the 200-mark syllabus.")
                : (isTelugu 
                    ? `4-నెలల వ్యూహం ప్రకారం ప్రతిరోజూ ${studyData.targetHours} గంటల అధ్యయనం అవసరం (అంకగణితం, రీజనింగ్, జనరల్ స్టడీస్, ఇంగ్లీష్ మరియు రివిజన్).`
                    : `To complete all 27 video lectures and 200-mark syllabus in 4 months, a daily pace of ${studyData.targetHours} hours is required.`)}
            </p>

            {/* Visual Progress Bar */}
            <div className="w-full max-w-xl bg-white/70 h-2.5 rounded-full overflow-hidden border border-slate-200/80 mt-2">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  isTargetAchieved ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          {/* Right: Interactive Quick-Log Controls */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full md:w-auto">
            <div className="flex items-center space-x-1.5 bg-white/90 p-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => handleAddHours(0.5)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                title="Log 30 Minutes of study"
              >
                <Plus className="w-3 h-3" />
                <span>30m</span>
              </button>

              <button
                onClick={() => handleAddHours(1.0)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                title="Log 1 Hour of study"
              >
                <Plus className="w-3 h-3" />
                <span>1h</span>
              </button>

              <button
                onClick={handleMarkComplete}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-2xs cursor-pointer"
                title="Mark today's target achieved"
              >
                <Check className="w-3 h-3" />
                <span>{isTelugu ? 'పూర్తి' : 'Done'}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                title="Reset today's logged hours"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle advanced schedule breakdown & Recharts analytics */}
            <button
              onClick={() => setShowLogControls(!showLogControls)}
              className="px-3 py-2 bg-white/80 hover:bg-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition text-center cursor-pointer flex items-center justify-center space-x-1"
            >
              <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {showLogControls 
                  ? (isTelugu ? 'విశ్లేషణ దాచు' : 'Hide Analysis') 
                  : (isTelugu ? 'రోడ్ మ్యాప్ విశ్లేషణ' : 'View Analytics')}
              </span>
            </button>
          </div>
        </div>

        {/* Collapsible Recommended Daily Study Schedule + Recharts Bar Chart */}
        {showLogControls && (
          <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-6">
            
            {/* Grid 1: Daily Target Weightage Breakdown */}
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-2.5">
                {isTelugu ? '4-నెలల వ్యూహాత్మక రోజువారీ ప్రణాళిక' : 'Recommended 4-Month Strategic Daily Split'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/85 p-3 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>📐 {isTelugu ? 'అంకగణితం' : 'Arithmetic & Quant'}</span>
                    <span className="font-mono text-blue-600">2.0 hrs</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isTelugu ? 'కాన్సెప్ట్ వీడియోలు + 30 షార్ట్‌కట్ లెక్కలు' : '1 Video lecture + 30 shortcut practice problems'}
                  </p>
                </div>

                <div className="bg-white/85 p-3 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>🧠 {isTelugu ? 'రీజనింగ్' : 'Reasoning Ability'}</span>
                    <span className="font-mono text-blue-600">1.5 hrs</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isTelugu ? 'కోడింగ్-డీకోడింగ్, పజిల్స్ & డైరెక్షన్స్' : 'Coding, Puzzles, Blood Relations & Speed tests'}
                  </p>
                </div>

                <div className="bg-white/85 p-3 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>🏛️ {isTelugu ? 'జనరల్ స్టడీస్' : 'General Studies & AP'}</span>
                    <span className="font-mono text-blue-600">1.5 hrs</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isTelugu ? 'ఇండియన్ పాలిటీ & ఏపీ విభజన చట్టం 2014' : 'Polity, AP History, Geography & Daily Current Affairs'}
                  </p>
                </div>

                <div className="bg-white/85 p-3 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>📖 {isTelugu ? 'ఇంగ్లీష్ & రివిజన్' : 'English & Revision'}</span>
                    <span className="font-mono text-blue-600">1.0 hr</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isTelugu ? 'గ్రామర్ నియమాలు + 10 నిమిషాల డైలీ క్విజ్' : 'Grammar rules drills + Daily 10-Min Speed Quiz'}
                  </p>
                </div>
              </div>
            </div>

            {/* Grid 2: RECHARTS BAR CHART VISUALIZATION */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-inner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-2.5">
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center space-x-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isTelugu ? '7-రోజుల అధ్యయన స్థిరత్వ విశ్లేషణ' : '7-Day Study Consistency Audit'}</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isTelugu 
                      ? 'రోజూ 6 గంటల సన్నద్ధత లక్ష్యంతో మీ సగటు పోలిక పట్టిక' 
                      : 'Auditing daily logged study hours vs. the 6.0h target required for the 4-month timeline'}
                  </p>
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                  {isTelugu ? 'రోజువారీ నివేదిక' : 'Daily Goal: 6.0h'}
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="h-60 w-full mt-2 font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={historyData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} 
                      stroke="#cbd5e1" 
                    />
                    <YAxis 
                      tick={{ fill: '#475569', fontSize: 10 }} 
                      stroke="#cbd5e1" 
                      domain={[0, 10]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '11px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                      }}
                      labelStyle={{ fontWeight: 'bold', color: '#38bdf8', marginBottom: '4px' }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '12px' }} 
                    />
                    {/* Golden Strategy Reference target line */}
                    <ReferenceLine 
                      y={studyData.targetHours} 
                      stroke="#f59e0b" 
                      strokeDasharray="4 4" 
                      label={{ 
                        value: isTelugu ? 'లక్ష్యం వేగం' : 'Target Goal', 
                        fill: '#d97706', 
                        fontSize: 9, 
                        fontWeight: 'bold', 
                        position: 'top' 
                      }} 
                    />
                    {/* Logged study hours */}
                    <Bar 
                      dataKey="Study" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={28} 
                      name={isTelugu ? 'పూర్తి చేసిన అధ్యయనం (గంటలు)' : 'Logged Study Hours'} 
                    />
                    {/* Goal weightage */}
                    <Bar 
                      dataKey="Goal" 
                      fill="#e2e8f0" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={28} 
                      name={isTelugu ? 'లక్ష్యం వేగం (గంటలు)' : 'Strategy Goal Pace'} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
