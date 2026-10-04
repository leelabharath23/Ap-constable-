import React, { useState } from 'react';
import { 
  Flame, 
  CheckCircle, 
  HelpCircle, 
  Calendar, 
  ArrowRight, 
  RotateCcw, 
  Clock, 
  Award, 
  Languages, 
  Sparkles, 
  Bookmark, 
  Newspaper 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CurrentAffairsItem, DailyQuiz, UserProfile } from '../types';
import { CURRENT_AFFAIRS_ITEMS, DAILY_QUIZZES } from '../data/currentAffairsData';

interface DailyQuizModuleProps {
  userProfile: UserProfile;
  onUpdateStreak: (newStreak: number) => void;
}

export const DailyQuizModule: React.FC<DailyQuizModuleProps> = ({
  userProfile,
  onUpdateStreak,
}) => {
  const isTelugu = userProfile.language === 'Telugu';
  const quiz = DAILY_QUIZZES[0];

  const [activeTab, setActiveTab] = useState<'quiz' | 'currentAffairs'>('quiz');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isQuizTelugu, setIsQuizTelugu] = useState(isTelugu);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentQ = quiz.questions[currentQIndex];

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleQuizSubmit = () => {
    setIsSubmitted(true);
    const newStreak = (userProfile.quizStreak || 0) + 1;
    onUpdateStreak(newStreak);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Safe fallback
    }
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });
    return score;
  };

  const filteredNews = selectedCategory === 'all'
    ? CURRENT_AFFAIRS_ITEMS
    : CURRENT_AFFAIRS_ITEMS.filter(item => item.category === selectedCategory);

  const categories = ['all', 'AP State', 'National', 'Polity & Schemes', 'Economy'];

  return (
    <div className="space-y-6">
      {/* Top Banner with Daily Streak Counter */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-blue-600 fill-current" />
            <span>Daily Discipline & General Knowledge</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">
            {isTelugu ? 'డైలీ 10-నిమిషాల క్విజ్ & ఏపీ కరెంట్ అఫైర్స్' : 'Daily 10-Minute Quiz & AP State Current Affairs'}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
            {isTelugu
              ? 'ఆంధ్రప్రదేశ్ రాష్ట్ర పథకాలు, పోలవరం ప్రాజెక్ట్, 26 జిల్లాలు మరియు జాతీయ పరిణామాలపై రోజువారీ ప్రశ్నలను సాధన చేయండి.'
              : 'Sharpen your AP State & National General Studies with short, 10-minute daily tests, streak achievements, and curated summaries.'}
          </p>
        </div>

        {/* Streak Counter Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center space-x-3.5 shrink-0 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Flame className="w-7 h-7 fill-current text-blue-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-semibold">{isTelugu ? 'డైలీ స్ట్రీక్' : 'Daily Streak'}</span>
            <div className="text-2xl font-black text-slate-900 font-display">
              {userProfile.quizStreak || 1} <span className="text-xs text-slate-500 font-normal">{isTelugu ? 'రోజులు' : 'Days'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Sub-Tabs (Quiz vs News Cards) */}
      <div className="flex border-b border-slate-200 space-x-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'quiz'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{isTelugu ? 'ఈరోజు డైలీ క్విజ్ (10 నిమిషాలు)' : 'Today’s 10-Min Quiz'}</span>
        </button>

        <button
          onClick={() => setActiveTab('currentAffairs')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'currentAffairs'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>{isTelugu ? 'ఏపీ & జాతీయ కరెంట్ అఫైర్స్ డైజెస్ట్' : 'AP & National Current Affairs Digest'}</span>
        </button>
      </div>

      {/* TAB 1: 10-MINUTE DAILY QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                10-Min Challenge
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Question {currentQIndex + 1} of {quiz.questions.length}
              </span>
            </div>

            <button
              onClick={() => setIsQuizTelugu(!isQuizTelugu)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition"
            >
              <Languages className="w-3.5 h-3.5 text-blue-600" />
              <span>{isQuizTelugu ? 'English' : 'తెలుగు'}</span>
            </button>
          </div>

          {/* Question Box */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {isQuizTelugu && currentQ.questionTextTelugu ? currentQ.questionTextTelugu : currentQ.questionText}
            </h3>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                const isCorrect = opt.id === currentQ.correctOptionId;

                let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
                if (isSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-red-50 border-red-300 text-red-900 line-through';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-blue-50 border-blue-500 text-blue-950 font-bold shadow-xs';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between text-sm ${btnStyle}`}
                  >
                    <span>{isQuizTelugu && opt.textTelugu ? opt.textTelugu : opt.text}</span>
                    {isSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {/* Solution Box if submitted */}
            {isSubmitted && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-blue-700 block">Explanation:</span>
                <p className="text-slate-700 leading-relaxed">
                  {isQuizTelugu && currentQ.explanationTelugu ? currentQ.explanationTelugu : currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {currentQIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                >
                  Next
                </button>
              ) : !isSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  className="px-5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  Submit Daily Quiz
                </button>
              ) : (
                <div className="text-xs font-bold text-blue-700">
                  Score: {calculateScore()} / {quiz.questions.length} Correct
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AP STATE & NATIONAL CURRENT AFFAIRS CARDS */}
      {activeTab === 'currentAffairs' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNews.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {item.category}
                    </span>
                    {item.highYieldTag && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        {item.highYieldTag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {isTelugu && item.titleTelugu ? item.titleTelugu : item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isTelugu && item.summaryTelugu ? item.summaryTelugu : item.summary}
                  </p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Key Exam Points:</span>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {item.bulletPoints.map((pt, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 flex justify-between items-center">
                  <span>{item.date}</span>
                  <span className="text-blue-600 font-medium">AP Police Constable Prelims / Mains</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
