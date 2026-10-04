import { LectureChapter, LecturePracticeQuestion } from '../types';

export interface LectureVideoDetails {
  youtubeId: string;
  customFallbackUrl?: string;
  thumbnailUrl: string;
  chapters: LectureChapter[];
  practiceQuestions: LecturePracticeQuestion[];
  boardHighlights: {
    heading: string;
    points: string[];
    formulaHighlight?: string;
  }[];
}

export const LECTURE_VIDEOS_MAP: Record<string, LectureVideoDetails> = {
  'arith-1': {
    youtubeId: 'qQ3r1V8Wj6A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Number System & AP Constable Exam Weightage', titleTelugu: 'సంఖ్యా వ్యవస్థ & పరీక్ష వెయిటేజ్' },
      { timeSec: 280, timeFormatted: '04:40', title: 'Prime Numbers & Divisibility Rules (7, 11, 13)', titleTelugu: 'ప్రధాన సంఖ్యలు & భాగహార సూత్రాలు' },
      { timeSec: 720, timeFormatted: '12:00', title: 'Unit Digit Cyclicity Method (2, 3, 7, 8)', titleTelugu: 'యూనిట్ డిజిట్ చక్రీయత పద్ధతి' },
      { timeSec: 1350, timeFormatted: '22:30', title: 'Solved 2018 AP Constable Prelims Questions', titleTelugu: 'గత కానిస్టేబుల్ ప్రశ్నల సాధన' },
      { timeSec: 1980, timeFormatted: '33:00', title: 'Speed Shortcuts & Remainder Theorem', titleTelugu: 'శేష సిద్ధాంతం & షార్ట్‌కట్ ట్రిక్స్' },
    ],
    practiceQuestions: [
      {
        question: 'What is the unit digit in the expression (7^105)?',
        questionTelugu: '7^105 లబ్దంలో ఒకట్ల స్థానంలోని అంకె ఎంత?',
        options: ['1', '3', '7', '9'],
        optionsTelugu: ['1', '3', '7', '9'],
        correctAnswer: 2,
        explanation: 'Cyclicity of 7 is 4. Divide power 105 by 4: remainder is 1. Thus 7^1 = 7.',
        explanationTelugu: '7 యొక్క సైక్లిసిటీ 4. 105 ని 4 తో భాగిస్తే శేషం 1 వస్తుంది. కావున 7^1 = 7.',
      },
      {
        question: 'If the number 738A6A is divisible by 11, what is the value of digit A?',
        questionTelugu: '738A6A సంఖ్య 11 చే నిశ్శేషంగా భాగించబడితే A విలువ ఎంత?',
        options: ['3', '6', '9', '4'],
        optionsTelugu: ['3', '6', '9', '4'],
        correctAnswer: 2,
        explanation: 'Sum of odd places - sum of even places: (A + A + 3) - (6 + 8 + 7) = 2A - 18. Set 2A - 18 = 0 => A = 9.',
        explanationTelugu: 'బేసి మరియు సరి స్థానాల తేడా: (2A + 3) - 21 = 2A - 18 = 0 => 2A = 18 => A = 9.',
      },
      {
        question: 'What is the sum of the first 50 natural numbers?',
        questionTelugu: 'మొదటి 50 సహజ సంఖ్యల మొత్తం ఎంత?',
        options: ['1225', '1275', '1300', '1250'],
        optionsTelugu: ['1225', '1275', '1300', '1250'],
        correctAnswer: 1,
        explanation: 'Sum = n(n+1)/2 = 50 * 51 / 2 = 1275.',
        explanationTelugu: 'మొత్తం = n(n+1)/2 = 50 * 51 / 2 = 1275.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Divisibility Rule for 11',
        points: [
          'Odd positions sum - Even positions sum must be 0 or multiple of 11',
          'Fast calculation from right to left (+ - + - method)',
        ],
        formulaHighlight: 'Rule: |Sum(Odd) - Sum(Even)| = 0, 11, 22...',
      },
      {
        heading: 'Unit Digit Cyclicity Table',
        points: [
          'Digits 0, 1, 5, 6 always retain their own unit digit for any power',
          'Digits 4, 9 have a cyclicity of 2 (odd vs even powers)',
          'Digits 2, 3, 7, 8 have a cyclicity of 4',
        ],
        formulaHighlight: 'Power mod 4 -> Remainder determines unit exponent',
      },
    ],
  },
  'arith-2': {
    youtubeId: 'z2YkEflk0Fw',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Ratio Fundamentals & AP Police Patterns', titleTelugu: 'నిష్పత్తి ప్రాథమిక సూత్రాలు' },
      { timeSec: 360, timeFormatted: '06:00', title: 'Compounding Ratios (A:B and B:C to A:B:C)', titleTelugu: 'A:B మరియు B:C నుండి A:B:C గణన' },
      { timeSec: 840, timeFormatted: '14:00', title: 'Mean, Third and Fourth Proportional', titleTelugu: 'మధ్యమ, తృతీయ & చతుర్థ అనుపాతాలు' },
      { timeSec: 1440, timeFormatted: '24:00', title: 'Age Difference Word Problems in 15 Seconds', titleTelugu: 'వయస్సు సమస్యలు - 15 సెకన్ల ట్రిక్' },
      { timeSec: 1980, timeFormatted: '33:00', title: 'Coin Denomination Value vs Number Problems', titleTelugu: 'నాణేల విలువ & సంఖ్య సమస్యలు' },
    ],
    practiceQuestions: [
      {
        question: 'If A:B = 3:4 and B:C = 8:9, what is A:C?',
        questionTelugu: 'A:B = 3:4 మరియు B:C = 8:9 అయితే A:C ఎంత?',
        options: ['1:2', '2:3', '3:2', '4:5'],
        optionsTelugu: ['1:2', '2:3', '3:2', '4:5'],
        correctAnswer: 1,
        explanation: 'A/C = (A/B) * (B/C) = (3/4) * (8/9) = 24/36 = 2/3 => 2:3.',
        explanationTelugu: 'A/C = (3/4) * (8/9) = 2/3. కావున నిష్పత్తి 2:3.',
      },
      {
        question: 'What is the mean proportional between 9 and 25?',
        questionTelugu: '9 మరియు 25 ల మధ్యమ అనుపాతం ఎంత?',
        options: ['15', '17', '225', '12.5'],
        optionsTelugu: ['15', '17', '225', '12.5'],
        correctAnswer: 0,
        explanation: 'Mean proportional = √(a * b) = √(9 * 25) = 3 * 5 = 15.',
        explanationTelugu: 'మధ్యమ అనుపాతం = √(9 * 25) = 15.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Fast Compound Ratio',
        points: [
          'Place ratios side by side: A:B = 2:3, B:C = 4:5',
          'Multiply vertically and diagonally: A = 2*4, B = 3*4, C = 3*5 => 8:12:15',
        ],
        formulaHighlight: 'Mean Proportional = √(ab)',
      },
    ],
  },
  'arith-3': {
    youtubeId: 'dO3i-2vR6k4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Fraction to Percentage Speed Chart', titleTelugu: 'భిన్నం నుండి శాతం మార్పిడి చార్ట్' },
      { timeSec: 420, timeFormatted: '07:00', title: 'Successive Percentage Formula [x + y + xy/100]', titleTelugu: 'వరుస శాతాల సూత్రం' },
      { timeSec: 1020, timeFormatted: '17:00', title: 'Price Increase & Consumption Decrease Trick', titleTelugu: 'ధర పెంపు & వినియోగం తగ్గింపు' },
      { timeSec: 1620, timeFormatted: '27:00', title: 'Area & Population Percentage Questions', titleTelugu: 'వైశాల్యం & జనాభా లెక్కలు' },
    ],
    practiceQuestions: [
      {
        question: 'If the price of sugar increases by 25%, by what percent must consumption be reduced to keep expenditure same?',
        questionTelugu: 'చక్కెర ధర 25% పెరిగితే, ఖర్చు మారకుండా ఉండటానికి వినియోగాన్ని ఎంత శాతం తగ్గించాలి?',
        options: ['20%', '25%', '16.66%', '30%'],
        optionsTelugu: ['20%', '25%', '16.66%', '30%'],
        correctAnswer: 0,
        explanation: 'Formula: [R / (100 + R)] * 100% = [25 / 125] * 100% = 1/5 * 100% = 20%.',
        explanationTelugu: 'సూత్రం: [R / (100 + R)] * 100% = [25 / 125] * 100 = 20%.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Successive Percentage Formula',
        points: [
          'Net Change % = x + y + (x*y)/100',
          'Use positive for increase and negative for decrease',
        ],
        formulaHighlight: 'Net % = x + y + (xy / 100)',
      },
    ],
  },
  'arith-4': {
    youtubeId: 'V9P4w0n7c9U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Cost Price, Selling Price & Markup Basics', titleTelugu: 'కొన్నవెల, అమ్మినవెల & ప్రకటన వెల' },
      { timeSec: 480, timeFormatted: '08:00', title: 'Two Items at Same SP with x% Profit and x% Loss', titleTelugu: 'సమాన అమ్మినవెల సమస్యలు' },
      { timeSec: 1100, timeFormatted: '18:20', title: 'Successive Discounts Equivalence', titleTelugu: 'వరుస రాయితీలు - సమతుల్య రాయితీ' },
      { timeSec: 1800, timeFormatted: '30:00', title: 'Dishonest Dealer Faulty Weights Questions', titleTelugu: 'తప్పుడు తూనికల వ్యాపారి సమస్యలు' },
    ],
    practiceQuestions: [
      {
        question: 'A shopkeeper sells two articles at ₹990 each, one at 10% profit and other at 10% loss. What is the overall result?',
        questionTelugu: 'ఒక వ్యాపారి రెండు వస్తువులను ఒక్కొక్కటి ₹990 చొప్పున అమ్మి, ఒకదానిపై 10% లాభం, మరొకదానిపై 10% నష్టం పొందాడు. మొత్తం మీద ఫలితం ఏమిటి?',
        options: ['No profit no loss', '1% loss', '1% profit', '2% loss'],
        optionsTelugu: ['లాభనష్టాలు లేవు', '1% నష్టం', '1% లాభం', '2% నష్టం'],
        correctAnswer: 1,
        explanation: 'When SP is same and profit% = loss% = x, always loss of (x/10)%² = (10/10)² = 1% loss.',
        explanationTelugu: 'అమ్మినవెల సమానమై లాభ, నష్ట శాతాలు సమానమైనప్పుడు ఎల్లప్పుడూ (x/10)² % నష్టం = 1% నష్టం వస్తుంది.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Golden Rule of Profit & Loss',
        points: [
          'Profit or Loss is ALWAYS calculated on Cost Price (CP)',
          'Equivalent Discount of D1 and D2 = [D1 + D2 - (D1*D2)/100] %',
        ],
        formulaHighlight: 'Net Loss % = (x / 10)²',
      },
    ],
  },
  'arith-5': {
    youtubeId: 'g4p8Z5n7x1M',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Simple Interest Formula & PTR/100 Core', titleTelugu: 'బారువడ్డీ సూత్రం & ప్రాథమిక భావనలు' },
      { timeSec: 360, timeFormatted: '06:00', title: 'Compound Interest Pascal Tree Method', titleTelugu: 'చక్రవడ్డీ పాస్కల్ పద్ధతి' },
      { timeSec: 900, timeFormatted: '15:00', title: 'Difference between CI and SI for 2 & 3 Years', titleTelugu: '2 & 3 సంవత్సరాల CI-SI తేడా' },
      { timeSec: 1500, timeFormatted: '25:00', title: 'Doubling and Tripling Time Shortcuts', titleTelugu: 'సొమ్ము రెట్టింపు, మూడు రెట్లు అయ్యే కాలం' },
    ],
    practiceQuestions: [
      {
        question: 'What is the difference between CI and SI on ₹5,000 for 2 years at 10% per annum?',
        questionTelugu: '₹5,000 పై సంవత్సరానికి 10% వడ్డీ రేటు చొప్పున 2 సంవత్సరాలకు చక్రవడ్డీ మరియు బారువడ్డీల మధ్య తేడా ఎంత?',
        options: ['₹40', '₹50', '₹60', '₹100'],
        optionsTelugu: ['₹40', '₹50', '₹60', '₹100'],
        correctAnswer: 1,
        explanation: 'Difference for 2 years = P * (R/100)² = 5000 * (10/100)² = 5000 * (1/100) = ₹50.',
        explanationTelugu: '2 సంవత్సరాల తేడా = P * (R/100)² = 5000 * 0.01 = ₹50.',
      },
    ],
    boardHighlights: [
      {
        heading: 'CI vs SI Difference Formulas',
        points: [
          'For 2 years: Diff = P * (R/100)²',
          'For 3 years: Diff = P * (R/100)² * (3 + R/100)',
        ],
        formulaHighlight: 'Diff(2 yrs) = P * (R / 100)²',
      },
    ],
  },
  'arith-6': {
    youtubeId: 'M7rYv6s5k8P',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'LCM Total Work Method', titleTelugu: 'కాసాగు మొత్తం పని పద్ధతి' },
      { timeSec: 420, timeFormatted: '07:00', title: 'Individual vs Combined Efficiency', titleTelugu: 'వ్యక్తుల సామర్థ్యాల విశ్లేషణ' },
      { timeSec: 1080, timeFormatted: '18:00', title: 'Alternate Days Work Questions', titleTelugu: 'ఒకరి తర్వాత ఒకరు పనిచేసే సమస్యలు' },
      { timeSec: 1680, timeFormatted: '28:00', title: 'Pipes & Cisterns with Leakage Points', titleTelugu: 'పైపులు, తొట్టెలు మరియు లీకేజీ లెక్కలు' },
    ],
    practiceQuestions: [
      {
        question: 'A can do a work in 10 days and B in 15 days. Working together, in how many days can they complete the work?',
        questionTelugu: 'A ఒక పనిని 10 రోజుల్లో, B 15 రోజుల్లో చేయగలరు. ఇద్దరూ కలిసి ఆ పనిని ఎన్ని రోజుల్లో పూర్తి చేస్తారు?',
        options: ['5 days', '6 days', '7.5 days', '8 days'],
        optionsTelugu: ['5 రోజులు', '6 రోజులు', '7.5 రోజులు', '8 రోజులు'],
        correctAnswer: 1,
        explanation: 'LCM(10, 15) = 30 units. A = 3 units/day, B = 2 units/day. Combined = 5 units/day. 30 / 5 = 6 days.',
        explanationTelugu: 'కాసాగు = 30 యూనిట్లు. A = 3 యూనిట్లు/రోజు, B = 2 యూనిట్లు/రోజు. మొత్తం 5 యూనిట్లు/రోజు. 30 / 5 = 6 రోజులు.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Man-Days Formula',
        points: [
          '(M1 * D1 * H1) / W1 = (M2 * D2 * H2) / W2',
          'Efficiency is inversely proportional to time taken',
        ],
        formulaHighlight: 'Time = Total Work / Combined Efficiency',
      },
    ],
  },
  'arith-7': {
    youtubeId: 'W3s5t9n4p2K',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: '2D Shapes: Circle, Triangle & Trapezium', titleTelugu: '2D ఆకారాలు: వృత్తం, త్రిభుజం, ట్రెపీజియం' },
      { timeSec: 540, timeFormatted: '09:00', title: '3D Solids: Cylinder, Cone, Sphere & Hemisphere', titleTelugu: '3D ఘనరూపాలు: స్థూపం, శంఖువు, గోళం' },
      { timeSec: 1260, timeFormatted: '21:00', title: 'Wire Bending and Volume Melting Equivalences', titleTelugu: 'తీగలను వంచడం & కరిగించి పోతపోసే లెక్కలు' },
      { timeSec: 1980, timeFormatted: '33:00', title: 'Frequently Trapped Formulas in Police Exams', titleTelugu: 'పోలీస్ పరీక్షల్లో అడిగే గమ్మత్తైన ప్రశ్నలు' },
    ],
    practiceQuestions: [
      {
        question: 'What is the volume of a right circular cylinder of radius 7 cm and height 10 cm? (Use π = 22/7)',
        questionTelugu: 'వ్యాసార్థం 7 సెం.మీ, ఎత్తు 10 సెం.మీ కలిగిన స్థూపం యొక్క ఘనపరిమాణం ఎంత? (π = 22/7 తీసుకోండి)',
        options: ['1540 cm³', '1450 cm³', '770 cm³', '2200 cm³'],
        optionsTelugu: ['1540 సెం.మీ³', '1450 సెం.మీ³', '770 సెం.మీ³', '2200 సెం.మీ³'],
        correctAnswer: 0,
        explanation: 'Volume = π * r² * h = (22/7) * 7 * 7 * 10 = 22 * 7 * 10 = 1540 cm³.',
        explanationTelugu: 'ఘనపరిమాణం = π * r² * h = (22/7) * 49 * 10 = 1540 సెం.మీ³.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Key Mensuration Formulas',
        points: [
          'Sphere Volume = (4/3)πr³, Surface Area = 4πr²',
          'Cone Volume = (1/3)πr²h, Slant height l = √(r² + h²)',
          'Equilateral Triangle Area = (√3 / 4) * a²',
        ],
        formulaHighlight: 'Cone Vol = (1/3) * Cylinder Vol',
      },
    ],
  },
  'arith-8': {
    youtubeId: 'B5v6k7p8n9M',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Clock Hands Angle Formula |30H - 11/2 M|', titleTelugu: 'గడియారపు ముళ్ళ మధ్య కోణం సూత్రం' },
      { timeSec: 300, timeFormatted: '05:00', title: 'Hands Coinciding, Opposite & Right Angles', titleTelugu: 'ముళ్ళు ఏకీభవించడం & వ్యతిరేక దిశలు' },
      { timeSec: 780, timeFormatted: '13:00', title: 'Calendar Odd Days & Leap Year Secrets', titleTelugu: 'క్యాలెండర్ విషమ రోజులు & లీపు సంవత్సరాలు' },
      { timeSec: 1320, timeFormatted: '22:00', title: 'Relative Speed of Trains Crossing Bridges', titleTelugu: 'రైళ్ళు, ప్లాట్‌ఫారాలు దాటే వేగాల లెక్కలు' },
    ],
    practiceQuestions: [
      {
        question: 'What is the angle between the hour hand and minute hand at 3:40?',
        questionTelugu: 'సమయం 3:40 అయినప్పుడు గడియారంలోని ముళ్ళ మధ్య కోణం ఎంత?',
        options: ['120°', '130°', '140°', '110°'],
        optionsTelugu: ['120°', '130°', '140°', '110°'],
        correctAnswer: 1,
        explanation: 'Angle θ = |30*H - (11/2)*M| = |30*3 - (11/2)*40| = |90 - 220| = |-130| = 130°.',
        explanationTelugu: 'సూత్రం θ = |30*H - (11/2)*M| = |90 - 220| = 130°.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Clock Angle Master Formula',
        points: [
          'θ = |30H - (11/2)M|',
          'If angle is > 180°, reflex angle is 360° - θ',
        ],
        formulaHighlight: 'θ = |30H - 5.5M|',
      },
    ],
  },
  'reas-1': {
    youtubeId: 'C7r8s9n0m1L',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'EJOTY Alphabet Rank Memory Trick', titleTelugu: 'EJOTY అక్షరాల ర్యాంక్ మెమరీ ట్రిక్' },
      { timeSec: 320, timeFormatted: '05:20', title: 'Reverse Letters Pair Sum = 27 (AZ, BY, CX...)', titleTelugu: 'వ్యతిరేక అక్షరాల జంటలు (మొత్తం = 27)' },
      { timeSec: 840, timeFormatted: '14:00', title: 'Alternating Shift Patterns (+1, -1, +2, -2)', titleTelugu: 'మార్పిడి నమూనాల గుర్తింపు' },
      { timeSec: 1560, timeFormatted: '26:00', title: 'Matrix & Direct Word Coding in Police Papers', titleTelugu: 'మ్యాట్రిక్స్ & డైరెక్ట్ వర్డ్ కోడింగ్' },
    ],
    practiceQuestions: [
      {
        question: 'If POLICE is coded as QNMJBD (+1, -1, +1, -1...), how is STATE coded in the same pattern?',
        questionTelugu: 'POLICE ను QNMJBD గా కోడ్ చేస్తే, అదే విధంగా STATE ను ఎలా కోడ్ చేస్తారు?',
        options: ['TSBSF', 'TUBSF', 'TKBSE', 'SSATF'],
        optionsTelugu: ['TSBSF', 'TUBSF', 'TKBSE', 'SSATF'],
        correctAnswer: 0,
        explanation: 'S(+1)->T, T(-1)->S, A(+1)->B, T(-1)->S, E(+1)->F => TSBSF.',
        explanationTelugu: 'S(+1)->T, T(-1)->S, A(+1)->B, T(-1)->S, E(+1)->F. కావున సమాధానం TSBSF.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Alphabet Ranks & Opposites',
        points: [
          'EJOTY: E=5, J=10, O=15, T=20, Y=25',
          'Sum of opposite pairs is always 27: A(1) + Z(26) = 27',
        ],
        formulaHighlight: 'Reverse Rank = 27 - Normal Rank',
      },
    ],
  },
  'reas-2': {
    youtubeId: 'S4p5q6r7s8T',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Venn Diagram Representation for All & Some', titleTelugu: 'వెన్ చిత్రాలు: All మరియు Some' },
      { timeSec: 420, timeFormatted: '07:00', title: 'Negative Statements (No & Some Not)', titleTelugu: 'వ్యతిరేక ప్రకటనలు: No & Some Not' },
      { timeSec: 1080, timeFormatted: '18:00', title: 'The 3 Gold Conditions for Either-Or', titleTelugu: 'Either-Or మూడు బంగారు నియమాలు' },
      { timeSec: 1740, timeFormatted: '29:00', title: 'Possibility Cases in AP Police Constable Papers', titleTelugu: 'సాధ్యమయ్యే సందర్భాల విశ్లేషణ' },
    ],
    practiceQuestions: [
      {
        question: 'Statements: 1. All apples are fruits. 2. All fruits are sweet. Conclusion: All apples are sweet.',
        questionTelugu: 'ప్రకటనలు: 1. అన్ని యాపిల్స్ పండ్లు. 2. అన్ని పండ్లు తీపి. ముగింపు: అన్ని యాపిల్స్ తీపి.',
        options: ['Follows', 'Does not follow', 'Either follows', 'Neither follows'],
        optionsTelugu: ['సత్యం అవుతుంది', 'సత్యం కాదు', 'ఏదో ఒకటి సత్యం', 'ఏదీ సత్యం కాదు'],
        correctAnswer: 0,
        explanation: 'All A are B and All B are C directly implies All A are C.',
        explanationTelugu: 'అన్ని A లు B మరియు అన్ని B లు C అయినప్పుడు అన్ని A లు C ఖచ్చితంగా అవుతాయి.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Syllogism Either-Or Rule',
        points: [
          'Both conclusions individually must be doubtful',
          'Subjects and predicates must be identical',
          'One affirmative (Some/All) and one negative (No/Some Not)',
        ],
        formulaHighlight: 'Complementary Pairs: Some + No | All + Some Not',
      },
    ],
  },
  'reas-3': {
    youtubeId: 'B3r4s5t6u7V',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Standard Family Tree Notation (+ / - / = / |)', titleTelugu: 'ఫ్యామిలీ ట్రీ ప్రామాణిక చిహ్నాలు' },
      { timeSec: 360, timeFormatted: '06:00', title: 'Pointing to a Photograph Step-by-Step Breakdown', titleTelugu: 'ఫొటోను చూపిస్తూ చెప్పే సంబంధాలు' },
      { timeSec: 960, timeFormatted: '16:00', title: 'Maternal vs Paternal Relations in Telugu and English', titleTelugu: 'మేనమామ, పినతండ్రి, బాబాయ్ బంధుత్వాలు' },
      { timeSec: 1560, timeFormatted: '26:00', title: 'Coded Relations (A + B means A is mother of B)', titleTelugu: 'కోడెడ్ రక్త సంబంధాలు' },
    ],
    practiceQuestions: [
      {
        question: 'Pointing to a photograph, Suresh says, "She is the daughter of my grandfather\'s only son." How is the girl related to Suresh?',
        questionTelugu: 'ఒక ఫోటోను చూపిస్తూ సురేష్, "ఈమె మా తాతగారి ఏకైక కుమారుడి కుమార్తె" అని చెప్పాడు. ఆ బాలిక సురేష్‌కు ఏమవుతుంది?',
        options: ['Sister', 'Mother', 'Cousin', 'Aunt'],
        optionsTelugu: ['సోదరి (చెల్లి/అక్క)', 'తల్లి', 'మేనకోడలు', 'అత్త'],
        correctAnswer: 0,
        explanation: 'Grandfather\'s only son = Suresh\'s Father. Daughter of Suresh\'s father = Suresh\'s Sister.',
        explanationTelugu: 'తాతగారి ఏకైక కుమారుడు = సురేష్ తండ్రి. తండ్రి కుమార్తె = సురేష్ సోదరి.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Family Tree Symbols',
        points: [
          '[+] Male, [-] Female',
          '[=] Husband & Wife, [—] Siblings, [|] Generation vertical drop',
        ],
        formulaHighlight: 'Read "Pointing to photograph" from back to front',
      },
    ],
  },
  'reas-4': {
    youtubeId: 'D2s3t4u5v6W',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Cardinal & Intercardinal Compass Grid', titleTelugu: 'దిశల దిక్సూచి పట్టిక' },
      { timeSec: 300, timeFormatted: '05:00', title: 'Right Turn (Clockwise 90°) & Left Turn', titleTelugu: 'కుడి మరియు ఎడమ మలుపులు' },
      { timeSec: 720, timeFormatted: '12:00', title: 'Pythagoras Theorem Shortest Distance c = √(a² + b²)', titleTelugu: 'పైథాగరస్ సిద్ధాంతం - కనిష్ట దూరం' },
      { timeSec: 1200, timeFormatted: '20:00', title: 'Morning & Evening Sun Shadow Problems', titleTelugu: 'సూర్యోదయం & సూర్యాస్తమయం నీడ సమస్యలు' },
    ],
    practiceQuestions: [
      {
        question: 'A person walks 3 km North, then turns right and walks 4 km. How far is he from the starting point?',
        questionTelugu: 'ఒక వ్యక్తి ఉత్తరం వైపు 3 కి.మీ నడిచి, కుడివైపుకు తిరిగి 4 కి.మీ నడిచాడు. ప్రారంభ స్థానం నుండి అతను ఎంత దూరంలో ఉన్నాడు?',
        options: ['5 km', '7 km', '1 km', '25 km'],
        optionsTelugu: ['5 కి.మీ', '7 కి.మీ', '1 కి.మీ', '25 కి.మీ'],
        correctAnswer: 0,
        explanation: 'Distance = √(3² + 4²) = √(9 + 16) = √25 = 5 km.',
        explanationTelugu: 'దూరం = √(3² + 4²) = √25 = 5 కి.మీ.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Shadow Rules',
        points: [
          'Morning: Sun in East => Shadow falls towards WEST',
          'Evening: Sun in West => Shadow falls towards EAST',
          'Noon (12 PM): No shadow directly cast to side',
        ],
        formulaHighlight: 'Shortest Distance = √(Δx² + Δy²)',
      },
    ],
  },
  'reas-5': {
    youtubeId: 'M1t2u3v4w5X',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Mirror Image: Left-Right Flip Principles', titleTelugu: 'దర్పణ ప్రతిబింబం: ఎడమ-కుడి మార్పు' },
      { timeSec: 360, timeFormatted: '06:00', title: 'Water Image: Top-Bottom Inversion Rules', titleTelugu: 'నీటి ప్రతిబింబం: పైకి-క్రిందికి మార్పు' },
      { timeSec: 840, timeFormatted: '14:00', title: 'Dice Net Folding & Opposite Faces Rule (Sum = 7)', titleTelugu: 'పాచికల ఎదురెదురు ముఖాలు' },
      { timeSec: 1380, timeFormatted: '23:00', title: 'Paper Folding & Punching Patterns', titleTelugu: 'పేపర్ మడత & రంధ్రాల నమూనాలు' },
    ],
    practiceQuestions: [
      {
        question: 'In a standard dice, what is the face opposite to number 2?',
        questionTelugu: 'ప్రామాణిక పాచికలో 2 సంఖ్యకు ఎదురుగా ఉండే ముఖంపై సంఖ్య ఎంత?',
        options: ['5', '6', '4', '3'],
        optionsTelugu: ['5', '6', '4', '3'],
        correctAnswer: 0,
        explanation: 'In a standard dice, sum of opposite faces is always 7. Hence opposite of 2 is 7 - 2 = 5.',
        explanationTelugu: 'ప్రామాణిక పాచికలో ఎదురెదురు ముఖాల మొత్తం 7. కావున 2 కు ఎదురుగా 5 ఉంటుంది.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Mirror vs Water Inversion',
        points: [
          'Vertical Mirror: Left becomes Right; Top & Bottom stay same',
          'Horizontal Mirror (Water): Top becomes Bottom; Left & Right stay same',
        ],
        formulaHighlight: 'Standard Dice Opposite Sum = 7',
      },
    ],
  },
  'reas-6': {
    youtubeId: 'D9u0v1w2x3Y',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Data Sufficiency Evaluation Framework', titleTelugu: 'దత్తాంశ సమగ్రత విశ్లేషణ పద్ధతి' },
      { timeSec: 420, timeFormatted: '07:00', title: 'When Statement I Alone is Sufficient', titleTelugu: 'స్టేట్‌మెంట్ I మాత్రమే సరిపోయే సందర్భం' },
      { timeSec: 960, timeFormatted: '16:00', title: 'When Both Statements Combined are Required', titleTelugu: 'రెండు స్టేట్‌మెంట్లు కలిపి అవసరమయ్యే సందర్భం' },
      { timeSec: 1560, timeFormatted: '26:00', title: 'Circular & Linear Seating Arrangement Shortcuts', titleTelugu: 'వృత్తాకార & సరళరేఖా సీటింగ్ అరేంజ్‌మెంట్' },
    ],
    practiceQuestions: [
      {
        question: 'In Data Sufficiency questions, should you calculate the exact numerical answer?',
        questionTelugu: 'దత్తాంశ సమగ్రత ప్రశ్నలలో ఖచ్చితమైన సంఖ్యను లెక్కించాల్సిన అవసరం ఉందా?',
        options: ['No, only check if unique answer is determinable', 'Yes, full calculation is mandatory', 'Only in math questions', 'Depends on negative marks'],
        optionsTelugu: ['లేదు, సమాధానం వస్తుందో లేదో చూస్తే చాలు', 'అవును, పూర్తిగా లెక్కించాలి', 'గణితంలో మాత్రమే', 'నెగటివ్ మార్కులను బట్టి'],
        correctAnswer: 0,
        explanation: 'Data sufficiency tests whether the information given is adequate to answer uniquely without wasting time calculating numerical values.',
        explanationTelugu: 'సమాచారం సరిపోతుందో లేదో మాత్రమే తనిఖీ చేయాలి, పూర్తి విలువను లెక్కించకూడదు.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Data Sufficiency Trap',
        points: [
          'Do NOT solve completely; stop as soon as uniqueness is established',
          'If statement yields 2 contradictory answers, it is NOT sufficient',
        ],
        formulaHighlight: 'Goal: Determine Sufficiency, not Value',
      },
    ],
  },
  'reas-7': {
    youtubeId: 'N8v9w0x1y2Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Element Rotation (Clockwise & Counter-Clockwise 45°/90°)', titleTelugu: 'మూలకాల భ్రమణం (45° & 90°)' },
      { timeSec: 360, timeFormatted: '06:00', title: 'Geometric Shape Side Addition and Deletion', titleTelugu: 'భుజాల సంఖ్య పెరగడం & తగ్గడం' },
      { timeSec: 840, timeFormatted: '14:00', title: 'Embedded Figure Pattern Detection', titleTelugu: 'దాగి ఉన్న బొమ్మలను గుర్తించడం' },
      { timeSec: 1320, timeFormatted: '22:00', title: 'Alternating Frame Sequences (1->3, 2->4)', titleTelugu: 'ఏకాంతర ఫ్రేమ్ శ్రేణులు' },
    ],
    practiceQuestions: [
      {
        question: 'In a non-verbal series, if an arrow turns 45° clockwise in every frame, what is its orientation after 4 frames starting from North?',
        questionTelugu: 'బాణం గుర్తు ప్రతి ఫ్రేమ్‌లో 45° సవ్యదిశలో తిరిగితే, ఉత్తరం నుండి ప్రారంభించి 4 ఫ్రేమ్‌ల తర్వాత దాని దిశ ఏది?',
        options: ['South', 'East', 'North-East', 'South-East'],
        optionsTelugu: ['దక్షిణం', 'తూర్పు', 'ఈశాన్యం', 'ఆగ్నేయం'],
        correctAnswer: 0,
        explanation: 'North -> 45° to NE -> 45° to East -> 45° to SE -> 45° to South (Total 180° turn).',
        explanationTelugu: 'మొత్తం 4 * 45° = 180° సవ్యదిశ భ్రమణం. కావున ఉత్తరానికి ఎదురుగా ఉండే దక్షిణం అవుతుంది.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Series Tracking Tip',
        points: [
          'Track only ONE feature at a time across the frames',
          'Watch for shaded vs unshaded flips',
        ],
        formulaHighlight: 'Check: Alternating Steps (Frame 1 & 3, Frame 2 & 4)',
      },
    ],
  },
  'gs-1': {
    youtubeId: 'P7w8x9y0z1A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Preamble & Fundamental Rights Overview', titleTelugu: 'పీఠిక & ప్రాథమిక హక్కుల అవలోకనం' },
      { timeSec: 480, timeFormatted: '08:00', title: 'Right to Equality (Articles 14 to 18)', titleTelugu: 'సమానత్వపు హక్కు (ఆర్టికల్స్ 14-18)' },
      { timeSec: 1200, timeFormatted: '20:00', title: 'Right to Freedom & Article 21 Personal Liberty', titleTelugu: 'స్వేచ్ఛా హక్కు & ఆర్టికల్ 21 జీవించే హక్కు' },
      { timeSec: 1980, timeFormatted: '33:00', title: 'Article 32 - Heart & Soul & The 5 Writs', titleTelugu: 'ఆర్టికల్ 32 & 5 రకాల రిట్లు' },
      { timeSec: 2700, timeFormatted: '45:00', title: 'Police Powers under Constitution & Due Process', titleTelugu: 'పోలీస్ అధికారాలు & రాజ్యాంగ రక్షణలు' },
    ],
    practiceQuestions: [
      {
        question: 'Which Article of the Indian Constitution abolishes Untouchability?',
        questionTelugu: 'భారత రాజ్యాంగంలోని ఏ ఆర్టికల్ అస్పృశ్యతను రద్దు చేస్తుంది?',
        options: ['Article 14', 'Article 17', 'Article 19', 'Article 21'],
        optionsTelugu: ['ఆర్టికల్ 14', 'ఆర్టికల్ 17', 'ఆర్టికల్ 19', 'ఆర్టికల్ 21'],
        correctAnswer: 1,
        explanation: 'Article 17 explicitly abolishes untouchability and forbids its practice in any form.',
        explanationTelugu: 'ఆర్టికల్ 17 అస్పృశ్యతను రద్దు చేసి, దాని ఆచరణను శిక్షార్హమైన నేరంగా ప్రకటించింది.',
      },
      {
        question: 'Which writ literally means "We Command" in Latin?',
        questionTelugu: 'లాటిన్ భాషలో "మేము ఆజ్ఞాపిస్తున్నాము" అని అర్థం ఇచ్చే రిట్ ఏది?',
        options: ['Habeas Corpus', 'Mandamus', 'Certiorari', 'Quo-Warranto'],
        optionsTelugu: ['హేబియస్ కార్పస్', 'మాండమస్', 'సెర్షియోరరి', 'కో-వారంటో'],
        correctAnswer: 1,
        explanation: 'Mandamus means "We Command". It is issued to a public official to perform their official duties.',
        explanationTelugu: 'మాండమస్ అంటే "మేము ఆజ్ఞాపిస్తున్నాము". ప్రభుత్వ అధికారి తన చట్టబద్ధమైన విధిని నిర్వహించనప్పుడు న్యాయస్థానం ఈ రిట్ జారీ చేస్తుంది.',
      },
    ],
    boardHighlights: [
      {
        heading: 'The 6 Fundamental Rights',
        points: [
          'Right to Equality (Articles 14-18)',
          'Right to Freedom (Articles 19-22)',
          'Right against Exploitation (Articles 23-24)',
          'Right to Freedom of Religion (Articles 25-28)',
          'Cultural & Educational Rights (Articles 29-30)',
          'Right to Constitutional Remedies (Article 32)',
        ],
        formulaHighlight: 'Memory Trick: E-F-E-R-C-R',
      },
    ],
  },
  'gs-2': {
    youtubeId: 'H6x7y8z9a0B',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: '1857 Revolt & Freedom Movement in Andhra', titleTelugu: '1857 తిరుగుబాటు & ఆంధ్రలో జాతీయోద్యమం' },
      { timeSec: 600, timeFormatted: '10:00', title: 'Amarajeevi Potti Sreeramulu Historic Fast (1952)', titleTelugu: 'అమరజీవి పొట్టి శ్రీరాములు ఆమరణ నిరాహారదీక్ష' },
      { timeSec: 1440, timeFormatted: '24:00', title: 'Formation of Andhra State (1 Oct 1953, Kurnool)', titleTelugu: 'ఆంధ్ర రాష్ట్ర అవతరణ (1953 అక్టోబర్ 1)' },
      { timeSec: 2160, timeFormatted: '36:00', title: 'Gentlemen\'s Agreement 1956 & Andhra Pradesh Formed', titleTelugu: 'పెద్దమనుషుల ఒప్పందం 1956' },
      { timeSec: 2880, timeFormatted: '48:00', title: 'AP Reorganisation Act 2014 & Bifurcation Sections', titleTelugu: 'ఆంధ్రప్రదేశ్ పునర్వ్యవస్థీకరణ చట్టం 2014' },
    ],
    practiceQuestions: [
      {
        question: 'Who was the first Chief Minister of Andhra State formed on 1 October 1953?',
        questionTelugu: '1953 అక్టోబర్ 1న ఏర్పడిన ఆంధ్ర రాష్ట్ర తొలి ముఖ్యమంత్రి ఎవరు?',
        options: ['Tanguturi Prakasam Pantulu', 'Neelam Sanjiva Reddy', 'Bhavanam Venkataram', 'P.V. Narasimha Rao'],
        optionsTelugu: ['టంగుటూరి ప్రకాశం పంతులు', 'నీలం సంజీవ రెడ్డి', 'భవనం వెంకట్రామ్', 'పి.వి. నరసింహారావు'],
        correctAnswer: 0,
        explanation: 'Tanguturi Prakasam Pantulu (Andhra Kesari) was the first Chief Minister of Andhra State with Kurnool as capital.',
        explanationTelugu: 'కర్నూలు రాజధానిగా ఏర్పడిన ఆంధ్ర రాష్ట్రానికి టంగుటూరి ప్రకాశం పంతులు తొలి ముఖ్యమంత్రిగా పనిచేశారు.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Key Landmark Dates in AP History',
        points: [
          '15 Dec 1952: Potti Sreeramulu attained martyrdom after 58 days fast',
          '1 Oct 1953: Andhra State created with Kurnool capital and Guntur High Court',
          '1 Nov 1956: Andhra Pradesh formed combining Andhra and Telangana',
          '2 June 2014: AP Reorganisation Act appointed date',
        ],
        formulaHighlight: 'First Linguistic State in India = Andhra State',
      },
    ],
  },
  'gs-3': {
    youtubeId: 'G5y6z7a8b9C',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Coastline (974 km) & Borders of Andhra Pradesh', titleTelugu: 'తీరరేఖ (974 కి.మీ) & సరిహద్దులు' },
      { timeSec: 480, timeFormatted: '08:00', title: 'Godavari, Krishna & Penna River Basins', titleTelugu: 'గోదావరి, కృష్ణా, పెన్నా నదీ పరీవాహకాలు' },
      { timeSec: 1200, timeFormatted: '20:00', title: 'Polavaram Multi-Purpose Irrigation Project Details', titleTelugu: 'పోలవరం ప్రాజెక్టు ముఖ్య విశేషాలు' },
      { timeSec: 1800, timeFormatted: '30:00', title: '26 Reorganized Districts & Headquarters', titleTelugu: '26 పునర్వ్యవస్థీకృత జిల్లాలు & కేంద్రాలు' },
    ],
    practiceQuestions: [
      {
        question: 'What is the length of the Andhra Pradesh coastline?',
        questionTelugu: 'ఆంధ్రప్రదేశ్ రాష్ట్ర తీరరేఖ పొడవు ఎంత?',
        options: ['974 km', '751 km', '1050 km', '840 km'],
        optionsTelugu: ['974 కి.మీ', '751 కి.మీ', '1050 కి.మీ', '840 కి.మీ'],
        correctAnswer: 0,
        explanation: 'AP has a 974 km long coastline, the second longest in mainland India after Gujarat.',
        explanationTelugu: 'ఆంధ్రప్రదేశ్ 974 కి.మీ తీరరేఖ కలిగి ఉంది (గుజరాత్ తర్వాత దేశంలో రెండవ స్థానం).',
      },
    ],
    boardHighlights: [
      {
        heading: 'Major River Systems in AP',
        points: [
          'Godavari: Enters AP, flows through Kunavaram to Polavaram into Bay of Bengal',
          'Krishna: Srisailam & Nagarjuna Sagar reservoirs; Prakasam Barrage Vijayawada',
          'Penna: Somasila Dam Nellore',
        ],
        formulaHighlight: 'Highest Peak in AP = Jindhagada Peak (1690m)',
      },
    ],
  },
  'gs-4': {
    youtubeId: 'S4z5a6b7c8D',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Newton\'s Laws of Motion & Everyday Mechanics', titleTelugu: 'న్యూటన్ చలన నియమాలు' },
      { timeSec: 480, timeFormatted: '08:00', title: 'Acids, Bases, Salts & Blood pH Scale', titleTelugu: 'ఆమ్లాలు, క్షారాలు & రక్తపు pH విలువ' },
      { timeSec: 1200, timeFormatted: '20:00', title: 'Vitamins & Deficiency Diseases (A, B-complex, C, D)', titleTelugu: 'విటమిన్లు & లోప వ్యాధులు' },
      { timeSec: 1800, timeFormatted: '30:00', title: 'Blood Groups (ABO system, Universal Donor O-)', titleTelugu: 'రక్త వర్గాలు (సార్వత్రిక దాత O-)' },
    ],
    practiceQuestions: [
      {
        question: 'Which blood group is known as the Universal Donor?',
        questionTelugu: 'సార్వత్రిక దాతగా పిలువబడే రక్త వర్గం ఏది?',
        options: ['O-negative', 'O-positive', 'AB-positive', 'B-negative'],
        optionsTelugu: ['O-నెగెటివ్', 'O-పాజిటివ్', 'AB-పాజిటివ్', 'B-నెగెటివ్'],
        correctAnswer: 0,
        explanation: 'O-negative lacks A, B, and Rh antigens, making it universally acceptable for emergency transfusions.',
        explanationTelugu: 'O-నెగెటివ్ రక్తంలో A, B మరియు Rh యాంటిజెన్లు ఉండవు, కావున ఇది సార్వత్రిక దాత.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Common Science Facts for Police Exam',
        points: [
          'Normal blood pH: 7.35 to 7.45 (slightly alkaline)',
          'Vitamin C (Ascorbic acid) deficiency causes Scurvy',
          'Rocket propulsion operates on Newton’s 3rd Law of Motion',
        ],
        formulaHighlight: 'Force: F = m * a (Newton’s 2nd Law)',
      },
    ],
  },
  'gs-5': {
    youtubeId: 'E3a4b5c6d7E',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'AP Economy Structure: Agriculture, Aqua & Ports', titleTelugu: 'ఆంధ్రప్రదేశ్ ఆర్థిక వ్యవస్థ ముఖ్యాంశాలు' },
      { timeSec: 420, timeFormatted: '07:00', title: 'Major Ports: Visakhapatnam, Krishnapatnam, Kakinada', titleTelugu: 'ప్రధాన ఓడరేవులు & పారిశ్రామిక కారిడార్లు' },
      { timeSec: 1020, timeFormatted: '17:00', title: 'State Welfare Schemes & DBT Direct Transfers', titleTelugu: 'సంక్షేమ పథకాలు & నగదు బదిలీ విధానం' },
      { timeSec: 1680, timeFormatted: '28:00', title: 'NITI Aayog Sustainable Development Standing of AP', titleTelugu: 'నీతి ఆయోగ్ సుస్థిర అభివృద్ధి నివేదిక' },
    ],
    practiceQuestions: [
      {
        question: 'Which city in Andhra Pradesh is home to a major natural harbour and naval command?',
        questionTelugu: 'ఆంధ్రప్రదేశ్‌లో ప్రముఖ సహజ ఓడరేవు మరియు నౌకాదళ కమాండ్ ఉన్న నగరం ఏది?',
        options: ['Visakhapatnam', 'Machilipatnam', 'Kakinada', 'Nellore'],
        optionsTelugu: ['విశాఖపట్నం', 'మచిలీపట్నం', 'కాకినాడ', 'నెల్లూరు'],
        correctAnswer: 0,
        explanation: 'Visakhapatnam is a premier natural harbour and headquarters of Eastern Naval Command.',
        explanationTelugu: 'విశాఖపట్నం సహజ సిద్ధమైన ఓడరేవు మరియు తూర్పు నౌకాదళ ప్రధాన కేంద్రం.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Economic Pillars of AP',
        points: [
          'Leading state in egg, fish, and shrimp production in India',
          'Vizag-Chennai Industrial Corridor (VCIC) flagship projects',
        ],
        formulaHighlight: 'GSDP: Gross State Domestic Product',
      },
    ],
  },
  'gs-6': {
    youtubeId: 'A2b3c4d5e6F',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'AP Police Hierarchy: Constable to DGP', titleTelugu: 'పోలీస్ శ్రేణి: కానిస్టేబుల్ నుండి డీజీపీ వరకు' },
      { timeSec: 360, timeFormatted: '06:00', title: 'Civil Police vs Armed Reserve (AR) vs APSP Battalions', titleTelugu: 'సివిల్, ఆర్మ్డ్ రిజర్వ్ & ఏపీఎస్పీ విభాగాల విధులు' },
      { timeSec: 960, timeFormatted: '16:00', title: 'FIR, General Diary & Search/Seizure Legal Norms', titleTelugu: 'ఎఫ్ఐఆర్ & అరెస్ట్ చట్టపరమైన నియమాలు' },
      { timeSec: 1560, timeFormatted: '26:00', title: 'Official State Symbols of Andhra Pradesh', titleTelugu: 'ఆంధ్రప్రదేశ్ అధికారిక రాష్ట్ర చిహ్నాలు' },
    ],
    practiceQuestions: [
      {
        question: 'What is the State Animal of Andhra Pradesh?',
        questionTelugu: 'ఆంధ్రప్రదేశ్ రాష్ట్ర జంతువు ఏది?',
        options: ['Blackbuck (కృష్ణజింక)', 'Tiger (పులి)', 'Elephant (ఏనుగు)', 'Spotted Deer (మచ్చల జింక)'],
        optionsTelugu: ['కృష్ణజింక', 'పులి', 'ఏనుగు', 'మచ్చల జింక'],
        correctAnswer: 0,
        explanation: 'The Blackbuck (కృష్ణజింక) is the official State Animal of Andhra Pradesh.',
        explanationTelugu: 'కృష్ణజింక ఆంధ్రప్రదేశ్ రాష్ట్ర అధికారిక జంతువు.',
      },
      {
        question: 'What is the motto of the Andhra Pradesh Police?',
        questionTelugu: 'ఆంధ్రప్రదేశ్ పోలీస్ నినాదం (మొట్టో) ఏమిటి?',
        options: ['With You For You (ప్రజల సేవలో)', 'Satyamev Jayate', 'Service Before Self', 'Always Alert'],
        optionsTelugu: ['ప్రజల సేవలో (With You For You)', 'సత్యమేవ జయతే', 'దేశ రక్షణే ధ్యేయం', 'ఎల్లప్పుడూ అప్రమత్తం'],
        correctAnswer: 0,
        explanation: 'The motto of AP Police is "With You For You" (ప్రజల సేవలో).',
        explanationTelugu: 'ఆంధ్రప్రదేశ్ పోలీస్ వారి ధ్యేయ వాక్యం "ప్రజల సేవలో" (With You For You).',
      },
    ],
    boardHighlights: [
      {
        heading: 'AP State Symbols Quick Sheet',
        points: [
          'State Animal: Blackbuck (కృష్ణజింక)',
          'State Bird: Rose-ringed parakeet (రామచిలుక)',
          'State Tree: Neem (వేప చెట్టు)',
          'State Flower: Jasmine (మల్లెపూవు)',
        ],
        formulaHighlight: 'AP Police Motto: "With You For You"',
      },
    ],
  },
  'eng-1': {
    youtubeId: 'E1c2d3e4f5G',
    thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Subject-Verb Agreement Core Rules', titleTelugu: 'సబ్జెక్ట్-వెర్బ్ అగ్రీమెంట్ ప్రాథమిక నియమాలు' },
      { timeSec: 360, timeFormatted: '06:00', title: 'Either...Or and Neither...Nor Nearest Subject Rule', titleTelugu: 'Either/Or మరియు Neither/Nor నియమాలు' },
      { timeSec: 900, timeFormatted: '15:00', title: 'Uncountable Nouns (Furniture, Luggage, Advice)', titleTelugu: 'లెక్కించలేని నామవాచకాలు' },
      { timeSec: 1440, timeFormatted: '24:00', title: 'Since vs For with Perfect Continuous Tenses', titleTelugu: 'Since మరియు For సరైన ఉపయోగం' },
    ],
    practiceQuestions: [
      {
        question: 'Neither the teacher nor the students ______ present in the auditorium yesterday.',
        questionTelugu: 'Neither the teacher nor the students ______ present in the auditorium yesterday. (సరైన వెర్బ్ ఎంచుకోండి)',
        options: ['were', 'was', 'is', 'are'],
        optionsTelugu: ['were', 'was', 'is', 'are'],
        correctAnswer: 0,
        explanation: 'When connected with "neither...nor", the verb agrees with the closer subject ("the students" -> plural past verb "were").',
        explanationTelugu: '"neither...nor" తో కలిపినప్పుడు దగ్గరగా ఉన్న సబ్జెక్ట్ (students - బహువచనం) ప్రకారం "were" వస్తుంది.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Essential Grammar Rule',
        points: [
          'Nouns like luggage, baggage, advice, furniture, news are always uncountable and singular',
          '"Since" denotes fixed starting point of time; "For" denotes duration of time',
        ],
        formulaHighlight: 'Verb matches closest subject with Either/Or & Neither/Nor',
      },
    ],
  },
  'eng-2': {
    youtubeId: 'A0d1e2f3g4H',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Vowel Sound vs Vowel Letter (A vs An)', titleTelugu: 'అచ్చు శబ్దం vs అచ్చు అక్షరం (A vs An)' },
      { timeSec: 360, timeFormatted: '06:00', title: 'Definite Article "The" with Rivers & Monuments', titleTelugu: '"The" ఆర్టికల్ సరైన ఉపయోగాలు' },
      { timeSec: 840, timeFormatted: '14:00', title: 'Omission of Articles (No Article before languages)', titleTelugu: 'ఆర్టికల్స్ వాడని సందర్భాలు' },
      { timeSec: 1380, timeFormatted: '23:00', title: 'Fixed Prepositions Traps (Senior to, Congratulate on)', titleTelugu: 'ప్రిపోజిషన్స్ పరీక్షా ట్రిక్స్' },
    ],
    practiceQuestions: [
      {
        question: 'Choose the correct article: "He is ______ honest police officer."',
        questionTelugu: 'సరైన ఆర్టికల్‌ను ఎంచుకోండి: "He is ______ honest police officer."',
        options: ['an', 'a', 'the', 'no article'],
        optionsTelugu: ['an', 'a', 'the', 'ఆర్టికల్ అవసరం లేదు'],
        correctAnswer: 0,
        explanation: '"Honest" begins with a silent \'h\' and a vowel sound /ɒ/, so it takes "an".',
        explanationTelugu: '"Honest" పదం అచ్చు శబ్దంతో (ఆనెస్ట్) ప్రారంభమవుతుంది కావున "an" వస్తుంది.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Articles Rule of Thumb',
        points: [
          'An MLA, An MP, An honest man, An hour (all start with vowel sound)',
          'A European, A university, A one-rupee note (start with consonant sound)',
        ],
        formulaHighlight: 'Use sound, not the alphabet letter!',
      },
    ],
  },
  'eng-3': {
    youtubeId: 'V9e0f1g2h3I',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Top 50 High-Yield Exam Synonyms', titleTelugu: 'పరీక్షల్లో తరచుగా వచ్చే 50 సినోనిమ్స్' },
      { timeSec: 420, timeFormatted: '07:00', title: 'Latin & Greek Root Words (Mal, Bene, Chron, Port)', titleTelugu: 'రూట్ వర్డ్స్ పద్ధతిలో పదజాలం' },
      { timeSec: 960, timeFormatted: '16:00', title: 'Confusing Words: Compliment vs Complement', titleTelugu: 'గందరగోళానికి గురిచేసే సమాన పదాలు' },
      { timeSec: 1440, timeFormatted: '24:00', title: 'One-Word Substitution Police PYQ Series', titleTelugu: 'వన్-వర్డ్ సబ్‌స్టిట్యూట్స్ ప్రాక్టీస్' },
    ],
    practiceQuestions: [
      {
        question: 'What is the synonym of "Candid"?',
        questionTelugu: '"Candid" పదానికి సమానార్థక పదం (Synonym) ఏది?',
        options: ['Frank / Honest', 'Deceitful', 'Cruel', 'Secretive'],
        optionsTelugu: ['నిజాయితీ గల / స్పష్టమైన', 'మోసపూరిత', 'క్రూరమైన', 'రహస్యమైన'],
        correctAnswer: 0,
        explanation: 'Candid means frank, straightforward, and sincere.',
        explanationTelugu: 'Candid అంటే నిష్కపటమైన, నిజాయితీగల, స్పష్టంగా మాట్లాడే స్వభావం.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Root Words Cheat Sheet',
        points: [
          'Bene (Good): Benefactor, Benevolent, Beneficial',
          'Mal (Bad): Malnutrition, Malice, Malevolent',
          'Chron (Time): Chronology, Synchronize, Chronic',
        ],
        formulaHighlight: 'Learn 1 root word -> Understand 10 new words!',
      },
    ],
  },
  'eng-4': {
    youtubeId: 'S8f9g0h1i2J',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Spotting Errors Strategy in AP SLPRB Papers', titleTelugu: 'ఎర్రర్ స్పాటింగ్ వ్యూహం' },
      { timeSec: 360, timeFormatted: '06:00', title: 'Conditional Sentences (If + had V3 ... would have V3)', titleTelugu: 'కండిషనల్ వాక్యాల నియమాలు' },
      { timeSec: 840, timeFormatted: '14:00', title: 'Degrees of Comparison: Senior to, Inferior to', titleTelugu: 'డిగ్రీస్ ఆఫ్ కంపారిజన్ నియమాలు' },
      { timeSec: 1320, timeFormatted: '22:00', title: 'Redundant Words Traps (Return back, Repeat again)', titleTelugu: 'పునరుక్తి దోషాలు' },
    ],
    practiceQuestions: [
      {
        question: 'Identify the error part: "He is senior (A) / than me (B) / in service. (C) / No error (D)"',
        questionTelugu: 'దోషం ఉన్న భాగాన్ని గుర్తించండి: "He is senior (A) / than me (B) / in service. (C) / No error (D)"',
        options: ['Part B (should be "to me")', 'Part A', 'Part C', 'Part D'],
        optionsTelugu: ['Part B ("to me" ఉండాలి)', 'Part A', 'Part C', 'Part D'],
        correctAnswer: 0,
        explanation: 'Words like senior, junior, superior, inferior, prior take preposition "to", never "than".',
        explanationTelugu: 'Senior, junior, superior, inferior పదాల తర్వాత "than" బదులుగా "to" రావాలి.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Common Redundancy Errors',
        points: [
          'Incorrect: "Return back" -> Correct: "Return"',
          'Incorrect: "Repeat again" -> Correct: "Repeat"',
          'Incorrect: "Discussed about" -> Correct: "Discussed"',
        ],
        formulaHighlight: 'Senior, Junior, Prefer ALWAYS take "to"',
      },
    ],
  },
};

