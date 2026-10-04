import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Flame, 
  BookOpen, 
  Activity, 
  Award, 
  Clock, 
  Video, 
  CheckSquare, 
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, StrategyMonth } from '../types';
import { STUDY_STRATEGY_MONTHS } from '../data/studyStrategyData';
import { SYLLABUS_SUBJECTS } from '../data/syllabusData';
import { DailyStudyReminderBadge } from './DailyStudyReminderBadge';

interface StudyStrategyDashboardProps {
  userProfile: UserProfile;
  onNavigateTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenAiMentor: () => void;
}

export const StudyStrategyDashboard: React.FC<StudyStrategyDashboardProps> = ({
  userProfile,
  onNavigateTab,
  onOpenProfile,
  onOpenAiMentor,
}) => {
  const isTelugu = userProfile.language === 'Telugu';
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [completedWeeklyGoals, setCompletedWeeklyGoals] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ap_police_completed_goals');
      return saved ? JSON.parse(saved) : { 'm1-w1': true };
    } catch {
      return { 'm1-w1': true };
    }
  });

  const toggleGoal = (goalId: string) => {
    setCompletedWeeklyGoals(prev => {
      const updated = { ...prev, [goalId]: !prev[goalId] };
      try {
        localStorage.setItem('ap_police_completed_goals', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const currentMonthData = STUDY_STRATEGY_MONTHS.find(m => m.monthNumber === selectedMonth) || STUDY_STRATEGY_MONTHS[0];

  // Overall syllabus stats
  const totalLecturesCount = SYLLABUS_SUBJECTS.reduce((acc, sub) => acc + sub.lectures.length, 0);
  const completedLecturesCount = userProfile.completedLectureIds.length;
  const lectureCompletionPct = Math.round((completedLecturesCount / totalLecturesCount) * 100);

  // Overall goal completion
  const allGoalIds = STUDY_STRATEGY_MONTHS.flatMap(m => m.weeklyGoals.map(g => g.id));
  const completedGoalCount = allGoalIds.filter(id => completedWeeklyGoals[id]).length;
  const goalCompletionPct = Math.round((completedGoalCount / allGoalIds.length) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Candidate Profile Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>AP SLPRB Constable 2026 Batch</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{isTelugu ? '4-నెలల లక్ష్యం: రోజూ 6 గం' : '4-Month Target: 6h Daily Pace'}</span>
              </span>
              <span className="text-xs text-slate-500">
                Target: <strong className="text-slate-700">{userProfile.post}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
              {isTelugu ? `స్వాగతం, ${userProfile.name} గారు` : `Welcome, ${userProfile.name}`}
            </h1>

            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {isTelugu
                ? 'మీ 4-నెలల సన్నద్ధతా ప్రణాళికను క్రమబద్ధంగా పూర్తి చేయండి: వీడియో లెక్చర్లు, టాపిక్ నోట్స్, 1600 మీ రన్నింగ్ మరియు 3 గంటల మాక్ టెస్ట్‌లతో లక్ష్యాన్ని సాధించండి.'
                : 'Your dedicated 4-month roadmap to cracking the AP Police Constable Examination. Balanced across conceptual mastery, physical endurance (1600m), and full-length exam simulation.'}
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('mocktest')}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition flex items-center space-x-2"
            >
              <span>{isTelugu ? 'మాక్ టెస్ట్ ప్రారంభించండి' : 'Start Mock Test'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('dailyquiz')}
              className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition flex items-center space-x-2"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{isTelugu ? 'ఈరోజు క్విజ్' : 'Daily 10-Min Quiz'}</span>
            </button>

            <button
              onClick={onOpenAiMentor}
              className="px-4 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{isTelugu ? 'AI మెంటార్' : 'Ask AI Doubt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Study Target Reminder Badge (4-Month Preparation Strategy) */}
      <DailyStudyReminderBadge 
        userProfile={userProfile}
        onNavigateToLectures={() => onNavigateTab('lectures')}
        onNavigateToQuiz={() => onNavigateTab('dailyquiz')}
      />

      {/* Snapshot Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('lectures')}
          className="bg-white border border-slate-200 hover:border-blue-400 p-4 rounded-xl shadow-xs space-y-1 text-left transition group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider group-hover:text-blue-600">
            <span>YouTube Lectures</span>
            <Video className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {completedLecturesCount} / {totalLecturesCount}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>{lectureCompletionPct}% completed</span>
            <span className="text-blue-600 font-bold group-hover:underline">Watch &rarr;</span>
          </div>
        </button>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Milestones</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {completedGoalCount} / {allGoalIds.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {goalCompletionPct}% roadmap done
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>1600m Run Time</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {userProfile.benchmarks.run1600mMinutes}m {userProfile.benchmarks.run1600mSeconds}s
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Cutoff standard: &le; 8:00 min
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Daily Quiz Streak</span>
            <Flame className="w-4 h-4 text-orange-500 fill-current" />
          </div>
          <div className="text-2xl font-bold text-orange-600 font-mono">
            {userProfile.quizStreak || 1} Days
          </div>
          <div className="text-[11px] text-slate-500">
            Consistent GK revision
          </div>
        </div>
      </div>

      {/* Preparation Progress & Physical Benchmarks Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Preparation Progress & Recent Lecture (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-base flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              <span>Preparation Progress</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">Month {selectedMonth} of 4 ({currentMonthData.title.split(':')[1] || currentMonthData.title})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Arithmetic & Reasoning</span>
                  <span className="font-mono text-blue-600">65%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[65%]"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>General Studies & AP Movement</span>
                  <span className="font-mono text-orange-500">42%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-[42%]"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>English Grammar & Comprehension</span>
                  <span className="font-mono text-emerald-600">80%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[80%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col justify-between space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-red-600 mb-1 tracking-wider flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-600 mr-1.5 inline-block"></span>
                  {isTelugu ? 'యూట్యూబ్ సబ్జెక్ట్ లెక్చర్లు' : 'Subject-Wise YouTube Lectures'}
                </p>
                <p className="font-bold text-sm text-slate-800">
                  {isTelugu ? '4 సబ్జెక్టుల పూర్తి వీడియో క్లాసులు' : '27 HD Videos across 4 Subjects'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arithmetic • Reasoning • General Studies • English
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => onNavigateTab('lectures')}
                  className="px-2 py-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded text-[11px] font-semibold text-slate-700 text-left transition truncate"
                >
                  📐 Arithmetic (8)
                </button>
                <button
                  onClick={() => onNavigateTab('lectures')}
                  className="px-2 py-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded text-[11px] font-semibold text-slate-700 text-left transition truncate"
                >
                  🧠 Reasoning (7)
                </button>
                <button
                  onClick={() => onNavigateTab('lectures')}
                  className="px-2 py-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded text-[11px] font-semibold text-slate-700 text-left transition truncate"
                >
                  🏛️ GS & AP (6)
                </button>
                <button
                  onClick={() => onNavigateTab('lectures')}
                  className="px-2 py-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded text-[11px] font-semibold text-slate-700 text-left transition truncate"
                >
                  📖 English (6)
                </button>
              </div>

              <button 
                onClick={() => onNavigateTab('lectures')}
                className="flex items-center text-blue-600 text-xs font-bold hover:underline text-left pt-1"
              >
                <span>{isTelugu ? 'అన్ని వీడియోలను చూడండి' : 'Open All Subject Lectures'}</span>
                <span className="ml-1">→</span>
              </button>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-100">
            <div className="text-center border-r border-slate-100">
              <p className="text-2xl font-bold text-slate-800">{userProfile.testHistory?.length || 1}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Tests Taken</p>
            </div>
            <div className="text-center border-r border-slate-100">
              <p className="text-2xl font-bold text-slate-800">{userProfile.completedLectureIds?.length || 2}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Lectures Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 font-mono">48d</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">To Prelims</p>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Benchmarks Card (from Design HTML: #1E293B dark card) */}
        <div className="bg-[#1E293B] rounded-xl shadow-md border border-slate-700 p-6 flex flex-col text-white justify-between space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-400" />
              <span>Physical Benchmarks</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">PET/PMT Standard</span>
          </div>

          <div className="space-y-3 flex-1">
            <div className="p-3 bg-slate-800/90 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">1600m RUN (TARGET: &le; 8:00)</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 font-bold uppercase">
                  On Track
                </span>
              </div>
              <p className="text-2xl font-mono font-bold tracking-tight text-white">
                0{userProfile.benchmarks.run1600mMinutes}:{userProfile.benchmarks.run1600mSeconds < 10 ? '0' : ''}{userProfile.benchmarks.run1600mSeconds}s
              </p>
            </div>

            <div className="p-3 bg-slate-800/90 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">LONG JUMP (TARGET: &ge; 3.80m)</span>
                <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded border border-orange-500/30 font-bold uppercase">
                  {userProfile.benchmarks.longJumpMeters >= 4.2 ? 'Excellent' : 'Training Needed'}
                </span>
              </div>
              <p className="text-2xl font-mono font-bold tracking-tight text-white">
                {userProfile.benchmarks.longJumpMeters}m
              </p>
            </div>

            <div className="p-3 bg-slate-800/90 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">100m SPRINT (TARGET: &le; 15.00s)</span>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-500/30 font-bold uppercase">
                  Active
                </span>
              </div>
              <p className="text-2xl font-mono font-bold tracking-tight text-white">
                {userProfile.benchmarks.run100mSeconds}s
              </p>
            </div>
          </div>

          <button 
            onClick={() => onNavigateTab('pet')}
            className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition text-center"
          >
            Log Training Session
          </button>
        </div>
      </div>

      {/* 4-Month Strategic Roadmap Interactive Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Official Master Preparation Roadmap
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              4-Month Structured Preparation Strategy
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Click each month tab to view weekly study & PET schedule
          </span>
        </div>

        {/* 4 Month Navigation Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STUDY_STRATEGY_MONTHS.map((m) => {
            const isSelected = m.monthNumber === selectedMonth;
            return (
              <button
                key={m.monthNumber}
                onClick={() => setSelectedMonth(m.monthNumber)}
                className={`p-4 rounded-xl text-left border transition ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    Month {m.monthNumber}
                  </span>
                </div>
                <h3 className="font-bold text-sm line-clamp-1 text-slate-800">
                  {m.title.split(':')[1] || m.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {m.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Month Detail Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {currentMonthData.title}
            </h3>
            <p className="text-xs text-slate-600">
              {currentMonthData.subtitle}
            </p>
          </div>

          {/* Focus Areas List */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Key Strategic Objectives:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
              {currentMonthData.focusAreas.map((area, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goals Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Weekly Action Items & PET Ground Drills:
            </h4>

            <div className="space-y-3">
              {currentMonthData.weeklyGoals.map((goal) => {
                const isChecked = !!completedWeeklyGoals[goal.id];
                return (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start space-x-3.5 ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      className={`mt-0.5 p-1 rounded-md transition ${
                        isChecked ? 'text-emerald-600 bg-emerald-100' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {goal.weekTitle}
                        </span>
                        {isChecked && (
                          <span className="text-[10px] font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-100">
                            Completed
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {goal.description}
                      </p>

                      {goal.petFocus && (
                        <div className="mt-1 pt-1.5 border-t border-slate-100 flex items-center space-x-1.5 text-xs text-blue-700 font-medium">
                          <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>PET Focus: {goal.petFocus}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AP Police Constable Exam Structure Quick Summary & Note Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Exam Pattern Checklist</span>
          </h3>
          <button
            onClick={() => onNavigateTab('pattern')}
            className="text-xs text-blue-600 hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>View Full Pattern Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-4 flex flex-col justify-center items-center text-center">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 font-bold text-sm">
              1
            </div>
            <p className="text-xs font-bold text-slate-800">PRELIMS</p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">ACTIVE</p>
          </div>

          <div className="border border-slate-200 bg-slate-50/80 rounded-lg p-4 flex flex-col justify-center items-center text-center">
            <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-2 font-bold text-sm">
              2
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase">PET / PMT</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">LOCKED</p>
          </div>

          <div className="border border-slate-200 bg-slate-50/80 rounded-lg p-4 flex flex-col justify-center items-center text-center">
            <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-2 font-bold text-sm">
              3
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase">MAINS</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">LOCKED</p>
          </div>

          <div className="border border-slate-200 bg-slate-50/80 rounded-lg p-4 flex flex-col justify-center items-center text-center">
            <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-2 font-bold text-sm">
              4
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase">SELECTION</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">LOCKED</p>
          </div>
        </div>

        {/* Note Box matching Design HTML: bg-blue-50 border-l-4 border-blue-500 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3.5 rounded-r-lg">
          <p className="text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Note:</span> Civil post scores are evaluated purely on written marks (200 marks Prelims & Mains). APSP / AR posts include PET scored marks. Ensure you log at least 2 full-length mock tests this week.
          </p>
        </div>
      </div>
    </div>
  );
};
