import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  HelpCircle, 
  Languages, 
  Bot, 
  User, 
  Loader2, 
  BookOpen, 
  Activity, 
  Shield 
} from 'lucide-react';
import { UserProfile, LanguagePreference } from '../types';

interface AiMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  initialTopic?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}

export const AiMentorModal: React.FC<AiMentorModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  initialTopic,
}) => {
  if (!isOpen) return null;

  const isTelugu = userProfile.language === 'Telugu';
  const [mentorLang, setMentorLang] = useState<LanguagePreference>(userProfile.language);
  const [questionInput, setQuestionInput] = useState(
    initialTopic ? `Please explain the core concepts, shortcuts, and AP Police Constable exam questions for: "${initialTopic}"` : ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'mentor',
      text: mentorLang === 'Telugu'
        ? `నమస్తే ${userProfile.name}! నేను మీ AP పోలీస్ కానిస్టేబుల్ AI ప్రిపరేషన్ మెంటార్‌ను. అర్థమెటిక్ షార్ట్‌కట్‌లు, రీజనింగ్ ట్రిక్స్, ఏపీ హిస్టరీ & పాలిటీ లేదా 1600 మీటర్ల రన్నింగ్ స్టామినా గురించి ఏ సందేహం ఉన్నా అడగండి!`
        : `Hello ${userProfile.name}! I am your dedicated AP Police Constable Exam Mentor. Ask me any doubts regarding Quant shortcuts, Reasoning patterns, Indian Polity / AP History, or 1600m running stamina tips!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'How to clear 1600m run under 7 minutes for AR/APSP score?',
    'What are the key provisions of AP Reorganisation Act 2014?',
    'Shortcut formula for difference between CI and SI for 2 & 3 years?',
    'Important articles on Fundamental Rights (Articles 14 to 32)',
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || questionInput;
    if (!q.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setQuestionInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/doubt-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          subject: 'General AP Police Constable Syllabus',
          stage: userProfile.stage,
          language: mentorLang,
        }),
      });

      const data = await response.json();
      const replyText = data.answer || (
        mentorLang === 'Telugu'
          ? 'క్షమించండి, సర్వర్‌లో సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.'
          : 'Unable to reach mentor at this moment. Please check connection and try again.'
      );

      const mentorMsg: Message = {
        id: `mentor-${Date.now()}`,
        sender: 'mentor',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, mentorMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'mentor',
        text: 'Network error or server unreachable. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full h-[600px] flex flex-col shadow-2xl text-slate-800 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-xs">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base font-display text-slate-900">
                  AP Police Constable AI Mentor
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  SLPRB Expert
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Syllabus clarification, Quant speed tricks & PET coach
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Toggle for AI */}
            <button
              onClick={() => setMentorLang(mentorLang === 'Telugu' ? 'English' : 'Telugu')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 font-semibold transition"
            >
              <Languages className="w-3.5 h-3.5 text-blue-600" />
              <span>{mentorLang === 'Telugu' ? 'తెలుగు' : 'English'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex space-x-2 overflow-x-auto scrollbar-none text-[11px]">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 whitespace-nowrap border border-slate-200 hover:border-blue-300 transition shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white font-normal rounded-tr-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1.5 ${
                      isUser ? 'text-blue-100 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-blue-600 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing AP Police Constable syllabus & drafting explanation...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              mentorLang === 'Telugu'
                ? 'మీ ప్రశ్న లేదా సందేహాన్ని ఇక్కడ టైప్ చేయండి...'
                : 'Ask doubt about Quant shortcuts, GS, or PET training...'
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />

          <button
            disabled={!questionInput.trim() || isLoading}
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-40 shadow-xs transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