export const getLectureVideoData = (lectureId: string): LectureVideoDetails => {
  return LECTURE_VIDEOS_MAP[lectureId] || {
    youtubeId: 'qQ3r1V8Wj6A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    chapters: [
      { timeSec: 0, timeFormatted: '00:00', title: 'Topic Overview & Fundamentals', titleTelugu: 'అంశం ప్రాథమిక భావనలు' },
      { timeSec: 300, timeFormatted: '05:00', title: 'Concept Explanation', titleTelugu: 'సిద్ధాంత వివరణ' },
      { timeSec: 900, timeFormatted: '15:00', title: 'Exam Questions Practice', titleTelugu: 'పరీక్షల ప్రశ్నల సాధన' },
      { timeSec: 1500, timeFormatted: '25:00', title: 'Shortcuts & Summary', titleTelugu: 'షార్ట్‌కట్స్ & ముగింపు' },
    ],
    practiceQuestions: [
      {
        question: 'Which of the following is essential for cracking AP Police Constable exams?',
        questionTelugu: 'పోలీస్ కానిస్టేబుల్ పరీక్షలో విజయం సాధించడానికి అత్యంత కీలకమైనది ఏది?',
        options: ['Concept Clarity + Speed Shortcuts', 'Only reading books', 'Skipping math', 'Only PET practice'],
        optionsTelugu: ['కాన్సెప్ట్ స్పష్టత + షార్ట్‌కట్స్', 'పుస్తకాలు మాత్రమే చదవడం', 'గణితం వదిలేయడం', 'రన్నింగ్ మాత్రమే చేయడం'],
        correctAnswer: 0,
        explanation: 'A balanced combination of conceptual clarity, regular speed shortcuts practice, and PET consistency ensures top selection.',
        explanationTelugu: 'స్పష్టమైన అవగాహన, షార్ట్‌కట్ సూత్రాల సాధన మరియు క్రమశిక్షణతో కూడిన సన్నద్ధత విజయాన్ని చేకూరుస్తాయి.',
      },
    ],
    boardHighlights: [
      {
        heading: 'Core Concept Takeaway',
        points: [
          'Study syllabus weightage thoroughly',
          'Practice previous 5 years AP Police questions',
        ],
      },
    ],
  };
};

