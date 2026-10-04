import React from 'react';
import { 
  Shield, 
  BookOpen, 
  Video, 
  CheckCircle2, 
  Flame, 
  Activity, 
  FileText, 
  Sparkles, 
  User, 
  Languages, 
  Calendar,
  LogOut
} from 'lucide-react';
import { UserProfile, LanguagePreference, ExamStage } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onUpdateLanguage: (lang: LanguagePreference) => void;
  onUpdateStage: (stage: ExamStage) => void;
  onOpenProfile: () => void;
  onOpenAiMentor: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onUpdateLanguage,
  onUpdateStage,
  onOpenProfile,
  onOpenAiMentor,
  onLogout,
}) => {
  const isTelugu = userProfile.language === 'Telugu';

  const navItems = [
    { id: 'dashboard', label: isTelugu ? 'డాష్‌బోర్డ్ & స్ట్రాటజీ' : 'Dashboard & Strategy', icon: Calendar },
    { id: 'lectures', label: isTelugu ? 'సబ్జెక్ట్ వారీగా యూట్యూబ్ లెక్చర్లు' : 'YouTube Subject Lectures', icon: Video },
    { id: 'mocktest', label: isTelugu ? 'మాక్ టెస్ట్ ఇంజిన్ (3 గం)' : 'Mock Test Engine (3h)', icon: CheckCircle2 },
    { id: 'dailyquiz', label: isTelugu ? 'డైలీ క్విజ్ & కరెంట్ అఫైర్స్' : 'Daily Quiz & GK', icon: Flame },
    { id: 'pet', label: isTelugu ? 'PET / రన్నింగ్ ట్రాకర్' : 'PET / Physical Benchmark', icon: Activity },
    { id: 'pattern', label: isTelugu ? 'పరీక్షా సరళి & అర్హత' : 'Exam Pattern & Guide', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-sm">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <img src="/logo.svg" alt="APP Emblem" className="w-12 h-12 object-contain shrink-0 drop-shadow-xs" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-display">
                  AP Police Constable
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  SLPRB Prep
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {isTelugu ? 'ఆంధ్రప్రదేశ్ పోలీస్ కానిస్టేబుల్ పరీక్ష అధ్యయన వేదిక' : 'Candidate Assessment & Strategy System'}
              </p>
            </div>
          </div>

          {/* Center / Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Stage Selector Pill */}
            <div className="bg-slate-100 p-0.5 rounded-full border border-slate-200 flex text-xs font-semibold">
              <button
                id="header-stage-prelims-btn"
                onClick={() => onUpdateStage('Prelims')}
                className={`px-3 py-1 rounded-full transition ${
                  userProfile.stage === 'Prelims'
                    ? 'bg-white text-blue-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Prelims
              </button>
              <button
                id="header-stage-mains-btn"
                onClick={() => onUpdateStage('Mains')}
                className={`px-3 py-1 rounded-full transition ${
                  userProfile.stage === 'Mains'
                    ? 'bg-white text-blue-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mains
              </button>
            </div>

            {/* Language Toggle Pill (matching Design HTML) */}
            <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-full border border-slate-200">
              <button
                id="header-lang-en-btn"
                onClick={() => onUpdateLanguage('English')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  !isTelugu 
                    ? 'bg-white shadow-xs text-blue-600 font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                English
              </button>
              <button
                id="header-lang-te-btn"
                onClick={() => onUpdateLanguage('Telugu')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  isTelugu 
                    ? 'bg-white shadow-xs text-blue-600 font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* AI Police Mentor Button */}
            <button
              id="header-ai-mentor-btn"
              onClick={onOpenAiMentor}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden md:inline">{isTelugu ? 'AI పోలీస్ మెంటార్' : 'AI Doubt Mentor'}</span>
              <span className="md:hidden">AI</span>
            </button>

            {/* User Profile Button */}
            <button
              id="header-profile-modal-btn"
              onClick={onOpenProfile}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition"
              title="Candidate Profile & PET Benchmarks"
            >
              <div className="w-6 h-6 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold text-[10px]">
                {userProfile.name ? userProfile.name.charAt(0) : 'C'}
              </div>
              <span className="max-w-[70px] sm:max-w-[100px] truncate font-semibold text-slate-800">
                {userProfile.name || 'Candidate'}
              </span>
            </button>

            {/* Header Direct Logout */}
            <button
              onClick={onLogout}
              className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition"
              title={isTelugu ? 'లాగ్ అవుట్' : 'Sign Out Session'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none py-2 border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
