import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  CheckCircle, 
  AlertCircle, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Bookmark, 
  HelpCircle, 
  BarChart3, 
  Languages, 
  Check, 
  X, 
  ArrowRight,
  ShieldAlert,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, MockTest, TestResult, SubjectCategory, UserProfile } from '../types';
import { MOCK_TESTS, ALL_QUESTIONS } from '../data/mockTestData';

interface MockTestEngineProps {
  userProfile: UserProfile;
  onSaveTestResult: (result: TestResult) => void;
}

export const MockTestEngine: React.FC<MockTestEngineProps> = ({
  userProfile,
  onSaveTestResult,
}) => {
  const isTeluguDefault = userProfile.language === 'Telugu';

  // Test Selection State
  const [selectedTest, setSelectedTest] = useState<MockTest>(MOCK_TESTS[0]);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  // Active Test Engine States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | undefined>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemainingSec, setTimeRemainingSec] = useState<number>(selectedTest.durationMinutes * 60);
  const [isQuestionTelugu, setIsQuestionTelugu] = useState<boolean>(isTeluguDefault);
  const [activeSectionFilter, setActiveSectionFilter] = useState<SubjectCategory | 'all'>('all');
  const [lastResult, setLastResult] = useState<TestResult | null>(null);

  // Start Test
  const handleStartTest = (test: MockTest) => {
    setSelectedTest(test);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setTimeRemainingSec(test.durationMinutes * 60);
    setIsTestActive(true);
    setIsTestSubmitted(false);
    setLastResult(null);
    setActiveSectionFilter('all');
  };

  // Timer Tick
  useEffect(() => {
    if (!isTestActive || isTestSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestActive, isTestSubmitted]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Questions filtered by active section
  const questionsToDisplay = activeSectionFilter === 'all'
    ? selectedTest.questions
    : selectedTest.questions.filter(q => q.subjectId === activeSectionFilter);

  const currentQuestion = questionsToDisplay[currentQuestionIndex] || selectedTest.questions[0];

  const handleSelectOption = (optionId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleClearResponse = () => {
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleToggleMarkReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  // Submit test and calculate comprehensive score & analytics
  const handleSubmitTest = () => {
    setIsTestActive(false);
    setIsTestSubmitted(true);

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const subjectBreakdown: TestResult['subjectBreakdown'] = {};

    selectedTest.questions.forEach((q) => {
      const selected = userAnswers[q.id];
      const isCorrect = selected === q.correctOptionId;

      if (!subjectBreakdown[q.subjectId]) {
        subjectBreakdown[q.subjectId] = { correct: 0, total: 0, score: 0 };
      }
      subjectBreakdown[q.subjectId]!.total += 1;

      if (!selected) {
        unattemptedCount += 1;
      } else if (isCorrect) {
        correctCount += 1;
        subjectBreakdown[q.subjectId]!.correct += 1;
        subjectBreakdown[q.subjectId]!.score += 1; // 1 mark per question in AP Constable
      } else {
        incorrectCount += 1;
        // If negative marking existed: score -= selectedTest.negativeMarking;
      }
    });

    const totalScore = correctCount; // 1 mark each
    const accuracy = correctCount + incorrectCount > 0 
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
      : 0;

    const timeSpentMinutes = Math.round(
      (selectedTest.durationMinutes * 60 - timeRemainingSec) / 60
    );

    // AP Police Constable Prelims Cutoff benchmark:
    // OC (General) Cutoff is usually 40% (80 marks) or normalized ~100-110 marks for Civil post call
    const passedCutoff = totalScore >= (selectedTest.totalMarks * 0.45);

    const result: TestResult = {
      testId: selectedTest.id,
      testTitle: selectedTest.title,
      date: new Date().toLocaleDateString(),
      totalScore,
      maxScore: selectedTest.totalMarks,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy,
      timeSpentMinutes,
      subjectBreakdown,
      passedCutoff,
      responses: userAnswers,
    };

    setLastResult(result);
    onSaveTestResult(result);

    // Trigger celebratory confetti on good score
    if (accuracy >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  // Section names mapping
  const sections: { id: SubjectCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Sections', count: selectedTest.questions.length },
    { id: 'arithmetic', label: 'Arithmetic', count: selectedTest.questions.filter(q => q.subjectId === 'arithmetic').length },
    { id: 'reasoning', label: 'Reasoning', count: selectedTest.questions.filter(q => q.subjectId === 'reasoning').length },
    { id: 'general_studies', label: 'General Studies', count: selectedTest.questions.filter(q => q.subjectId === 'general_studies').length },
    { id: 'english', label: 'English', count: selectedTest.questions.filter(q => q.subjectId === 'english').length },
  ];

  // VIEW 1: Test Selection Dashboard (when not taking test and not viewing results)
  if (!isTestActive && !isTestSubmitted) {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Timer className="w-4 h-4" />
              <span>AP SLPRB Computer-Based Mock Test Simulator</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              {isTeluguDefault ? 'ఆంధ్రప్రదేశ్ పోలీస్ కానిస్టేబుల్ మాక్ టెస్ట్ ఇంజిన్' : 'AP Police Constable Mock Test Engine (3h Exam Mode)'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isTeluguDefault
                ? 'వాస్తవ పరీక్షా విధానంలో 3 గంటల టైమర్, సెక్షన్ల వారీగా ప్రశ్నలు, తక్షణ మార్కుల విశ్లేషణ మరియు తెలుగు/ఇంగ్లీష్ వివరణలతో కూడిన సమాధానాల కీ.'
                : 'Experience actual 3-hour exam pressure with 200-question simulation, immediate scoring analytics, cutoff prediction, and bilingual step-by-step solution keys.'}
            </p>
          </div>
        </div>

        {/* Available Test Series Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCK_TESTS.map((test) => {
            return (
              <div 
                key={test.id}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {test.stage}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                      <Timer className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.durationMinutes} Mins</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {isTeluguDefault ? test.titleTelugu : test.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {test.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                      <span className="text-slate-500 block text-[10px] font-medium">Total Marks</span>
                      <span className="font-bold text-slate-800 text-sm font-mono">{test.totalMarks}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                      <span className="text-slate-500 block text-[10px] font-medium">Questions</span>
                      <span className="font-bold text-slate-800 text-sm font-mono">{test.questions.length} Qs</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartTest(test)}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isTeluguDefault ? 'పరీక్ష ప్రారంభించండి' : 'Start Mock Test'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Previous Test Results History */}
        {userProfile.testHistory && userProfile.testHistory.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>{isTeluguDefault ? 'గత పరీక్షల ఫలితాలు' : 'Recent Mock Performance History'}</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {userProfile.testHistory.slice(-3).reverse().map((res, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{res.testTitle}</div>
                    <div className="text-slate-500">{res.date} • Spent {res.timeSpentMinutes} mins</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-blue-600">
                      {res.totalScore} / {res.maxScore}
                    </div>
                    <span className={`text-[10px] font-semibold ${res.passedCutoff ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {res.accuracy}% Accuracy ({res.passedCutoff ? 'Cutoff Cleared' : 'Needs Revision'})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // VIEW 2: Results & Analytics Screen (after submit)
  if (isTestSubmitted && lastResult) {
    return (
      <div className="space-y-6">
        {/* Score Card Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Exam Evaluation Report
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                {lastResult.testTitle}
              </h2>
              <p className="text-xs text-slate-500">
                Attempted on {lastResult.date} in {lastResult.timeSpentMinutes} minutes
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsTestSubmitted(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition"
              >
                Back to Tests
              </button>
              <button
                onClick={() => handleStartTest(selectedTest)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block mb-0.5 font-medium">Total Score</span>
              <span className="text-2xl font-black text-blue-600 font-display">
                {lastResult.totalScore} <span className="text-xs text-slate-500 font-normal">/ {lastResult.maxScore}</span>
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block mb-0.5 font-medium">Accuracy</span>
              <span className="text-2xl font-black text-emerald-600 font-display">
                {lastResult.accuracy}%
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block mb-0.5 font-medium">Correct / Wrong</span>
              <span className="text-lg font-bold text-slate-800">
                <span className="text-emerald-600">{lastResult.correctCount}</span> / <span className="text-red-500">{lastResult.incorrectCount}</span>
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block mb-0.5 font-medium">Civil Cutoff Meter</span>
              <span className={`text-sm font-bold block ${lastResult.passedCutoff ? 'text-emerald-600' : 'text-orange-600'}`}>
                {lastResult.passedCutoff ? 'Qualified for Civil / AR' : 'Below Civil Cutoff'}
              </span>
            </div>
          </div>
        </div>

        {/* Subject-Wise Analytics Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Subject-Wise Performance Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {Object.entries(lastResult.subjectBreakdown).map(([subKey, item]) => {
              const stat = item as { correct: number; total: number; score: number } | undefined;
              if (!stat) return null;
              const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
              return (
                <div key={subKey} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 capitalize">{subKey.replace('_', ' ')}</span>
                    <span className="text-blue-600 font-bold font-mono">{stat.correct}/{stat.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Accuracy</span>
                    <span className="font-semibold text-slate-800">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Solutions & Explanations Key */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Detailed Solutions & Step-by-Step Answer Key
              </h3>
              <p className="text-xs text-slate-500">
                Review mistakes and understand mathematical shortcuts & Constitutional articles
              </p>
            </div>

            <button
              onClick={() => setIsQuestionTelugu(!isQuestionTelugu)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-blue-700 border border-slate-200 transition"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isQuestionTelugu ? 'View in English' : 'తెలుగులో వివరణలు'}</span>
            </button>
          </div>

          <div className="space-y-6">
            {selectedTest.questions.map((q, idx) => {
              const selectedOptId = lastResult.responses[q.id];
              const isCorrect = selectedOptId === q.correctOptionId;
              const isSkipped = !selectedOptId;

              return (
                <div 
                  key={q.id}
                  className={`p-4 rounded-xl border space-y-3 ${
                    isCorrect 
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-800' 
                      : isSkipped 
                      ? 'bg-slate-50/70 border-slate-200 text-slate-700' 
                      : 'bg-red-50/60 border-red-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Q{idx + 1}. {q.topic} ({q.subjectId.toUpperCase()})
                    </span>
                    <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                      isCorrect 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : isSkipped 
                        ? 'bg-slate-200 text-slate-600' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {isCorrect ? 'Correct (+1)' : isSkipped ? 'Skipped (0)' : 'Incorrect (0)'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900">
                    {isQuestionTelugu && q.questionTextTelugu ? q.questionTextTelugu : q.questionText}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => {
                      const isThisCorrect = opt.id === q.correctOptionId;
                      const isThisSelected = opt.id === selectedOptId;

                      let style = 'bg-white border-slate-200 text-slate-700';
                      if (isThisCorrect) {
                        style = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isThisSelected && !isThisCorrect) {
                        style = 'bg-red-100 border-red-300 text-red-900 line-through';
                      }

                      return (
                        <div key={opt.id} className={`p-2.5 rounded-lg border flex items-center justify-between ${style}`}>
                          <span>{isQuestionTelugu && opt.textTelugu ? opt.textTelugu : opt.text}</span>
                          {isThisCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          {isThisSelected && !isThisCorrect && <X className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-blue-700 block">Explanation / సాధన:</span>
                    <p className="text-slate-700 whitespace-pre-line font-mono text-[11px]">
                      {isQuestionTelugu && q.explanationTelugu ? q.explanationTelugu : q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 3: Active Mock Test Simulator (Candidate taking the exam)
  return (
    <div className="space-y-4">
      {/* Top Test Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
            {selectedTest.stage} Exam Mode
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display">
            {selectedTest.title}
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Toggle for Active Question */}
          <button
            onClick={() => setIsQuestionTelugu(!isQuestionTelugu)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition"
            title="Toggle Question Language"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span>{isQuestionTelugu ? 'తెలుగు' : 'English'}</span>
          </button>

          {/* Countdown Clock */}
          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-mono text-sm font-bold border ${
            timeRemainingSec <= 900
              ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            <Timer className="w-4 h-4" />
            <span>{formatTimer(timeRemainingSec)}</span>
          </div>

          {/* Submit Test Button */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to submit the AP Police Constable Mock Test now?')) {
                handleSubmitTest();
              }
            }}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {sections.map(sec => (
          <button
            key={sec.id}
            onClick={() => {
              setActiveSectionFilter(sec.id);
              setCurrentQuestionIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
              activeSectionFilter === sec.id
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {sec.label} ({sec.count})
          </button>
        ))}
      </div>

      {/* Main Examination Grid: Question Screen (8 cols) + Question Palette (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Question & Options Area */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Question Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-bold text-blue-600">
                Question {currentQuestionIndex + 1} of {questionsToDisplay.length}
              </span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                  {currentQuestion.subjectId.replace('_', ' ')}
                </span>
                <span className="text-slate-400 font-mono">+1.0 / -0.0</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-display">
              {isQuestionTelugu && currentQuestion.questionTextTelugu 
                ? currentQuestion.questionTextTelugu 
                : currentQuestion.questionText}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt) => {
                const isSelected = userAnswers[currentQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center space-x-3 text-sm font-medium ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-950 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}>
                      {opt.id.replace('opt-', '').toUpperCase()}
                    </span>
                    <span>
                      {isQuestionTelugu && opt.textTelugu ? opt.textTelugu : opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleMarkReview}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${
                  markedForReview[currentQuestion.id]
                    ? 'bg-purple-50 text-purple-700 border-purple-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {markedForReview[currentQuestion.id] ? 'Marked for Review' : 'Mark for Review'}
              </button>

              <button
                onClick={handleClearResponse}
                className="px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 disabled:opacity-40 transition flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  if (currentQuestionIndex < questionsToDisplay.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                  }
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition flex items-center space-x-1"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Official Exam Question Palette */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Question Palette
            </h4>
            <p className="text-[11px] text-slate-500">
              Select any number to jump directly to that question.
            </p>
          </div>

          {/* Palette Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Answered</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Marked Review</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span>Not Answered</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-blue-600" />
              <span>Current</span>
            </div>
          </div>

          {/* Question Grid Numbers */}
          <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
            {questionsToDisplay.map((q, index) => {
              const isAnswered = !!userAnswers[q.id];
              const isMarked = !!markedForReview[q.id];
              const isCurrent = index === currentQuestionIndex;

              let btnStyle = 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
              if (isCurrent) {
                btnStyle = 'border-2 border-blue-600 text-blue-700 font-bold bg-blue-50';
              } else if (isMarked) {
                btnStyle = 'bg-purple-600 text-white font-bold border-purple-600';
              } else if (isAnswered) {
                btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-600';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-9 rounded-lg border text-xs flex items-center justify-center transition ${btnStyle}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Exam Summary Stat in Palette */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-500">
            <div className="flex justify-between">
              <span>Attempted:</span>
              <span className="font-bold text-slate-900">{Object.keys(userAnswers).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Marked for review:</span>
              <span className="font-bold text-purple-700">{Object.keys(markedForReview).filter(k => markedForReview[k]).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
