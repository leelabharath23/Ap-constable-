import { StrategyMonth } from '../types';

export const STUDY_STRATEGY_MONTHS: StrategyMonth[] = [
  {
    monthNumber: 1,
    title: 'Month 1: Concept Building & Foundations',
    subtitle: 'Master fundamental video lectures in Arithmetic, Reasoning & daily English grammar drills.',
    focusAreas: [
      'Complete Core Arithmetic (Number System, Ratios, Percentages, Profit & Loss)',
      'Reasoning Fundamentals (Coding-Decoding, Alphabet Series, Directions)',
      'Daily 30 Minutes on English Grammar & Subject-Verb Agreement',
      'Early light stamina warmup (1-2 km jog alternate days)',
    ],
    weeklyGoals: [
      {
        id: 'm1-w1',
        weekTitle: 'Week 1: Number Systems & Letter Coding',
        description: 'Memorize squares up to 30, cubes up to 20, and reverse alphabets (sum 27). Finish Lecture 1 of Quant and Reasoning.',
        petFocus: 'Base cardio: 1000m continuous jog at easy pace 3 days a week.',
      },
      {
        id: 'm1-w2',
        weekTitle: 'Week 2: Ratios, Proportions & Syllogisms',
        description: 'Solve 50 questions on Mean Proportional and Venn Diagram basics. Review English Articles and Prepositions.',
        petFocus: 'Leg strengthening squats and calf raises.',
      },
      {
        id: 'm1-w3',
        weekTitle: 'Week 3: Percentages & Profit-Loss Calculations',
        description: 'Practice successive percentage change formulas. Master marked price vs cost price conversions.',
        petFocus: 'Timed 1600m baseline test (log time without stressing cutoff).',
      },
      {
        id: 'm1-w4',
        weekTitle: 'Week 4: Simple & Compound Interest & Vocabulary',
        description: 'Master 2-year and 3-year CI-SI difference tricks. Memorize 100 high-frequency police exam synonyms.',
        petFocus: 'Sprint drills: 4 x 100m strides with walk-back recovery.',
      },
    ],
  },
  {
    monthNumber: 2,
    title: 'Month 2: General Studies & AP State Focus',
    subtitle: 'Deep dive into Indian Polity (Articles 14-32), Modern AP Movement, Geography & Daily News.',
    focusAreas: [
      'Indian Constitution (Fundamental Rights, Writs, DPSP, State Police)',
      'AP State Formation (1953 Andhra State, 1956, AP Reorganisation Act 2014)',
      'AP Geography, River Systems (Godavari, Krishna) & 26 Districts',
      'Daily National & AP State Current Affairs Notes',
    ],
    weeklyGoals: [
      {
        id: 'm2-w1',
        weekTitle: 'Week 5: Indian Polity & Fundamental Rights',
        description: 'Master Articles 14 to 18 (Right to Equality) and Article 32 (5 Constitutional Writs).',
        petFocus: 'Run 1600m at steady tempo twice this week. Target sub-8:30 min.',
      },
      {
        id: 'm2-w2',
        weekTitle: 'Week 6: Andhra Movement & Modern History',
        description: 'Study Potti Sreeramulu fast-unto-death, Kurnool capital establishment (1953), and Gentlemen’s agreement.',
        petFocus: 'Long jump approach marker practice: 15-meter run-up consistency.',
      },
      {
        id: 'm2-w3',
        weekTitle: 'Week 7: AP Physical Geography & Irrigation',
        description: 'Map out 974 km coastline, Eastern Ghat peaks (Jindhagada), and Polavaram project specifications.',
        petFocus: '100m sprint starts from standing stance: 5 repetitions.',
      },
      {
        id: 'm2-w4',
        weekTitle: 'Week 8: General Science & Everyday Applications',
        description: 'Vitamins & deficiency diseases, Newton laws, blood groups, and periodic elements overview.',
        petFocus: 'Interval run: 400m x 4 laps with 90s rest.',
      },
    ],
  },
  {
    monthNumber: 3,
    title: 'Month 3: Practice & Rigorous PET Training',
    subtitle: 'Solve subject-wise topic tests and escalate physical endurance for 1600m running & long jump.',
    focusAreas: [
      'Timed Sectional Tests in Quant & Reasoning (50 questions in 45 mins)',
      'General Studies speed quizzes and past 10 years question patterns',
      'PET Focus: Reach 1600m running standard (<8:00 for Civil, <7:00 for AR/APSP score)',
      'Long Jump drill: Clear 3.80m mark consistently',
    ],
    weeklyGoals: [
      {
        id: 'm3-w1',
        weekTitle: 'Week 9: Time & Work, Speed Distance & Clocks',
        description: 'Solve train speed conversion problems and LCM work method under strict time limits.',
        petFocus: 'Paced 1600m trial: maintain 1m 50s per 400m lap pace.',
      },
      {
        id: 'm3-w2',
        weekTitle: 'Week 10: Mensuration & Non-Verbal Reasoning',
        description: 'Memorize all 2D/3D formulas. Practice 40 non-verbal rotation and mirror image questions.',
        petFocus: 'Long jump takeoff foot board landing drills.',
      },
      {
        id: 'm3-w3',
        weekTitle: 'Week 11: Error Spotting & Full English Tests',
        description: 'Solve 100 error detection questions based on prepositions and subject-verb concord.',
        petFocus: 'Core workouts: Planks, lunges, and calf raises for explosive jump power.',
      },
      {
        id: 'm3-w4',
        weekTitle: 'Week 12: Comprehensive Subject Revision',
        description: 'Revisit formula sheets and AP Reorganisation Act 2014 notes. Attempt first full mock test.',
        petFocus: 'Simulated full PET test day (1600m run + Long jump + 100m run).',
      },
    ],
  },
  {
    monthNumber: 4,
    title: 'Month 4: Full-Length Mocks & Exam Conditioning',
    subtitle: 'Attempt 2 full-length 200-question mock papers per week under real 3-hour exam conditions.',
    focusAreas: [
      'Strict 3-Hour Exam Simulation (180 Minutes, 200 Questions)',
      'In-depth error analysis of wrong and skipped questions',
      'Speed optimization: ~50 seconds per question with high accuracy',
      'Tapering PET training to prevent muscle injury before ground events',
    ],
    weeklyGoals: [
      {
        id: 'm4-w1',
        weekTitle: 'Week 13: Full Mock 1 & Sectional Time Management',
        description: 'Attempt Full Mock 1 on Saturday morning 10 AM to 1 PM. Spend 3 hours reviewing solution keys.',
        petFocus: 'Light maintenance jogging 15 minutes, stretching and hydration.',
      },
      {
        id: 'm4-w2',
        weekTitle: 'Week 14: Full Mock 2 & Weak Area Remediation',
        description: 'Address bottom 20% scoring chapters from Mock 1 analytics.',
        petFocus: 'Technique check: Long jump landing extension without falling backward.',
      },
      {
        id: 'm4-w3',
        weekTitle: 'Week 15: Full Mock 3 & High-Yield AP GK Cram',
        description: 'Target 130+ marks in mock. Revise AP Welfare schemes, district stats, and current affairs.',
        petFocus: 'Sprint speed check: 100m sprint under 14.5 seconds.',
      },
      {
        id: 'm4-w4',
        weekTitle: 'Week 16: Final Mock & Pre-Exam Confidence',
        description: 'Final full mock under exam pressure. Review personal shortcut notebook. Rest before the big day!',
        petFocus: 'Rest, muscle recovery, proper sleep and mental composure.',
      },
    ],
  },
];
