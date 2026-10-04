import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { StudyStrategyDashboard } from './components/StudyStrategyDashboard';
import { LectureModule } from './components/LectureModule';
import { MockTestEngine } from './components/MockTestEngine';
import { DailyQuizModule } from './components/DailyQuizModule';
import { PhysicalFitnessTracker } from './components/PhysicalFitnessTracker';
import { ExamPatternGuide } from './components/ExamPatternGuide';
import { UserProfileModal } from './components/UserProfileModal';
import { AiMentorModal } from './components/AiMentorModal';
import { LoginPortal } from './components/LoginPortal';
import { UserProfile, ExamStage, LanguagePreference, TestResult } from './types';
import { AlertTriangle, Clock, RefreshCw, ShieldAlert, LogOut } from 'lucide-react';

const INITIAL_PROFILE: UserProfile = {
  name: 'K. Venkatesh',
  stage: 'Prelims',
  post: 'Civil Constable',
  language: 'English',
  benchmarks: {
    gender: 'Male',
    heightCm: 168.5,
    chestUnexpandedCm: 87.0,
    chestExpandedCm: 92.5,
    run1600mMinutes: 7,
    run1600mSeconds: 42,
    longJumpMeters: 4.15,
    run100mSeconds: 13.9,
  },
  completedLectureIds: ['lec-quant-1', 'lec-reason-1'],
  savedOfflineLectureIds: ['lec-quant-1'],
  testHistory: [
    {
      testId: 'mock-test-1',
      testTitle: 'Full Mock Test 1 (Standard 200 Questions)',
      date: 'Yesterday',
      totalScore: 132,
      maxScore: 200,
      correctCount: 132,
      incorrectCount: 38,
      unattemptedCount: 30,
      accuracy: 78,
      timeSpentMinutes: 165,
      subjectBreakdown: {
        arithmetic: { correct: 25, total: 30, score: 25 },
        reasoning: { correct: 22, total: 25, score: 22 },
        general_studies: { correct: 62, total: 80, score: 62 },
        english: { correct: 23, total: 30, score: 23 },
      },
      passedCutoff: true,
      responses: {},
    },
  ],
  quizStreak: 4,
};

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAiMentorOpen, setIsAiMentorOpen] = useState(false);
  const [aiMentorTopic, setAiMentorTopic] = useState<string | undefined>(undefined);

  // Secure Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [loginActivityLogs, setLoginActivityLogs] = useState<string[]>([]);
  
  // Floating Toast Notifications for Login / Logout Events
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'alert' }[]>([]);

  // Inactivity tracking (Dev friendly limit: 120 seconds of inactivity)
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [warningCountdown, setWarningCountdown] = useState(15);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());

  // Push secure activity log
  const addSecurityLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLoginActivityLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  // Push floating feedback toasts
  const triggerToast = (msg: string, type: 'success' | 'alert' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // 1. Initial Load: Verify Stored Tokens & Sessions
  useEffect(() => {
    const token = localStorage.getItem('ap_police_session_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Session invalid');
      })
      .then(data => {
        setSessionToken(token);
        setUserProfile(data.user.profile);
        setActiveSessions(data.sessions || []);
        setIsAuthenticated(true);
        setAuthLoading(false);
        addSecurityLog(`Auto-restored session successfully. Connected from IP: ${data.sessions[0]?.ip || '127.0.0.1'}`);
        triggerToast("Welcome back! Candidate session restored.", "success");
      })
      .catch(() => {
        localStorage.removeItem('ap_police_session_token');
        setIsAuthenticated(false);
        setAuthLoading(false);
      });
    } else {
      setIsAuthenticated(false);
      setAuthLoading(false);
    }
  }, []);

  // 2. Synchronize candidate profile edits back to backend DB
  useEffect(() => {
    if (isAuthenticated && sessionToken) {
      fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ profile: userProfile })
      })
      .then(res => {
        if (!res.ok) console.warn("Failed to sync profile change with server.");
      })
      .catch(err => console.error("Database sync error:", err));
    }
  }, [userProfile, isAuthenticated, sessionToken]);

  // 3. User Authentication Trigger Handlers
  const handleLoginSuccess = (token: string, user: any, sessionsList: any[]) => {
    localStorage.setItem('ap_police_session_token', token);
    setSessionToken(token);
    setUserProfile(user.profile);
    setActiveSessions(sessionsList);
    setIsAuthenticated(true);
    addSecurityLog(`Session authenticated. Candidate ${user.name} logged in.`);
    triggerToast(`Hello ${user.name}! Securely logged in.`, "success");
  };

  const handleLogout = async () => {
    if (sessionToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      }).catch(() => {});
    }
    localStorage.removeItem('ap_police_session_token');
    setSessionToken(null);
    setIsAuthenticated(false);
    setActiveSessions([]);
    setShowInactivityWarning(false);
    addSecurityLog("Candidate logged out.");
    triggerToast("Logged out successfully.", "success");
  };

  const handleTerminateSession = async (targetId: string) => {
    if (!sessionToken) return;
    try {
      const res = await fetch('/api/auth/terminate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ targetSessionId: targetId })
      });
      const data = await res.json();
      if (res.ok) {
        setActiveSessions(data.sessions || []);
        addSecurityLog("Revoked other device session successfully.");
        triggerToast("Other active session terminated.", "alert");
      }
    } catch (err) {
      console.error("Inability to terminate session", err);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!sessionToken) return;
    try {
      await fetch('/api/auth/logout-all', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });
      addSecurityLog("Initiated emergency lockout: Terminated sessions across all devices.");
    } catch {}
    handleLogout();
  };

  // 4. Inactivity Automatic Logout Safeguard
  const resetInactivityTimer = () => {
    lastActivityTimeRef.current = Date.now();
    if (showInactivityWarning) {
      setShowInactivityWarning(false);
      setWarningCountdown(15);
      // Let backend know we are active
      if (sessionToken) {
        fetch('/api/auth/keep-alive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken })
        }).catch(() => {});
      }
    }
  };

  // Set up mouse/keyboard interaction listeners
  useEffect(() => {
    if (!isAuthenticated) {
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      return;
    }

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetInactivityTimer));

    // Check inactivity state every 1 second
    inactivityTimerRef.current = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - lastActivityTimeRef.current) / 1000);
      
      // If idle for 105 seconds (1.75 minutes), trigger the warning modal
      if (elapsedSec >= 105 && !showInactivityWarning) {
        setShowInactivityWarning(true);
        setWarningCountdown(15);
      }
    }, 1000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, resetInactivityTimer));
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, [isAuthenticated, showInactivityWarning]);

  // Handle countdown warning modal subtraction
  useEffect(() => {
    if (showInactivityWarning) {
      countdownTimerRef.current = setInterval(() => {
        setWarningCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current!);
            handleLogout();
            triggerToast("Session automatically terminated due to inactivity.", "alert");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [showInactivityWarning]);


  // Helper functions for user interaction
  const handleUpdateLanguage = (lang: LanguagePreference) => {
    setUserProfile(prev => ({ ...prev, language: lang }));
  };

  const handleUpdateStage = (stage: ExamStage) => {
    setUserProfile(prev => ({ ...prev, stage }));
  };

  const handleToggleCompleteLecture = (lectureId: string) => {
    setUserProfile(prev => {
      const exists = prev.completedLectureIds.includes(lectureId);
      return {
        ...prev,
        completedLectureIds: exists
          ? prev.completedLectureIds.filter(id => id !== lectureId)
          : [...prev.completedLectureIds, lectureId],
      };
    });
  };

  const handleToggleOfflineDownload = (lectureId: string) => {
    setUserProfile(prev => {
      const exists = prev.savedOfflineLectureIds.includes(lectureId);
      return {
        ...prev,
        savedOfflineLectureIds: exists
          ? prev.savedOfflineLectureIds.filter(id => id !== lectureId)
          : [...prev.savedOfflineLectureIds, lectureId],
      };
    });
  };

  const handleSaveTestResult = (result: TestResult) => {
    setUserProfile(prev => ({
      ...prev,
      testHistory: [...(prev.testHistory || []), result],
    }));
  };

  const handleUpdateStreak = (newStreak: number) => {
    setUserProfile(prev => ({
      ...prev,
      quizStreak: newStreak,
    }));
  };

  const handleOpenAiWithTopic = (topic: string) => {
    setAiMentorTopic(topic);
    setIsAiMentorOpen(true);
  };

  const isTelugu = userProfile.language === 'Telugu';

  // AUTH STATE RENDER WRAPPER
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
          Establishing Secure Candidate Session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#334155] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onUpdateLanguage={handleUpdateLanguage}
        onUpdateStage={handleUpdateStage}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAiMentor={() => {
          setAiMentorTopic(undefined);
          setIsAiMentorOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        
        {/* Floating Toasts Area */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className={`p-3.5 rounded-xl shadow-lg border text-xs font-bold text-white flex items-center space-x-2 animate-slide-in pointer-events-auto ${
                toast.type === 'success' 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-rose-950 border-rose-800 text-rose-100'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span>{toast.msg}</span>
            </div>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <StudyStrategyDashboard
            userProfile={userProfile}
            onNavigateTab={setActiveTab}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenAiMentor={() => {
              setAiMentorTopic(undefined);
              setIsAiMentorOpen(true);
            }}
          />
        )}

        {activeTab === 'lectures' && (
          <LectureModule
            userProfile={userProfile}
            onToggleCompleteLecture={handleToggleCompleteLecture}
            onToggleOfflineDownload={handleToggleOfflineDownload}
            onOpenAiMentorForTopic={handleOpenAiWithTopic}
          />
        )}

        {activeTab === 'mocktest' && (
          <MockTestEngine
            userProfile={userProfile}
            onSaveTestResult={handleSaveTestResult}
          />
        )}

        {activeTab === 'dailyquiz' && (
          <DailyQuizModule
            userProfile={userProfile}
            onUpdateStreak={handleUpdateStreak}
          />
        )}

        {activeTab === 'pet' && (
          <PhysicalFitnessTracker
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'pattern' && (
          <ExamPatternGuide
            userProfile={userProfile}
          />
        )}
      </main>

      {/* Professional Polish Footer */}
      <footer className="bg-white border-t border-slate-200 text-xs text-slate-500 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">AP Police Constable Self-Assessment & Lecture Platform</span>
            <span>•</span>
            <span className="text-slate-500">AP SLPRB Guidelines</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-500">
            <span>{isTelugu ? 'ప్రిలిమ్స్ & మెయిన్స్ సంపూర్ణ శిక్షణ' : 'Prelims & Mains Integrated Module'}</span>
            <span>•</span>
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-medium transition underline"
            >
              {isTelugu ? 'నా ప్రొఫైల్ సెట్టింగ్స్' : 'Candidate Settings'}
            </button>
            <span>•</span>
            <button 
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-700 font-bold transition flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isTelugu ? 'లాగ్ అవుట్' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Inactivity Logout Counter Warning Dialog */}
      {showInactivityWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none">
          <div className="bg-slate-900 border-2 border-amber-500/80 max-w-sm w-full rounded-2xl shadow-2xl p-6 text-white text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-md font-extrabold tracking-tight">
                Candidate Inactivity Lockout
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Security protocols detect no physical keyboard or mouse input. Your session will automatically logout in:
              </p>
            </div>

            {/* Expiring Seconds Counter */}
            <div className="flex items-center justify-center space-x-1 font-mono text-3xl font-black text-amber-400 bg-amber-500/5 py-2.5 rounded-lg border border-amber-500/20">
              <Clock className="w-6 h-6 animate-spin text-amber-500" />
              <span>{warningCountdown}s</span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={resetInactivityTimer}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-xs rounded-xl cursor-pointer transition shadow-md shadow-blue-900/30"
              >
                Keep Me Signed In
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer transition"
              >
                Sign Out Immediately
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile & Benchmarks Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={setUserProfile}
        sessionToken={sessionToken}
        activeSessions={activeSessions}
        onTerminateSession={handleTerminateSession}
        onLogoutAllDevices={handleLogoutAllDevices}
        loginActivityLogs={loginActivityLogs}
      />

      {/* AI Doubt Mentor Modal (Gemini 3.8 Flash) */}
      <AiMentorModal
        isOpen={isAiMentorOpen}
        onClose={() => setIsAiMentorOpen(false)}
        userProfile={userProfile}
        initialTopic={aiMentorTopic}
      />
    </div>
  );
}
