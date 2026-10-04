import React, { useState } from 'react';
import { 
  X, 
  User, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  Lock, 
  Smartphone, 
  Globe, 
  LogOut, 
  Bell 
} from 'lucide-react';
import { UserProfile, ExamStage, PostPreference, LanguagePreference } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  sessionToken: string | null;
  activeSessions: any[];
  onTerminateSession: (sessionId: string) => Promise<void>;
  onLogoutAllDevices: () => Promise<void>;
  loginActivityLogs: string[];
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  sessionToken,
  activeSessions,
  onTerminateSession,
  onLogoutAllDevices,
  loginActivityLogs,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile states
  const [name, setName] = useState(userProfile.name);
  const [stage, setStage] = useState<ExamStage>(userProfile.stage);
  const [post, setPost] = useState<PostPreference>(userProfile.post);
  const [language, setLanguage] = useState<LanguagePreference>(userProfile.language);
  const [gender, setGender] = useState(userProfile.benchmarks.gender);
  const [heightCm, setHeightCm] = useState(userProfile.benchmarks.heightCm);
  const [chestUnexpandedCm, setChestUnexpandedCm] = useState(userProfile.benchmarks.chestUnexpandedCm);
  const [chestExpandedCm, setChestExpandedCm] = useState(userProfile.benchmarks.chestExpandedCm);
  const [runMinutes, setRunMinutes] = useState(userProfile.benchmarks.run1600mMinutes);
  const [runSeconds, setRunSeconds] = useState(userProfile.benchmarks.run1600mSeconds);
  const [longJumpMeters, setLongJumpMeters] = useState(userProfile.benchmarks.longJumpMeters);
  const [run100mSec, setRun100mSec] = useState(userProfile.benchmarks.run100mSeconds);

  const isTelugu = language === 'Telugu';

  // Physical standards eligibility logic
  const isMale = gender === 'Male';
  const minHeight = isMale ? 167.6 : 152.5;
  const isHeightEligible = heightCm >= minHeight;
  const isChestEligible = !isMale || (chestUnexpandedCm >= 86.3 && (chestExpandedCm - chestUnexpandedCm) >= 5);
  const totalRunSec = runMinutes * 60 + runSeconds;
  const maxRunSec = isMale ? 480 : 630; // 8 mins for male, 10m 30s for female
  const isRunEligible = totalRunSec <= maxRunSec;
  const minLongJump = isMale ? 3.80 : 2.75;
  const isLongJumpEligible = longJumpMeters >= minLongJump;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...userProfile,
      name: name.trim() || 'Candidate',
      stage,
      post,
      language,
      benchmarks: {
        gender,
        heightCm,
        chestUnexpandedCm,
        chestExpandedCm,
        run1600mMinutes: runMinutes,
        run1600mSeconds: runSeconds,
        longJumpMeters,
        run100mSeconds: run100mSec,
      },
    });
    onClose();
  };

  // Humanize user agents slightly
  const getDeviceIconAndName = (ua: string) => {
    const isMobile = /Mobile|Android|iPhone/i.test(ua);
    const browser = /Chrome/i.test(ua) ? 'Chrome' : /Safari/i.test(ua) ? 'Safari' : /Firefox/i.test(ua) ? 'Firefox' : 'Web Browser';
    return {
      isMobile,
      name: `${isMobile ? 'Mobile' : 'Desktop'} (${browser})`
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 text-slate-800 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              {isTelugu ? 'అభ్యర్థి పోర్టల్ సెట్టింగులు' : 'Candidate Portal Settings'}
            </h2>
            <p className="text-xs text-slate-500">
              {isTelugu
                ? 'మీ ప్రొఫైల్ వివరాలను సవరించండి మరియు సెక్యూరిటీ యాక్టివ్ సెషన్లను నిర్వహించండి'
                : 'Configure candidate profile details, PMT benchmarks, and audit active sessions'}
            </p>
          </div>
        </div>

        {/* Tabs Controller */}
        <div className="flex border-b border-slate-200 mb-6 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 py-3 px-4 font-bold border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{isTelugu ? 'ప్రొఫైల్ & శారీరక ప్రమాణాలు' : 'Profile & Standards'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center space-x-2 py-3 px-4 font-bold border-b-2 transition ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{isTelugu ? 'సెక్యూరిటీ & యాక్టివ్ సెషన్స్' : 'Security & Sessions'}</span>
          </button>
        </div>

        {/* TAB 1: PROFILE & PHYSICAL STATS FORM */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Candidate & Exam Details */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{isTelugu ? 'పరీక్ష ప్రాధాన్యతలు' : 'Exam & Target Preferences'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isTelugu ? 'అభ్యర్థి పేరు' : 'Candidate Full Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. K. Suresh"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isTelugu ? 'పరిశీలన దశ' : 'Preparation Stage'}
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as ExamStage)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="Prelims">Prelims (Preliminary Written Test - 200 Marks)</option>
                    <option value="Mains">Mains (Final Written Test - 200/100 Marks)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isTelugu ? 'పోస్ట్ ప్రాధాన్యత' : 'Target Post Category'}
                  </label>
                  <select
                    value={post}
                    onChange={(e) => setPost(e.target.value as PostPreference)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="Civil Constable">Civil Police Constable (Scored out of 200)</option>
                    <option value="AR (Armed Reserve)">AR - Armed Reserve (Scored out of 100 + PET)</option>
                    <option value="APSP (Special Police)">APSP - Special Police (Scored out of 100 + PET)</option>
                    <option value="Warder / Fireman">Prisons Warder / Fireman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isTelugu ? 'భాషా ప్రాధాన్యత' : 'Preferred Language'}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as LanguagePreference)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="English">English</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Physical Standards */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>{isTelugu ? 'శారీరక ప్రమాణాలు (PET / PMT)' : 'Physical Standards (PET / PMT)'}</span>
                </h3>
                <div className="flex space-x-2 text-xs">
                  {(['Male', 'Female'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`px-3 py-1 rounded-md font-semibold transition ${
                        gender === g ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                {/* Height */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">{isTelugu ? 'ఎత్తు (సెం.మీ)' : 'Height (cm)'}</span>
                    {isHeightEligible ? (
                      <span className="text-emerald-700 flex items-center text-[10px] font-bold"><CheckCircle className="w-3 h-3 mr-0.5" /> OK</span>
                    ) : (
                      <span className="text-red-700 flex items-center text-[10px] font-bold"><AlertTriangle className="w-3 h-3 mr-0.5" /> Low</span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Min: {minHeight} cm</span>
                </div>

                {/* Chest */}
                {isMale && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-700">{isTelugu ? 'ఛాతీ (సెం.మీ)' : 'Chest Normal (cm)'}</span>
                      {isChestEligible ? (
                        <span className="text-emerald-700 flex items-center text-[10px] font-bold"><CheckCircle className="w-3 h-3 mr-0.5" /> OK</span>
                      ) : (
                        <span className="text-red-700 flex items-center text-[10px] font-bold"><AlertTriangle className="w-3 h-3 mr-0.5" /> Check</span>
                      )}
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={chestUnexpandedCm}
                      onChange={(e) => setChestUnexpandedCm(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">Min: 86.3 cm (+5 exp)</span>
                  </div>
                )}

                {/* 1600m Run */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">{isTelugu ? '1600 మీ రన్ కాలం' : '1600m Run Time'}</span>
                    {isRunEligible ? (
                      <span className="text-emerald-700 flex items-center text-[10px] font-bold"><CheckCircle className="w-3 h-3 mr-0.5" /> Qualified</span>
                    ) : (
                      <span className="text-amber-700 flex items-center text-[10px] font-bold"><AlertTriangle className="w-3 h-3 mr-0.5" /> Slow</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min="4"
                      max="15"
                      value={runMinutes}
                      onChange={(e) => setRunMinutes(parseInt(e.target.value) || 0)}
                      className="w-1/2 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-900 font-mono text-center focus:bg-white focus:border-blue-500"
                    />
                    <span className="text-slate-500 font-bold">m</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={runSeconds}
                      onChange={(e) => setRunSeconds(parseInt(e.target.value) || 0)}
                      className="w-1/2 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-900 font-mono text-center focus:bg-white focus:border-blue-500"
                    />
                    <span className="text-slate-500 font-bold">s</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Qualifying: ≤ {isMale ? '8:00' : '10:30'}</span>
                </div>

                {/* Long Jump */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">{isTelugu ? 'లాంగ్ జంప్' : 'Long Jump (Meters)'}</span>
                    {isLongJumpEligible ? (
                      <span className="text-emerald-700 flex items-center text-[10px] font-bold"><CheckCircle className="w-3 h-3 mr-0.5" /> Qualified</span>
                    ) : (
                      <span className="text-amber-700 flex items-center text-[10px] font-bold"><AlertTriangle className="w-3 h-3 mr-0.5" /> Short</span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.05"
                    value={longJumpMeters}
                    onChange={(e) => setLongJumpMeters(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Min: {minLongJump} m</span>
                </div>

                {/* 100m Sprint */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">{isTelugu ? '100 మీ స్ప్రింట్' : '100m Sprint (sec)'}</span>
                    <span className="text-blue-700 text-[10px] font-bold">PET Event</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={run100mSec}
                    onChange={(e) => setRun100mSec(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Target: ≤ {isMale ? '15.0s' : '18.0s'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-700 transition"
              >
                {isTelugu ? 'రద్దు చేయి' : 'Cancel'}
              </button>
              <button
                type="submit"
                id="profile-save-btn"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition"
              >
                {isTelugu ? 'ప్రొఫైల్ సేవ్ చేయి' : 'Save Profile & Benchmarks'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SECURITY & SESSIONS AUDIT */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            
            {/* Session Audit Header Alert */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900 leading-relaxed">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold">Security Notice:</span> Candidates are advised to audit their logged-in sessions below to prevent unauthorized access to prep credentials. Terminate any unrecognized or inactive sessions immediately.
              </div>
            </div>

            {/* List of Active Device Sessions */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {isTelugu ? 'కనెక్ట్ చేయబడిన పరికరాలు' : 'Active Authenticated Devices'}
                </h4>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                  {activeSessions.length} Active
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activeSessions.map((session, idx) => {
                  const dev = getDeviceIconAndName(session.userAgent);
                  const isCurrent = session.id === sessionToken;
                  return (
                    <div 
                      key={session.id || idx}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                        isCurrent 
                          ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-200' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 text-xs">
                        <span className={`p-2 rounded-lg ${isCurrent ? 'bg-blue-600/10 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                          {dev.isMobile ? <Smartphone className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        </span>
                        <div>
                          <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                            <span>{dev.name}</span>
                            {isCurrent && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-600 text-white tracking-wider">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 space-y-0.5 mt-0.5">
                            <p>IP Address: <span className="font-mono text-slate-700">{session.ip || 'Unknown'}</span></p>
                            <p>Logged In: {session.loginTime}</p>
                          </div>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => onTerminateSession(session.id)}
                          className="px-2.5 py-1.5 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 text-rose-600 rounded-lg text-[11px] font-bold transition flex items-center space-x-1"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security Actions */}
            <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-700">Security Emergency Panic Button</p>
                <p className="text-[10px] text-slate-500">Instantly sign out and clear tokens from all active devices.</p>
              </div>
              <button
                type="button"
                onClick={onLogoutAllDevices}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-slate-200 text-xs font-extrabold rounded-xl transition flex items-center space-x-1.5 shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of All Devices</span>
              </button>
            </div>

            {/* Real-time security notifications log (Login Activity Notifications) */}
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-500" />
                <span>{isTelugu ? 'భద్రతా కార్యకలాపాలు' : 'Security Log / Login Activity'}</span>
              </h4>
              <div className="bg-slate-950 text-slate-300 font-mono text-[10px] p-3 rounded-lg border border-slate-900 space-y-1.5 max-h-32 overflow-y-auto">
                {loginActivityLogs.length === 0 ? (
                  <p className="text-slate-600 italic text-center py-1">No security notifications recorded in this session.</p>
                ) : (
                  loginActivityLogs.map((log, lidx) => (
                    <div key={lidx} className="flex items-start space-x-1.5">
                      <span className="text-emerald-500 shrink-0">✔</span>
                      <span className="leading-relaxed">{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer Close Controls */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition"
              >
                Close Settings
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