export interface CuratedSubjectPlaylist {
  subjectId: 'arithmetic' | 'reasoning' | 'general_studies' | 'english';
  channelName: string;
  playlistTitle: string;
  playlistTitleTelugu: string;
  description: string;
  descriptionTelugu: string;
  youtubeSearchQuery: string;
  youtubeUrl: string;
  verifiedBadge: string;
  lectureCountEstimated: string;
}

export const CURATED_SUBJECT_PLAYLISTS: CuratedSubjectPlaylist[] = [
  // Arithmetic
  {
    subjectId: 'arithmetic',
    channelName: 'Adda247 Telugu',
    playlistTitle: 'AP & TS Police SI / Constable 2026 Arithmetic Classes',
    playlistTitleTelugu: 'AP & TS పోలీస్ SI / కానిస్టేబుల్ అంకగణితం స్పెషల్ క్లాసులు',
    description: '50 Questions = 50 Shortcuts rapid series, Number System, Ratios, Speed Math and Time & Work.',
    descriptionTelugu: '50 ప్రశ్నలు = 50 షార్ట్‌కట్స్ సీరీస్, సంఖ్యా వ్యవస్థ, నిష్పత్తులు మరియు సమయం-పని.',
    youtubeSearchQuery: 'Adda247 Telugu AP Police Constable Arithmetic classes',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Adda247+Telugu+AP+Police+Constable+Arithmetic',
    verifiedBadge: 'Adda247 Telugu Official',
    lectureCountEstimated: '65+ Videos',
  },
  {
    subjectId: 'arithmetic',
    channelName: "Sreedhar's CCE",
    playlistTitle: 'Pure Maths & Arithmetic Shortcuts for Police Recruits',
    playlistTitleTelugu: 'ప్యూర్ మ్యాథ్స్ & అరిథ్మెటిక్ ఫాస్ట్ కాలిక్యులేషన్స్',
    description: 'Conceptual foundation for non-maths background candidates with bilingual step-by-step solutions.',
    descriptionTelugu: 'గణితంలో బలహీనంగా ఉన్న విద్యార్థుల కోసం సులభమైన వివరణలు.',
    youtubeSearchQuery: "Sreedhar's CCE Police Constable Arithmetic",
    youtubeUrl: "https://www.youtube.com/results?search_query=Sreedhar's+CCE+Police+Constable+Arithmetic",
    verifiedBadge: "Sreedhar's CCE",
    lectureCountEstimated: '48+ Videos',
  },
  {
    subjectId: 'arithmetic',
    channelName: 'Chandan Logics',
    playlistTitle: 'Arithmetic & Quant 15-Second Speed Techniques',
    playlistTitleTelugu: 'అరిథ్మెటిక్ 15-సెకన్ల స్పీడ్ ట్రిక్స్ & గత ప్రశ్నలు',
    description: 'Special exam tricks for Mensuration, Percentages, Profit-Loss & Compound Interest.',
    descriptionTelugu: 'క్షేత్రమితి, శాతాలు మరియు చక్రవడ్డీలపై ప్రత్యేక ట్రిక్స్.',
    youtubeSearchQuery: 'Chandan Logics Police Constable Arithmetic Telugu',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Chandan+Logics+Police+Constable+Arithmetic+Telugu',
    verifiedBadge: 'Chandan Logics',
    lectureCountEstimated: '55+ Videos',
  },

  // Reasoning
  {
    subjectId: 'reasoning',
    channelName: 'Adda247 Telugu',
    playlistTitle: 'Reasoning & Mental Ability Full Course for Police',
    playlistTitleTelugu: 'పోలీస్ రీజనింగ్ & మెంటల్ ఎబిలిటీ పూర్తి కోర్సు',
    description: 'Coding-Decoding, Blood Relations, Syllogisms Either-Or and Direction tests.',
    descriptionTelugu: 'కోడింగ్-డీకోడింగ్, రక్త సంబంధాలు, సిలాజిజం మరియు దిశల పరీక్ష.',
    youtubeSearchQuery: 'Adda247 Telugu Police Constable Reasoning classes',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Adda247+Telugu+Police+Constable+Reasoning',
    verifiedBadge: 'Adda247 Telugu',
    lectureCountEstimated: '42+ Videos',
  },
  {
    subjectId: 'reasoning',
    channelName: 'Jayashankar Academy',
    playlistTitle: 'Logical & Non-Verbal Reasoning Tricks in Telugu',
    playlistTitleTelugu: 'లాజికల్ & నాన్-వెర్బల్ రీజనింగ్ ట్రిక్స్ తెలుగులో',
    description: 'Mirror images, paper folding, dice cubes, and alternating pattern series.',
    descriptionTelugu: 'దర్పణ ప్రతిబింబాలు, పాచికలు మరియు బొమ్మల శ్రేణి.',
    youtubeSearchQuery: 'Jayashankar Academy Reasoning Police Telugu',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Jayashankar+Academy+Reasoning+Police+Telugu',
    verifiedBadge: 'Jayashankar Academy',
    lectureCountEstimated: '38+ Videos',
  },

  // General Studies
  {
    subjectId: 'general_studies',
    channelName: 'Adda247 Telugu',
    playlistTitle: 'AP General Studies & Indian Polity Top MCQs',
    playlistTitleTelugu: 'ఆంధ్రప్రదేశ్ జనరల్ స్టడీస్ & ఇండియన్ పాలిటీ',
    description: 'Fundamental Rights, Constitution Articles, AP Geography and Police Hierarchy.',
    descriptionTelugu: 'ప్రాథమిక హక్కులు, రాజ్యాంగ ఆర్టికల్స్, ఏపీ భౌగోళికం & పోలీస్ అధికారాలు.',
    youtubeSearchQuery: 'Adda247 Telugu AP Police General Studies GS',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Adda247+Telugu+AP+Police+General+Studies+GS',
    verifiedBadge: 'Adda247 Telugu',
    lectureCountEstimated: '70+ Videos',
  },
  {
    subjectId: 'general_studies',
    channelName: 'PR Academy',
    playlistTitle: 'AP Reorganisation Act 2014 & AP History Special',
    playlistTitleTelugu: 'ఆంధ్రప్రదేశ్ విభజన చట్టం 2014 & ఏపీ చరిత్ర',
    description: 'High-weightage bifurcation sections, Polavaram details, and 26 districts headquarters.',
    descriptionTelugu: 'విభజన చట్టం సెక్షన్లు, పోలవరం ప్రాజెక్టు మరియు 26 జిల్లాల ముఖ్యాంశాలు.',
    youtubeSearchQuery: 'PR Academy AP Reorganisation Act 2014 Telugu',
    youtubeUrl: 'https://www.youtube.com/results?search_query=PR+Academy+AP+Reorganisation+Act+2014+Telugu',
    verifiedBadge: 'PR Academy',
    lectureCountEstimated: '30+ Videos',
  },

  // English
  {
    subjectId: 'english',
    channelName: 'Adda247 Telugu',
    playlistTitle: 'General English for AP & TS Police Constable',
    playlistTitleTelugu: 'పోలీస్ కానిస్టేబుల్ జనరల్ ఇంగ్లీష్ గ్రామర్',
    description: 'Tenses, Subject-Verb Agreement, Error Detection and Prepositions explained in Telugu.',
    descriptionTelugu: 'తెలుగు వివరణతో టెన్సెస్, ఎర్రర్ డిటెక్షన్ మరియు ప్రిపొజిషన్స్.',
    youtubeSearchQuery: 'Adda247 Telugu Police Constable English grammar',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Adda247+Telugu+Police+Constable+English',
    verifiedBadge: 'Adda247 Telugu',
    lectureCountEstimated: '35+ Videos',
  },
  {
    subjectId: 'english',
    channelName: 'Dear Sir',
    playlistTitle: 'Complete English Grammar Full Video Course',
    playlistTitleTelugu: 'కంప్లీట్ ఇంగ్లీష్ గ్రామర్ ఫుల్ కోర్సు',
    description: 'Zero-level English grammar fundamentals, Active-Passive Voice and Direct-Indirect Speech.',
    descriptionTelugu: 'బేసిక్ లెవెల్ నుండి కాంపిటీటివ్ గ్రామర్ మాస్టరీ.',
    youtubeSearchQuery: 'Dear Sir English grammar full course',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Dear+Sir+English+grammar+full+course',
    verifiedBadge: 'Dear Sir 17M+',
    lectureCountEstimated: '50+ Videos',
  },
];

export const getYouTubeSearchUrlForLecture = (lectureTitle: string, isTelugu: boolean = true) => {
  const query = `${lectureTitle} AP Police Constable ${isTelugu ? 'Telugu' : ''}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};

export const getYouTubeWatchUrl = (ytId: string) => {
  return `https://www.youtube.com/watch?v=${ytId}`;
};

