import React, { useState } from 'react';
import { 
  Activity, 
  Award, 
  Timer, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Zap, 
  Info, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { UserProfile, LanguagePreference } from '../types';

interface PhysicalFitnessTrackerProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onOpenProfileModal: () => void;
}

export const PhysicalFitnessTracker: React.FC<PhysicalFitnessTrackerProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenProfileModal,
}) => {
  const isTelugu = userProfile.language === 'Telugu';
  const { benchmarks, post } = userProfile;
  const isMale = benchmarks.gender === 'Male';

  // Calculator states
  const totalRunSec = benchmarks.run1600mMinutes * 60 + benchmarks.run1600mSeconds;
  
  // Qualification thresholds according to AP SLPRB standards:
  // Male: 1600m in <= 8 mins (480s); Long Jump >= 3.80m; 100m <= 15.0s
  // Female: 1600m in <= 10m 30s (630s); Long Jump >= 2.75m; 100m <= 18.0s
  const qualifyingRunSec = isMale ? 480 : 630;
  const isRunQualified = totalRunSec <= qualifyingRunSec;
  const minLongJump = isMale ? 3.80 : 2.75;
  const isLongJumpQualified = benchmarks.longJumpMeters >= minLongJump;
  const max100m = isMale ? 15.0 : 18.0;
  const is100mQualified = benchmarks.run100mSeconds <= max100m;

  // Height & Chest standards
  const minHeight = isMale ? 167.6 : 152.5;
  const isHeightQualified = benchmarks.heightCm >= minHeight;
  const chestExpansion = benchmarks.chestExpandedCm - benchmarks.chestUnexpandedCm;
  const isChestQualified = !isMale || (benchmarks.chestUnexpandedCm >= 86.3 && chestExpansion >= 5);

  // PET Marks Scoring calculation for AR / APSP posts:
  // In AP Police Constable for AR/APSP, PET carries marks out of 100:
  // 1600m run carries highest weightage (approx 40 marks), Long jump (30 marks), 100m run (30 marks).
  const calculateEstimatedPetMarks = () => {
    if (!isRunQualified || !isLongJumpQualified) return 0;
    
    // 1600m run points scale (out of 40)
    let runMarks = 20; // base pass
    if (totalRunSec <= 360) runMarks = 40; // under 6:00
    else if (totalRunSec <= 390) runMarks = 36; // under 6:30
    else if (totalRunSec <= 420) runMarks = 32; // under 7:00
    else if (totalRunSec <= 450) runMarks = 26; // under 7:30
    else runMarks = 20; // under 8:00

    // Long Jump points scale (out of 30)
    let jumpMarks = 15;
    if (benchmarks.longJumpMeters >= 4.5) jumpMarks = 30;
    else if (benchmarks.longJumpMeters >= 4.2) jumpMarks = 26;
    else if (benchmarks.longJumpMeters >= 4.0) jumpMarks = 22;
    else if (benchmarks.longJumpMeters >= 3.8) jumpMarks = 18;
    else jumpMarks = 15;

    // 100m sprint points scale (out of 30)
    let sprintMarks = 15;
    if (benchmarks.run100mSeconds <= 12.5) sprintMarks = 30;
    else if (benchmarks.run100mSeconds <= 13.5) sprintMarks = 26;
    else if (benchmarks.run100mSeconds <= 14.5) sprintMarks = 22;
    else sprintMarks = 18;

    return Math.min(100, runMarks + jumpMarks + sprintMarks);
  };

  const petEstimatedScore = calculateEstimatedPetMarks();
  const isArApsp = post.includes('AR') || post.includes('APSP');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              <span>AP SLPRB Physical Efficiency Test (PET) & Measurement (PMT)</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              {isTelugu ? 'శారీరక ప్రమాణాలు & గ్రౌండ్ బెంచ్‌మార్క్ ట్రాకర్' : 'PET / Physical Benchmark & Field Test Tracker'}
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
              {isTelugu
                ? '1600 మీ రన్నింగ్, లాంగ్ జంప్ మరియు కొలతలను ట్రాక్ చేయండి. సివిల్ పోస్టులకు ఇది క్వాలిఫైయింగ్ మాత్రమే కాగా, AR / APSP పోస్టులకు మెరిట్ మార్కులు కేటాయించబడతాయి.'
                : 'Track your 1600m run, long jump, and sprint benchmark times. For Civil posts, PET is qualifying; for AR/APSP posts, PET performance adds directly to your final merit score.'}
            </p>
          </div>

          <button
            onClick={onOpenProfileModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center space-x-1.5 shrink-0"
          >
            <span>{isTelugu ? 'కొలతలు సవరించండి' : 'Edit Benchmarks'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AR / APSP Merit Score Callout */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl border border-blue-200 text-blue-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isTelugu ? 'లక్ష్య పోస్ట్ & అర్హత విధానం' : 'Post Category Scoring Rule'}
              </div>
              <div className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <span>{post}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  {isArApsp ? 'PET Scored (100 Marks)' : 'PET Qualifying Only'}
                </span>
              </div>
            </div>
          </div>

          {isArApsp ? (
            <div className="text-right">
              <span className="text-xs text-slate-500 block">{isTelugu ? 'అంచనా వేసిన PET స్కోరు' : 'Estimated PET Merit Score'}</span>
              <span className="text-2xl font-black text-blue-600 font-display">{petEstimatedScore} / 100</span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-xs text-slate-500 block">{isTelugu ? 'క్వాలిఫైయింగ్ హోదా' : 'Civil Qualification Status'}</span>
              <span className={`text-base font-bold ${
                isRunQualified && isLongJumpQualified && isHeightQualified
                  ? 'text-emerald-600'
                  : 'text-amber-600'
              }`}>
                {isRunQualified && isLongJumpQualified && isHeightQualified ? 'All Events Qualified' : 'Work in Progress'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3 Core Field Events Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1600m Run */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">1600m Run (1.6 km)</h3>
                <span className="text-[11px] text-slate-500">{isTelugu ? 'ప్రధాన పరుగు పరీక్ష' : 'Endurance Milestone'}</span>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 ${
              isRunQualified
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {isRunQualified ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
              <span>{isRunQualified ? 'Qualified' : 'Exceeds Time'}</span>
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-xs text-slate-500 block mb-1">{isTelugu ? 'మీ ప్రస్తుత సమయం' : 'Current Benchmark Time'}</span>
            <div className="text-3xl font-black text-slate-900 font-mono">
              {benchmarks.run1600mMinutes}m {benchmarks.run1600mSeconds.toString().padStart(2, '0')}s
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Cutoff Limit: ≤ {isMale ? '8 mins 00s' : '10 mins 30s'}
            </span>
          </div>

          {/* Pace Guide */}
          <div className="text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">400m Lap Target:</span>
              <span className="font-semibold text-slate-900">
                ~{(totalRunSec / 4).toFixed(0)} seconds / lap
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Top AR/APSP Score:</span>
              <span className="font-semibold text-blue-600">&lt; 6 mins 30s (36+ Pts)</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              💡 Tip: Maintain even breathing across laps 1-3, accelerate on final 300m bend.
            </p>
          </div>
        </div>

        {/* Long Jump */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Long Jump</h3>
                <span className="text-[11px] text-slate-500">{isTelugu ? 'లాంగ్ జంప్' : 'Horizontal Jump Event'}</span>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 ${
              isLongJumpQualified
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {isLongJumpQualified ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
              <span>{isLongJumpQualified ? 'Qualified' : 'Short'}</span>
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-xs text-slate-500 block mb-1">{isTelugu ? 'మీ ప్రస్తుత దూరం' : 'Current Best Jump'}</span>
            <div className="text-3xl font-black text-slate-900 font-mono">
              {benchmarks.longJumpMeters.toFixed(2)} m
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Min Qualifying: ≥ {minLongJump} meters
            </span>
          </div>

          <div className="text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Target Range:</span>
              <span className="font-semibold text-slate-900">4.20m - 4.50m</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Chances allowed:</span>
              <span className="font-semibold text-blue-600">3 official attempts</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              💡 Tip: Focus on explosive takeoff without stepping over the foul line board.
            </p>
          </div>
        </div>

        {/* 100m Sprint */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">100m Sprint</h3>
                <span className="text-[11px] text-slate-500">{isTelugu ? '100 మీటర్ల స్ప్రింట్' : 'Speed & Acceleration'}</span>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 ${
              is100mQualified
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {is100mQualified ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
              <span>{is100mQualified ? 'Qualified' : 'Improve'}</span>
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-xs text-slate-500 block mb-1">{isTelugu ? 'మీ రికార్డ్ సమయం' : 'Current Best Time'}</span>
            <div className="text-3xl font-black text-slate-900 font-mono">
              {benchmarks.run100mSeconds.toFixed(1)} s
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Target Standard: ≤ {max100m} seconds
            </span>
          </div>

          <div className="text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Elite Benchmark:</span>
              <span className="font-semibold text-emerald-600">&lt; 13.0 seconds</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Chances allowed:</span>
              <span className="font-semibold text-blue-600">1 single attempt</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              💡 Tip: Drive with high knees and arm swing; do not slow down before the finish tape.
            </p>
          </div>
        </div>
      </div>

      {/* PMT Measurement Standards Guide */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>{isTelugu ? 'భౌతిక కొలతల ప్రమాణాలు (PMT Standards)' : 'Official Physical Measurement Standards (PMT)'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1 font-medium">Men (General / BC / SC):</span>
            <div className="font-bold text-slate-900 text-sm">Height ≥ 167.6 cm</div>
            <div className="text-slate-600 mt-0.5">Chest: 86.3 cm (Exp: +5 cm)</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1 font-medium">Men (ST Agency Areas):</span>
            <div className="font-bold text-slate-900 text-sm">Height ≥ 160.0 cm</div>
            <div className="text-slate-600 mt-0.5">Chest: 80.0 cm (Exp: +3 cm)</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1 font-medium">Women (General / BC / SC):</span>
            <div className="font-bold text-slate-900 text-sm">Height ≥ 152.5 cm</div>
            <div className="text-slate-600 mt-0.5">Weight ≥ 40 kg (No chest test)</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1 font-medium">Women (ST Agency Areas):</span>
            <div className="font-bold text-slate-900 text-sm">Height ≥ 150.0 cm</div>
            <div className="text-slate-600 mt-0.5">Weight ≥ 38 kg</div>
          </div>
        </div>
      </div>
    </div>
  );
};
