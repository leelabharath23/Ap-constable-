export type LanguagePreference = 'English' | 'Telugu';

export type ExamStage = 'Prelims' | 'Mains';

export type PostPreference = 'Civil Constable' | 'AR (Armed Reserve)' | 'APSP (Special Police)' | 'Warder / Fireman';

export interface PhysicalBenchmarks {
  gender: 'Male' | 'Female' | 'Transgender';
  heightCm: number;
  chestUnexpandedCm: number;
  chestExpandedCm: number;
  run1600mMinutes: number;
  run1600mSeconds: number;
  longJumpMeters: number;
  run100mSeconds: number;
}

export interface UserProfile {
  name: string;
  stage: ExamStage;
  post: PostPreference;
  language: LanguagePreference;
  benchmarks: PhysicalBenchmarks;
  completedLectureIds: string[];
  savedOfflineLectureIds: string[];
  completedMilestones?: string[];
  quizStreak: number;
  lastQuizDate?: string;
  testHistory: TestResult[];
}

export type SubjectCategory = 'arithmetic' | 'reasoning' | 'general_studies' | 'english';

export interface LectureChapter {
  timeSec: number;
  timeFormatted: string;
  title: string;
  titleTelugu?: string;
}

export interface LecturePracticeQuestion {
  question: string;
  questionTelugu?: string;
  options: string[];
  optionsTelugu?: string[];
  correctAnswer: number;
  explanation: string;
  explanationTelugu?: string;
}

export interface Lecture {
  id: string;
  subjectId: SubjectCategory;
  title: string;
  titleTelugu: string;
  duration: string;
  durationSec: number;
  instructor: string;
  topicsCovered: string[];
  videoUrlPlaceholder?: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  videoUrl?: string;
  chapters?: LectureChapter[];
  practiceQuestions?: LecturePracticeQuestion[];
  pdfNotesSummary: {
    keyPoints: string[];
    keyPointsTelugu?: string[];
    formulasOrShortcuts?: string[];
    importantQuestionsHint?: string;
  };
}

export interface Subject {
  id: SubjectCategory;
  name: string;
  nameTelugu: string;
  iconName: string;
  color: string;
  totalLectures: number;
  totalMarksWeightage: string;
  topics: string[];
  lectures: Lecture[];
}

export interface Question {
  id: string;
  subjectId: SubjectCategory;
  topic: string;
  questionText: string;
  questionTextTelugu?: string;
  options: {
    id: string;
    text: string;
    textTelugu?: string;
  }[];
  correctOptionId: string;
  explanation: string;
  explanationTelugu?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface MockTest {
  id: string;
  title: string;
  titleTelugu: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: number;
  stage: ExamStage;
  questions: Question[];
}

export interface QuestionResponse {
  questionId: string;
  selectedOptionId?: string;
  status: 'answered' | 'marked' | 'visited' | 'not_visited' | 'marked_and_answered';
  timeSpentSec: number;
}

export interface TestResult {
  testId: string;
  testTitle: string;
  date: string;
  totalScore: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number;
  timeSpentMinutes: number;
  subjectBreakdown: {
    [key in SubjectCategory]?: {
      correct: number;
      total: number;
      score: number;
    };
  };
  passedCutoff: boolean;
  responses: Record<string, string | undefined>;
}

export interface CurrentAffairsItem {
  id: string;
  title: string;
  titleTelugu?: string;
  category: 'AP State' | 'National' | 'Economy' | 'Polity & Schemes' | 'Sports & Awards';
  date: string;
  summary: string;
  summaryTelugu?: string;
  bulletPoints: string[];
  highYieldTag?: string;
}

export interface DailyQuiz {
  id: string;
  date: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
}

export interface StrategyMonth {
  monthNumber: number;
  title: string;
  subtitle: string;
  focusAreas: string[];
  weeklyGoals: {
    id: string;
    weekTitle: string;
    description: string;
    petFocus: string;
  }[];
}
