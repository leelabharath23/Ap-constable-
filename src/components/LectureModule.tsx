import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  CheckCircle, 
  CheckCircle2,
  FileText, 
  Clock, 
  Sparkles, 
  Printer, 
  Video,
  Tv,
  ExternalLink, 
  Search, 
  Check, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  Bookmark, 
  BookOpen, 
  Award, 
  Link2,
  Filter,
  Grid,
  List,
  Layers,
  Youtube,
  GraduationCap
} from 'lucide-react';
import { Subject, Lecture, SubjectCategory, UserProfile } from '../types';
import { SYLLABUS_SUBJECTS } from '../data/syllabusData';
import { 
  getLectureVideoData, 
  LectureVideoDetails, 
  CURATED_SUBJECT_PLAYLISTS, 
  getYouTubeSearchUrlForLecture, 
  getYouTubeWatchUrl 
} from '../data/videoLecturesData';

interface LectureModuleProps {
  userProfile: UserProfile;
  initialSubjectId?: SubjectCategory;
  onToggleCompleteLecture: (lectureId: string) => void;
  onToggleOfflineDownload: (lectureId: string) => void;
  onOpenAiMentorForTopic: (topic: string) => void;
}

export const LectureModule: React.FC<LectureModuleProps> = ({
  userProfile,
  initialSubjectId = 'arithmetic',
  onToggleCompleteLecture,
  onToggleOfflineDownload,
  onOpenAiMentorForTopic,
}) => {
  const isTelugu = userProfile.language === 'Telugu';
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectCategory>(initialSubjectId);
  
  // View mode: 'grid' (browse subject video cards) or 'player' (watch active video in classroom)
  const [viewMode, setViewMode] = useState<'grid' | 'player'>('grid');

  const currentSubject = SYLLABUS_SUBJECTS.find(s => s.id === selectedSubjectId) || SYLLABUS_SUBJECTS[0];
  const [selectedLecture, setSelectedLecture] = useState<Lecture>(currentSubject.lectures[0]);

  // Video Player States
  const [playerMode, setPlayerMode] = useState<'youtube' | 'smartboard' | 'custom'>('youtube');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isVoiceNarrating, setIsVoiceNarrating] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string>('');
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  const [playerActiveTab, setPlayerActiveTab] = useState<'notes' | 'quiz' | 'playlist'>('notes');
  
  // Search and filter in Grid view
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unwatched' | 'completed' | 'offline'>('all');

  // Quick Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Active video details
  const videoDetails: LectureVideoDetails = getLectureVideoData(selectedLecture.id);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const smartBoardTimerRef = useRef<number | null>(null);

  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
  const isCompleted = userProfile.completedLectureIds.includes(selectedLecture.id);
  const isDownloaded = userProfile.savedOfflineLectureIds.includes(selectedLecture.id);

  // Format time (seconds -> MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Switch lecture
  const handleSelectLecture = (lec: Lecture, targetView: 'grid' | 'player' = 'player') => {
    setSelectedLecture(lec);
    setCurrentTimeSec(0);
    setIsPlaying(false);
    setQuizAnswers({});
    setShowQuizResults(false);
    setViewMode(targetView);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsVoiceNarrating(false);
    }
  };

  const handleSelectSubject = (subjectId: SubjectCategory) => {
    setSelectedSubjectId(subjectId);
    const sub = SYLLABUS_SUBJECTS.find(s => s.id === subjectId);
    if (sub && sub.lectures.length > 0) {
      // Keep selected lecture in new subject
      setSelectedLecture(sub.lectures[0]);
      setCurrentTimeSec(0);
      setIsPlaying(false);
      setQuizAnswers({});
      setShowQuizResults(false);
    }
  };

  // Jump to specific chapter timestamp
  const handleJumpToChapter = (sec: number) => {
    setCurrentTimeSec(sec);
    setIsPlaying(true);
    if (playerMode === 'youtube' && iframeRef.current) {
      const baseSrc = getYouTubeEmbedUrl(activeYouTubeId, sec);
      iframeRef.current.src = baseSrc;
    }
  };

  // Extract YouTube ID from string or URL
  const extractYouTubeId = (urlOrId: string): string => {
    if (!urlOrId) return videoDetails.youtubeId;
    const clean = urlOrId.trim();
    if (clean.length === 11 && !clean.includes('/') && !clean.includes('.') && !clean.includes('?')) {
      return clean;
    }
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : videoDetails.youtubeId;
  };

  const activeYouTubeId = playerMode === 'custom' && customVideoUrl 
    ? extractYouTubeId(customVideoUrl) 
    : videoDetails.youtubeId;

  const getYouTubeEmbedUrl = (ytId: string, startSec: number = 0) => {
    return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=${isPlaying ? 1 : 0}&start=${startSec}&rel=0&modestbranding=1&enablejsapi=1`;
  };

  // Smart-Board simulated timer
  useEffect(() => {
    if (playerMode === 'smartboard' && isPlaying) {
      smartBoardTimerRef.current = window.setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= selectedLecture.durationSec) {
            setIsPlaying(false);
            return selectedLecture.durationSec;
          }
          return prev + Math.round(playbackSpeed);
        });
      }, 1000);
    } else {
      if (smartBoardTimerRef.current) {
        clearInterval(smartBoardTimerRef.current);
      }
    }
    return () => {
      if (smartBoardTimerRef.current) clearInterval(smartBoardTimerRef.current);
    };
  }, [playerMode, isPlaying, playbackSpeed, selectedLecture.durationSec]);

  // Voice narration for Smart-Board
  const toggleVoiceNarration = () => {
    if (!('speechSynthesis' in window)) return;
    if (isVoiceNarrating) {
      window.speechSynthesis.cancel();
      setIsVoiceNarrating(false);
    } else {
      window.speechSynthesis.cancel();
      const pointsToSpeak = isTelugu && selectedLecture.pdfNotesSummary.keyPointsTelugu
        ? selectedLecture.pdfNotesSummary.keyPointsTelugu.join('. ')
        : selectedLecture.pdfNotesSummary.keyPoints.join('. ');
      
      const utterance = new SpeechSynthesisUtterance(
        `${selectedLecture.title}. By instructor ${selectedLecture.instructor}. ${pointsToSpeak}`
      );
      utterance.rate = playbackSpeed;
      utterance.onend = () => setIsVoiceNarrating(false);
      utterance.onerror = () => setIsVoiceNarrating(false);
      window.speechSynthesis.speak(utterance);
      setIsVoiceNarrating(true);
    }
  };

  // Next and previous lecture within the active subject
  const currentLectureIndex = currentSubject.lectures.findIndex(l => l.id === selectedLecture.id);
  const prevLecture = currentLectureIndex > 0 ? currentSubject.lectures[currentLectureIndex - 1] : null;
  const nextLecture = currentLectureIndex < currentSubject.lectures.length - 1 ? currentSubject.lectures[currentLectureIndex + 1] : null;

  // Filter lectures in current subject
  const filteredLectures = currentSubject.lectures.filter(l => {
    // Status filter
    if (filterStatus === 'completed' && !userProfile.completedLectureIds.includes(l.id)) return false;
    if (filterStatus === 'unwatched' && userProfile.completedLectureIds.includes(l.id)) return false;
    if (filterStatus === 'offline' && !userProfile.savedOfflineLectureIds.includes(l.id)) return false;

    // Search query
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.titleTelugu.toLowerCase().includes(q) ||
      l.instructor.toLowerCase().includes(q) ||
      l.topicsCovered.some(t => t.toLowerCase().includes(q))
    );
  });

  // Curated playlists for current subject
  const subjectPlaylists = CURATED_SUBJECT_PLAYLISTS.filter(p => p.subjectId === selectedSubjectId);

  // Total completed in current subject
  const currentSubjectCompletedCount = currentSubject.lectures.filter(l => 
    userProfile.completedLectureIds.includes(l.id)
  ).length;
  const currentSubjectPct = Math.round((currentSubjectCompletedCount / currentSubject.lectures.length) * 100);

  // Total completed across all subjects
  const totalCompletedAllSubjects = SYLLABUS_SUBJECTS.reduce((acc, sub) => {
    return acc + sub.lectures.filter(l => userProfile.completedLectureIds.includes(l.id)).length;
  }, 0);
  const totalLecturesCount = SYLLABUS_SUBJECTS.reduce((acc, sub) => acc + sub.lectures.length, 0);

  return (
    <div className="space-y-6" id="youtube-subject-lectures-module">
      {/* Top Banner Header with YouTube Branding */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-full font-bold border border-red-200">
                <Youtube className="w-4 h-4 text-red-600 fill-red-600" />
                <span>{isTelugu ? 'యూట్యూబ్ సబ్జెక్ట్ లెక్చర్లు' : 'YouTube Subject-Wise Lectures'}</span>
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-mono font-bold">
                {totalCompletedAllSubjects}/{totalLecturesCount} {isTelugu ? 'పూర్తయ్యాయి' : 'Completed'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
              {isTelugu ? 'సబ్జెక్ట్ వారీగా పోలీస్ కానిస్టేబుల్ వీడియో తరగతులు' : 'Subject-Wise AP Police Constable Video Lectures'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              {isTelugu
                ? 'అంకగణితం, రీజనింగ్, జనరల్ స్టడీస్ మరియు ఇంగ్లీష్ సబ్జెక్టుల వారీగా పూర్తి వీడియో లెక్చర్లు, చాప్టర్ టైమ్‌స్టాంప్స్, షార్ట్‌కట్ నోట్స్ మరియు క్విజ్‌లతో సన్నద్ధం అవ్వండి.'
                : 'Comprehensive syllabus-aligned YouTube lectures organized subject-wise: Arithmetic, Reasoning, General Studies, and English. Complete with chapter navigation, speed shortcuts, and instant self-test quizzes.'}
            </p>
          </div>

          {/* View Mode Toggle: Grid Library vs Classroom Player */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Subject Video Library Grid"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{isTelugu ? 'వీడియో గ్యాలరీ' : 'Video Gallery'}</span>
            </button>
            <button
              onClick={() => setViewMode('player')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${
                viewMode === 'player'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Classroom Video Player"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{isTelugu ? 'క్లాస్‌రూమ్ ప్లేయర్' : 'Classroom Player'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Prominent Subject Tabs (with Marks, Count & Progress) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SYLLABUS_SUBJECTS.map((subject) => {
          const isSelected = subject.id === selectedSubjectId;
          const completedCount = subject.lectures.filter(l => 
            userProfile.completedLectureIds.includes(l.id)
          ).length;
          const pct = Math.round((completedCount / subject.lectures.length) * 100);

          return (
            <button
              key={subject.id}
              onClick={() => handleSelectSubject(subject.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden shadow-xs ${
                isSelected
                  ? 'bg-blue-50/95 border-blue-500 shadow-sm ring-1 ring-blue-500'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Youtube className="w-3 h-3 text-red-500 fill-red-500" />
                  <span>{subject.totalLectures} {isTelugu ? 'లెక్చర్లు' : 'Lectures'}</span>
                </span>
                <span className="text-xs font-bold text-slate-600 font-mono">
                  {pct}%
                </span>
              </div>

              <h3 className={`font-bold text-sm line-clamp-1 ${isSelected ? 'text-blue-950 font-black' : 'text-slate-800'}`}>
                {isTelugu ? subject.nameTelugu : subject.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-medium">
                {subject.totalMarksWeightage}
              </p>

              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    isSelected ? 'bg-blue-600' : 'bg-slate-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: SUBJECT VIDEO GALLERY (GRID VIEW) */}
      {viewMode === 'grid' && (
        <div className="space-y-6">
          {/* Active Subject Highlights & Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {isTelugu ? 'ప్రస్తుత సబ్జెక్ట్' : 'Active Subject'}
                </span>
                <span className="bg-blue-100 text-blue-800 text-[11px] px-2 py-0.5 rounded font-bold">
                  {currentSubject.totalMarksWeightage}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {isTelugu ? `${currentSubject.nameTelugu} - పూర్తి వీడియో లెక్చర్లు` : `${currentSubject.name} - Full Video Lecture Series`}
              </h2>
              <p className="text-xs text-slate-500">
                {isTelugu 
                  ? `${currentSubject.lectures.length} వీడియో తరగతులు అందుబాటులో ఉన్నాయి. క్లాస్‌రూమ్ ప్లేయర్‌లో చూడటానికి 'ప్లే చేయండి' పై క్లిక్ చేయండి.`
                  : `${currentSubject.lectures.length} video classes available. Click any lecture card to play in interactive classroom or open directly on YouTube.`}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSelectLecture(currentSubject.lectures[0], 'player')}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isTelugu ? 'మొదటి క్లాస్ ప్రారంభించండి' : 'Start First Lecture'}</span>
              </button>
              
              <a
                href={getYouTubeSearchUrlForLecture(currentSubject.name, isTelugu)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition flex items-center space-x-1.5"
              >
                <Youtube className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                <span>{isTelugu ? 'యూట్యూబ్‌లో అన్వేషించండి' : 'Explore on YouTube'}</span>
                <ExternalLink className="w-3 h-3 text-red-500" />
              </a>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTelugu ? 'టాపిక్ లేదా అధ్యాపకుని పేరును వెతకండి...' : 'Search topic, formula, or instructor...'}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
              <span className="text-slate-400 text-xs font-semibold mr-1 flex items-center">
                <Filter className="w-3.5 h-3.5 mr-1" /> {isTelugu ? 'ఫిల్టర్:' : 'Filter:'}
              </span>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  filterStatus === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isTelugu ? 'అన్నీ' : 'All'} ({currentSubject.lectures.length})
              </button>
              <button
                onClick={() => setFilterStatus('unwatched')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  filterStatus === 'unwatched'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isTelugu ? 'చూడాల్సినవి' : 'Pending'} ({currentSubject.lectures.length - currentSubjectCompletedCount})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  filterStatus === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isTelugu ? 'పూర్తయినవి' : 'Completed'} ({currentSubjectCompletedCount})
              </button>
              <button
                onClick={() => setFilterStatus('offline')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  filterStatus === 'offline'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isTelugu ? 'ఆఫ్‌లైన్' : 'Saved'}
              </button>
            </div>
          </div>

          {/* Subject Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLectures.map((lec, idx) => {
              const lecVideo = getLectureVideoData(lec.id);
              const isLecCompleted = userProfile.completedLectureIds.includes(lec.id);
              const isLecOffline = userProfile.savedOfflineLectureIds.includes(lec.id);

              return (
                <div
                  key={lec.id}
                  className={`bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                    isLecCompleted ? 'border-emerald-200 ring-1 ring-emerald-300/40' : 'border-slate-200'
                  }`}
                >
                  {/* Thumbnail Container with YouTube overlay */}
                  <div className="relative aspect-video bg-slate-900 group cursor-pointer overflow-hidden">
                    <img
                      src={lecVideo.thumbnailUrl}
                      alt={lec.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-mono font-bold rounded">
                      {lec.duration}
                    </div>

                    {/* Sequence Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded flex items-center space-x-1">
                      <Youtube className="w-3 h-3 text-red-500 fill-red-500" />
                      <span>{isTelugu ? `తరగతి #${idx + 1}` : `Class #${idx + 1}`}</span>
                    </div>

                    {/* Completed Checkmark */}
                    {isLecCompleted && (
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
                        <Check className="w-3 h-3" />
                        <span>{isTelugu ? 'పూర్తయింది' : 'Completed'}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold text-blue-600">{lec.instructor}</span>
                        <span>{lecVideo.chapters.length} {isTelugu ? 'విభాగాలు' : 'chapters'}</span>
                      </div>

                      <h3 
                        onClick={() => handleSelectLecture(lec, 'player')}
                        className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug"
                      >
                        {isTelugu ? lec.titleTelugu : lec.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {isTelugu ? lec.title : lec.titleTelugu}
                      </p>

                      {/* Topics pills */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {lec.topicsCovered.slice(0, 3).map((topic, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Highlights / Shortcut teaser */}
                      {lecVideo.boardHighlights[0]?.formulaHighlight && (
                        <div className="mt-2 p-2 bg-amber-50/70 border border-amber-200/60 rounded text-[11px] font-mono text-amber-900 line-clamp-1">
                          ⚡ {lecVideo.boardHighlights[0].formulaHighlight}
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleSelectLecture(lec, 'player')}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{isTelugu ? 'క్లాస్‌రూమ్‌లో ప్లే చేయండి' : 'Play Lecture'}</span>
                      </button>

                      <a
                        href={getYouTubeWatchUrl(lecVideo.youtubeId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition"
                        title={isTelugu ? 'యూట్యూబ్‌లో చూడండి' : 'Watch on YouTube'}
                      >
                        <Youtube className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => onToggleCompleteLecture(lec.id)}
                        className={`p-2 rounded-lg border transition ${
                          isLecCompleted
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-slate-200'
                        }`}
                        title={isLecCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onToggleOfflineDownload(lec.id)}
                        className={`p-2 rounded-lg border transition ${
                          isLecOffline
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-300'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-slate-200'
                        }`}
                        title={isLecOffline ? 'Saved Offline' : 'Save for Offline'}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLectures.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {isTelugu ? 'శోధన ఫలితాలు ఏవీ దొరకలేదు' : 'No lectures found matching your filter'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                {isTelugu ? 'ఫిల్టర్‌లను తొలగించండి' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: CLASSROOM PLAYER VIEW */}
      {viewMode === 'player' && (
        <div className="space-y-6">
          {/* Top Bar with Subject & Lecture Navigation */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center space-x-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isTelugu ? 'అన్ని లెక్చర్లు' : 'Back to Gallery'}</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-blue-600 uppercase">
                {isTelugu ? currentSubject.nameTelugu : currentSubject.name}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-semibold text-slate-700 line-clamp-1 max-w-xs">
                {isTelugu ? selectedLecture.titleTelugu : selectedLecture.title}
              </span>
            </div>

            {/* Prev / Next Lecture in Subject Playlist */}
            <div className="flex items-center space-x-2">
              <button
                disabled={!prevLecture}
                onClick={() => prevLecture && handleSelectLecture(prevLecture, 'player')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center space-x-1 ${
                  prevLecture
                    ? 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isTelugu ? 'మునుపటిది' : 'Previous'}</span>
              </button>

              <button
                disabled={!nextLecture}
                onClick={() => nextLecture && handleSelectLecture(nextLecture, 'player')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center space-x-1 ${
                  nextLecture
                    ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                }`}
              >
                <span>{isTelugu ? 'తదుపరిది' : 'Next Lecture'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Player & Interactive Study Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Video Player, Speed, Chapters (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Video Player Box */}
              <div className="bg-slate-900 rounded-xl overflow-hidden shadow-md border border-slate-800 flex flex-col">
                {/* Mode Selector & Video Utilities Header */}
                <div className="bg-slate-800/90 px-4 py-2.5 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs text-white">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold flex items-center text-slate-200">
                      <Youtube className="w-4 h-4 text-red-500 fill-red-500 mr-1.5" />
                      <span>{playerMode === 'youtube' ? 'YouTube HD Player' : playerMode === 'smartboard' ? 'Digital Smart-Board' : 'Custom Video'}</span>
                    </span>
                  </div>

                  {/* Player Mode Buttons */}
                  <div className="flex items-center space-x-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-700 text-[11px]">
                    <button
                      onClick={() => setPlayerMode('youtube')}
                      className={`px-2 py-1 rounded transition ${
                        playerMode === 'youtube'
                          ? 'bg-red-600 text-white font-bold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      YouTube
                    </button>
                    <button
                      onClick={() => setPlayerMode('smartboard')}
                      className={`px-2 py-1 rounded transition ${
                        playerMode === 'smartboard'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {isTelugu ? 'బోర్డ్ నోట్స్' : 'Smart-Board'}
                    </button>
                    <button
                      onClick={() => {
                        setPlayerMode('custom');
                        setShowCustomUrlInput(!showCustomUrlInput);
                      }}
                      className={`px-2 py-1 rounded transition ${
                        playerMode === 'custom'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {isTelugu ? 'కస్టమ్ లింక్' : 'Custom URL'}
                    </button>
                  </div>
                </div>

                {/* Custom URL Input Accordion */}
                {(playerMode === 'custom' || showCustomUrlInput) && (
                  <div className="bg-slate-800 p-3 border-b border-slate-700 flex items-center space-x-2 text-xs">
                    <input
                      type="text"
                      value={customVideoUrl}
                      onChange={(e) => setCustomVideoUrl(e.target.value)}
                      placeholder={isTelugu ? 'మీ కోచింగ్ యూట్యూబ్ లింక్ ఇక్కడ పేస్ట్ చేయండి (https://youtube.com/watch?v=...)' : 'Paste any YouTube lecture URL (e.g. https://youtu.be/...)'}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => setPlayerMode('custom')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs"
                    >
                      {isTelugu ? 'లోడ్ చేయండి' : 'Load Video'}
                    </button>
                  </div>
                )}

                {/* Screen Content: YouTube Iframe or Smart-Board */}
                <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                  {playerMode === 'youtube' || playerMode === 'custom' ? (
                    <iframe
                      ref={iframeRef}
                      key={activeYouTubeId}
                      className="w-full h-full border-0"
                      src={getYouTubeEmbedUrl(activeYouTubeId, currentTimeSec)}
                      title={selectedLecture.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    /* Smart-Board Animated Notes Mode */
                    <div className="w-full h-full p-6 bg-radial from-slate-800 to-slate-950 text-white flex flex-col justify-between overflow-y-auto">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                            Interactive Smart-Board Class
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {formatTime(currentTimeSec)} / {formatTime(selectedLecture.durationSec)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          {isTelugu ? selectedLecture.titleTelugu : selectedLecture.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {isTelugu ? 'అధ్యాపకుడు:' : 'Faculty:'} {selectedLecture.instructor}
                        </p>
                      </div>

                      {/* Smart-Board Teaching Highlights */}
                      <div className="my-auto space-y-4 py-4">
                        {videoDetails.boardHighlights.map((bh, bIdx) => (
                          <div key={bIdx} className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                            <h4 className="text-sm font-bold text-blue-400 mb-2">{bh.heading}</h4>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {bh.points.map((pt, pIdx) => (
                                <li key={pIdx} className="flex items-start space-x-2">
                                  <span className="text-emerald-400 font-bold">•</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                            {bh.formulaHighlight && (
                              <div className="mt-3 p-2 bg-blue-950/80 border border-blue-800/60 rounded text-center text-xs font-mono font-bold text-yellow-300">
                                {bh.formulaHighlight}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700 text-xs">
                        <button
                          onClick={toggleVoiceNarration}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold flex items-center space-x-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isVoiceNarrating ? 'Pause Voice Explainer' : 'Play Voice Explainer'}</span>
                        </button>
                        <span className="text-[11px] text-slate-400">High-Bandwidth Alternative</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Action Utility Strip below Video */}
                <div className="bg-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-700">
                  <div className="flex items-center space-x-2">
                    <a
                      href={getYouTubeWatchUrl(activeYouTubeId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs transition flex items-center space-x-1.5"
                    >
                      <Youtube className="w-3.5 h-3.5 fill-white" />
                      <span>{isTelugu ? 'యూట్యూబ్‌లో చూడండి (HD)' : 'Watch on YouTube (HD)'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <a
                      href={getYouTubeSearchUrlForLecture(selectedLecture.title, isTelugu)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-semibold text-xs transition flex items-center space-x-1"
                    >
                      <Search className="w-3 h-3 text-slate-300" />
                      <span>{isTelugu ? 'మరిన్ని క్లాసులు' : 'Search Telugu Videos'}</span>
                    </a>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onToggleCompleteLecture(selectedLecture.id)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center space-x-1.5 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isCompleted ? (isTelugu ? 'పూర్తయింది' : 'Completed') : (isTelugu ? 'పూర్తయినట్లు గుర్తించండి' : 'Mark Done')}</span>
                    </button>

                    <button
                      onClick={() => onToggleOfflineDownload(selectedLecture.id)}
                      className={`px-2.5 py-1.5 rounded text-xs font-semibold transition flex items-center space-x-1 ${
                        isDownloaded
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isDownloaded ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lecture Title & Details Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                      {isTelugu ? currentSubject.nameTelugu : currentSubject.name} • {selectedLecture.duration}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {isTelugu ? selectedLecture.titleTelugu : selectedLecture.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {isTelugu ? selectedLecture.title : selectedLecture.titleTelugu}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onOpenAiMentorForTopic(selectedLecture.title)}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 transition flex items-center space-x-1.5 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isTelugu ? 'AI సందేహాల నివృత్తి' : 'Ask AI Doubt'}</span>
                  </button>
                </div>

                {/* Topics Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-semibold text-slate-500 mr-1">{isTelugu ? 'అంశాలు:' : 'Topics:'}</span>
                  {selectedLecture.topicsCovered.map((topic, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Interactive Chapter Timeline Chips */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    {isTelugu ? 'చాప్టర్ టైమ్‌స్టాంప్స్ (క్లిక్ చేసి నేరుగా చూడండి):' : 'Interactive Chapter Timestamps:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {videoDetails.chapters.map((ch, chIdx) => (
                      <button
                        key={chIdx}
                        onClick={() => handleJumpToChapter(ch.timeSec)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5"
                      >
                        <span className="font-mono text-blue-600 font-bold">{ch.timeFormatted}</span>
                        <span>{isTelugu && ch.titleTelugu ? ch.titleTelugu : ch.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: PDF Notes, Lecture Quiz, Subject Playlist Tabs (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col min-h-[500px]">
                {/* Side Tabs Bar */}
                <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
                  <button
                    onClick={() => setPlayerActiveTab('notes')}
                    className={`flex-1 py-3 px-3 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
                      playerActiveTab === 'notes'
                        ? 'border-blue-600 text-blue-700 bg-white'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isTelugu ? 'రివిజన్ నోట్స్' : 'PDF Notes'}</span>
                  </button>

                  <button
                    onClick={() => setPlayerActiveTab('quiz')}
                    className={`flex-1 py-3 px-3 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
                      playerActiveTab === 'quiz'
                        ? 'border-blue-600 text-blue-700 bg-white'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isTelugu ? 'ప్రాక్టీస్ క్విజ్' : 'Quick Quiz'}</span>
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.2 rounded-full">
                      {videoDetails.practiceQuestions.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setPlayerActiveTab('playlist')}
                    className={`flex-1 py-3 px-3 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
                      playerActiveTab === 'playlist'
                        ? 'border-blue-600 text-blue-700 bg-white'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>{isTelugu ? 'ప్లేలిస్ట్' : 'Playlist'}</span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full">
                      {currentSubject.lectures.length}
                    </span>
                  </button>
                </div>

                {/* Tab 1: PDF Revision Notes */}
                {playerActiveTab === 'notes' && (
                  <div className="p-5 space-y-5 overflow-y-auto max-h-[600px] text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">
                          {isTelugu ? 'హై-ఈల్డ్ రివిజన్ చీట్ షీట్' : 'High-Yield Revision Notes'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {selectedLecture.title}
                        </span>
                      </div>
                      <button
                        onClick={() => window.print()}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center space-x-1"
                        title="Print / Save PDF"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </div>

                    {/* Key points */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-700">
                        {isTelugu ? 'కీలక భావనలు (Key Points):' : 'Key Conceptual Takeaways:'}
                      </h4>
                      <ul className="space-y-2 text-slate-700 leading-relaxed">
                        {(isTelugu && selectedLecture.pdfNotesSummary.keyPointsTelugu
                          ? selectedLecture.pdfNotesSummary.keyPointsTelugu
                          : selectedLecture.pdfNotesSummary.keyPoints
                        ).map((pt, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-blue-600 font-bold text-sm leading-none">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Shortcuts or formulas */}
                    {selectedLecture.pdfNotesSummary.formulasOrShortcuts && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                        <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center">
                          <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
                          <span>{isTelugu ? 'ఎగ్జామ్ షార్ట్‌కట్స్ & సూత్రాలు:' : 'Speed Shortcuts & Formulas:'}</span>
                        </h4>
                        <ul className="space-y-1.5 text-blue-800 font-mono text-[11px]">
                          {selectedLecture.pdfNotesSummary.formulasOrShortcuts.map((f, idx) => (
                            <li key={idx} className="bg-white/80 px-2 py-1 rounded border border-blue-100">
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Exam Hint */}
                    {selectedLecture.pdfNotesSummary.importantQuestionsHint && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                        <span className="font-bold block mb-1">
                          {isTelugu ? 'గత పరీక్షల సూచన (AP Constable Tip):' : 'Exam Insight:'}
                        </span>
                        <p className="text-[11px] leading-relaxed">
                          {selectedLecture.pdfNotesSummary.importantQuestionsHint}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Quick Quiz */}
                {playerActiveTab === 'quiz' && (
                  <div className="p-5 space-y-5 overflow-y-auto max-h-[600px] text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">
                          {isTelugu ? 'లెక్చర్ స్వీయ మూల్యాంకనం' : 'Lecture Comprehension Quiz'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {videoDetails.practiceQuestions.length} {isTelugu ? 'ప్రశ్నలు' : 'Questions'}
                        </span>
                      </div>
                      
                      {showQuizResults && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold font-mono rounded">
                          Score: {Object.entries(quizAnswers).filter(([idx, ans]) => videoDetails.practiceQuestions[Number(idx)].correctAnswer === ans).length} / {videoDetails.practiceQuestions.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      {videoDetails.practiceQuestions.map((q, qIdx) => {
                        const selectedOpt = quizAnswers[qIdx];
                        const isAnswered = selectedOpt !== undefined;
                        const isCorrect = isAnswered && selectedOpt === q.correctAnswer;

                        return (
                          <div key={qIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                            <p className="font-bold text-slate-900 text-xs">
                              {qIdx + 1}. {isTelugu && q.questionTelugu ? q.questionTelugu : q.question}
                            </p>

                            <div className="space-y-1.5">
                              {(isTelugu && q.optionsTelugu ? q.optionsTelugu : q.options).map((opt, optIdx) => {
                                const isThisOptSelected = selectedOpt === optIdx;
                                let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                                if (showQuizResults) {
                                  if (optIdx === q.correctAnswer) {
                                    btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                                  } else if (isThisOptSelected) {
                                    btnStyle = 'bg-red-100 border-red-400 text-red-900 font-bold';
                                  }
                                } else if (isThisOptSelected) {
                                  btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {showQuizResults && optIdx === q.correctAnswer && (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation shown after submit */}
                            {showQuizResults && (
                              <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900">
                                <span className="font-bold block">
                                  {isTelugu ? 'వివరణ:' : 'Explanation:'}
                                </span>
                                <p>
                                  {isTelugu && q.explanationTelugu ? q.explanationTelugu : q.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setShowQuizResults(!showQuizResults)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition"
                      >
                        {showQuizResults ? (isTelugu ? 'క్విజ్ రీసెట్ చేయండి' : 'Retake Quiz') : (isTelugu ? 'సమాధానాలు తనిఖీ చేయండి' : 'Check Answers')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 3: Subject Playlist */}
                {playerActiveTab === 'playlist' && (
                  <div className="p-3 space-y-2 overflow-y-auto max-h-[600px] text-xs">
                    <div className="p-2 text-slate-500 font-medium">
                      {isTelugu ? `${currentSubject.nameTelugu} లెక్చర్ల జాబితా:` : `Lectures in ${currentSubject.name}:`}
                    </div>

                    {currentSubject.lectures.map((lec, idx) => {
                      const isLecSelected = lec.id === selectedLecture.id;
                      const isLecDone = userProfile.completedLectureIds.includes(lec.id);

                      return (
                        <button
                          key={lec.id}
                          onClick={() => handleSelectLecture(lec, 'player')}
                          className={`w-full text-left p-3 rounded-lg border transition flex items-center justify-between gap-2 ${
                            isLecSelected
                              ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isLecSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-xs line-clamp-1">
                                {isTelugu ? lec.titleTelugu : lec.title}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {lec.duration}
                              </span>
                            </div>
                          </div>

                          {isLecDone && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CURATED SUBJECT YOUTUBE PLAYLISTS & CHANNELS DIRECTORY */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center">
              <Youtube className="w-4 h-4 mr-1.5 fill-red-600" />
              <span>{isTelugu ? 'ఆంధ్రప్రదేశ్ పోలీస్ సిఫార్సు చేయబడిన యూట్యూబ్ ప్లేలిస్టులు' : 'Curated YouTube Playlists for AP Police'}</span>
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {isTelugu ? `${currentSubject.nameTelugu} పై ప్రముఖ యూట్యూబ్ ఛానల్స్ & కోర్సులు` : `Top Free YouTube Playlists for ${currentSubject.name}`}
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {isTelugu ? 'ఉచితంగా వేలాది అదనపు ప్రశ్నలను సాధన చేయండి' : 'Free access to thousands of solved PYQs & live classes'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectPlaylists.map((pl, plIdx) => (
            <div
              key={plIdx}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-red-300 transition flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                    <Youtube className="w-3 h-3 text-red-600 fill-red-600" />
                    <span>{pl.verifiedBadge}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono font-bold">
                    {pl.lectureCountEstimated}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                  {isTelugu ? pl.playlistTitleTelugu : pl.playlistTitle}
                </h3>
                
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {isTelugu ? pl.descriptionTelugu : pl.description}
                </p>
              </div>

              <a
                href={pl.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-2 px-3 bg-white hover:bg-red-50 text-red-700 hover:text-red-800 border border-slate-200 hover:border-red-300 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Youtube className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                <span>{isTelugu ? 'ప్లేలిస్ట్ చూడండి' : 'Open on YouTube'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
