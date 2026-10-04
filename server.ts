import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// SECURE AUTHENTICATION STATE & DB (In-Memory)
// ==========================================

// Simple Password Salting & Hashing using crypto
function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

interface User {
  id: string;
  name: string;
  mobileNumber: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  profile: any; // Storing the full UserProfile from frontend
}

interface Session {
  id: string;
  userId: string;
  ip: string;
  userAgent: string;
  loginTime: string;
  lastActive: number;
}

interface OtpState {
  code: string;
  expiresAt: number;
  attempts: number;
  cooldownUntil: number;
}

interface CaptchaChallenge {
  equation: string;
  answer: number;
  expiresAt: number;
}

// In-Memory Database
const users: Record<string, User> = {};
const sessions: Record<string, Session> = {};
const mobileOtps: Record<string, OtpState> = {};
const emailOtps: Record<string, OtpState> = {};
const ipFailedAttempts: Record<string, { count: number; lockedUntil: number }> = {};
const captchas: Record<string, CaptchaChallenge> = {};

// Default User Seed (matching INITIAL_PROFILE in frontend)
const SEED_SALT = generateSalt();
const seedUser: User = {
  id: "user-seed-1",
  name: "K. Venkatesh",
  mobileNumber: "9876543210",
  email: "leelabharath23@gmail.com",
  passwordSalt: SEED_SALT,
  passwordHash: hashPassword("password123", SEED_SALT),
  profile: {
    name: "K. Venkatesh",
    stage: "Prelims",
    post: "Civil Constable",
    language: "English",
    benchmarks: {
      gender: "Male",
      heightCm: 168.5,
      chestUnexpandedCm: 87.0,
      chestExpandedCm: 92.5,
      run1600mMinutes: 7,
      run1600mSeconds: 42,
      longJumpMeters: 4.15,
      run100mSeconds: 13.9,
    },
    completedLectureIds: ["lec-quant-1", "lec-reason-1"],
    savedOfflineLectureIds: ["lec-quant-1"],
    testHistory: [
      {
        testId: "mock-test-1",
        testTitle: "Full Mock Test 1 (Standard 200 Questions)",
        date: "Yesterday",
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
  },
};
users[seedUser.id] = seedUser;

// Rate-limiting tracking (e.g., max 3 OTP requests in 5 minutes)
const otpRequestLog: Record<string, number[]> = {};

function isRateLimitedForOtp(identifier: string): { limited: boolean; timeLeftSec: number } {
  const now = Date.now();
  const timestamps = otpRequestLog[identifier] || [];
  // Filter for requests in last 5 minutes (300,000 ms)
  const windowStart = now - 300000;
  const recentTimestamps = timestamps.filter(t => t > windowStart);
  otpRequestLog[identifier] = recentTimestamps;

  if (recentTimestamps.length >= 3) {
    const oldestInWindow = recentTimestamps[0];
    const timeLeftSec = Math.ceil((oldestInWindow + 300000 - now) / 1000);
    return { limited: true, timeLeftSec };
  }
  return { limited: false, timeLeftSec: 0 };
}

function logOtpRequest(identifier: string) {
  if (!otpRequestLog[identifier]) {
    otpRequestLog[identifier] = [];
  }
  otpRequestLog[identifier].push(Date.now());
}

// Generate an elegant 6-digit verification code
function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 90000).toString();
}

// ==========================================
// SECURE AUTHENTICATION ENDPOINTS
// ==========================================

// 1. Send OTP to Mobile Number
app.post("/api/auth/send-otp", (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
    return res.status(400).json({ error: "Please enter a valid 10-digit Indian mobile number." });
  }

  // Check Rate Limits
  const rateLimit = isRateLimitedForOtp(mobileNumber);
  if (rateLimit.limited) {
    return res.status(429).json({ 
      error: `Too many OTP requests. Please wait ${Math.floor(rateLimit.timeLeftSec / 60)}m ${rateLimit.timeLeftSec % 60}s before requesting again.` 
    });
  }

  // Check cooldown between direct resends (e.g. 30s)
  const existing = mobileOtps[mobileNumber];
  if (existing && existing.cooldownUntil > Date.now()) {
    const cooldownSec = Math.ceil((existing.cooldownUntil - Date.now()) / 1000);
    return res.status(429).json({ error: `Please wait ${cooldownSec}s before requesting a new OTP.` });
  }

  // Generate 6-digit OTP
  const code = generate6DigitCode();
  const now = Date.now();
  
  mobileOtps[mobileNumber] = {
    code,
    expiresAt: now + 45000, // 45 seconds expiration
    attempts: 0,
    cooldownUntil: now + 30000, // 30 seconds cooldown
  };

  logOtpRequest(mobileNumber);
  
  console.log(`[SMS Gateway Sandbox] OTP sent to +91 ${mobileNumber}: ${code} (Expires in 45 seconds)`);

  return res.json({ 
    success: true, 
    message: "OTP sent successfully.",
    demoOtp: code, // Shared in response for seamless sandbox testing
    expiresInSec: 45,
    cooldownInSec: 30
  });
});

// 2. Verify OTP for Mobile Number
app.post("/api/auth/verify-otp", (req, res) => {
  const { mobileNumber, otp, ip = "127.0.0.1", userAgent = "Web Browser" } = req.body;
  if (!mobileNumber || !otp) {
    return res.status(400).json({ error: "Mobile number and OTP are required." });
  }

  const otpState = mobileOtps[mobileNumber];
  if (!otpState) {
    return res.status(400).json({ error: "No OTP requested or OTP has expired. Please request a new one." });
  }

  // Check OTP Expiration
  if (Date.now() > otpState.expiresAt) {
    delete mobileOtps[mobileNumber];
    return res.status(400).json({ error: "OTP has expired. Please request a new one." });
  }

  // Check Max Attempts on current OTP (max 3 tries)
  if (otpState.attempts >= 3) {
    delete mobileOtps[mobileNumber];
    return res.status(423).json({ error: "Maximum verification attempts exceeded. Please request a new OTP." });
  }

  if (otpState.code !== otp) {
    otpState.attempts += 1;
    const remaining = 3 - otpState.attempts;
    if (remaining <= 0) {
      delete mobileOtps[mobileNumber];
      return res.status(400).json({ error: "Maximum attempts exceeded. This OTP is now invalid. Request a new one." });
    }
    return res.status(400).json({ error: `Invalid OTP. ${remaining} attempts remaining.` });
  }

  // Verification Successful! Find or create user
  let user = Object.values(users).find(u => u.mobileNumber === mobileNumber);
  if (!user) {
    // Auto-register candidate on first login
    const id = `user-${Date.now()}`;
    const name = `Constable Candidate #${mobileNumber.slice(-4)}`;
    const freshProfile = JSON.parse(JSON.stringify(seedUser.profile));
    freshProfile.name = name;
    
    user = {
      id,
      name,
      mobileNumber,
      email: "",
      passwordSalt: generateSalt(),
      passwordHash: "",
      profile: freshProfile
    };
    users[id] = user;
  }

  // Clean up verified OTP
  delete mobileOtps[mobileNumber];

  // Create session
  const sessionToken = crypto.randomBytes(24).toString("hex");
  const session: Session = {
    id: sessionToken,
    userId: user.id,
    ip,
    userAgent,
    loginTime: new Date().toLocaleTimeString() + ", " + new Date().toLocaleDateString(),
    lastActive: Date.now()
  };
  sessions[sessionToken] = session;

  // Clear IP failed login attempts on success
  delete ipFailedAttempts[ip];

  // Retrieve user sessions
  const activeSessions = Object.values(sessions).filter(s => s.userId === user!.id);

  return res.json({
    success: true,
    sessionToken,
    user: {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email,
      profile: user.profile
    },
    sessions: activeSessions
  });
});

// 3. Email & Password/OTP Login with CAPTCHA check
app.post("/api/auth/login-email", (req, res) => {
  const { email, password, captchaAnswer, ip = "127.0.0.1", userAgent = "Web Browser" } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  // Check IP-based brute force or locked states
  const attemptsState = ipFailedAttempts[ip] || { count: 0, lockedUntil: 0 };
  if (attemptsState.lockedUntil > Date.now()) {
    const lockedSec = Math.ceil((attemptsState.lockedUntil - Date.now()) / 1000);
    return res.status(423).json({ error: `Too many failed attempts. Device locked. Please try again in ${lockedSec}s.` });
  }

  // Require CAPTCHA if failed attempts >= 2
  if (attemptsState.count >= 2) {
    const chal = captchas[ip];
    if (!chal || Date.now() > chal.expiresAt) {
      // Re-issue a captcha
      const n1 = Math.floor(Math.random() * 12) + 10;
      const n2 = Math.floor(Math.random() * 9) + 2;
      captchas[ip] = {
        equation: `${n1} + ${n2}`,
        answer: n1 + n2,
        expiresAt: Date.now() + 120000 // 2 mins
      };
      return res.status(403).json({
        error: "Security verification required. Please solve the CAPTCHA.",
        requiresCaptcha: true,
        captchaEquation: captchas[ip].equation
      });
    }

    if (captchaAnswer === undefined || parseInt(captchaAnswer) !== chal.answer) {
      // Refresh CAPTCHA challenge
      const n1 = Math.floor(Math.random() * 12) + 10;
      const n2 = Math.floor(Math.random() * 9) + 2;
      captchas[ip] = {
        equation: `${n1} + ${n2}`,
        answer: n1 + n2,
        expiresAt: Date.now() + 120000
      };
      return res.status(403).json({
        error: "Incorrect CAPTCHA solution. Please try again.",
        requiresCaptcha: true,
        captchaEquation: captchas[ip].equation
      });
    }
  }

  // Find User by Email
  let user = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // Verify Password
  let validPassword = false;
  if (user && user.passwordHash) {
    const calculatedHash = hashPassword(password, user.passwordSalt);
    if (calculatedHash === user.passwordHash) {
      validPassword = true;
    }
  }

  if (!user || !validPassword) {
    attemptsState.count += 1;
    if (attemptsState.count >= 5) {
      attemptsState.lockedUntil = Date.now() + 60000; // 1-minute brute force lockout
    }
    ipFailedAttempts[ip] = attemptsState;

    // Trigger CAPTCHA on next try
    if (attemptsState.count >= 2) {
      const n1 = Math.floor(Math.random() * 12) + 10;
      const n2 = Math.floor(Math.random() * 9) + 2;
      captchas[ip] = {
        equation: `${n1} + ${n2}`,
        answer: n1 + n2,
        expiresAt: Date.now() + 120000
      };
      return res.status(401).json({
        error: "Invalid email or password.",
        requiresCaptcha: true,
        captchaEquation: captchas[ip].equation
      });
    }

    return res.status(401).json({ error: "Invalid email or password." });
  }

  // Successful Login! Clear CAPTCHA & failed attempts
  delete ipFailedAttempts[ip];
  delete captchas[ip];

  // Session establishment
  const sessionToken = crypto.randomBytes(24).toString("hex");
  const session: Session = {
    id: sessionToken,
    userId: user.id,
    ip,
    userAgent,
    loginTime: new Date().toLocaleTimeString() + ", " + new Date().toLocaleDateString(),
    lastActive: Date.now()
  };
  sessions[sessionToken] = session;

  const activeSessions = Object.values(sessions).filter(s => s.userId === user!.id);

  return res.json({
    success: true,
    sessionToken,
    user: {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email,
      profile: user.profile
    },
    sessions: activeSessions
  });
});

// 4. Send Email Verification OTP for Password Reset or Passwordless Login
app.post("/api/auth/send-email-otp", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  // Rate Limiting Check
  const rateLimit = isRateLimitedForOtp(email);
  if (rateLimit.limited) {
    return res.status(429).json({ 
      error: `Too many email code requests. Please wait ${rateLimit.timeLeftSec}s before trying again.` 
    });
  }

  const code = generate6DigitCode();
  emailOtps[email] = {
    code,
    expiresAt: Date.now() + 120000, // 2 minutes expiry
    attempts: 0,
    cooldownUntil: Date.now() + 30000
  };

  logOtpRequest(email);

  console.log(`[Email Gateway Sandbox] Verification code sent to ${email}: ${code} (Expires in 2 minutes)`);

  return res.json({
    success: true,
    message: "Email verification code has been dispatched.",
    demoOtp: code,
    expiresInSec: 120
  });
});

// 5. Reset Password using Email OTP Verification
app.post("/api/auth/reset-password", (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: "Email, OTP, and new password are required." });
  }

  const otpState = emailOtps[email];
  if (!otpState || Date.now() > otpState.expiresAt) {
    return res.status(400).json({ error: "Verification code has expired or is invalid. Please request a new one." });
  }

  if (otpState.code !== otp) {
    otpState.attempts += 1;
    if (otpState.attempts >= 3) {
      delete emailOtps[email];
      return res.status(400).json({ error: "Too many incorrect verification attempts. Please request a new code." });
    }
    return res.status(400).json({ error: "Invalid verification code." });
  }

  // Code verified! Find user
  let user = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "No candidate account is registered with this email." });
  }

  // Set new password
  const newSalt = generateSalt();
  user.passwordSalt = newSalt;
  user.passwordHash = hashPassword(newPassword, newSalt);
  
  delete emailOtps[email];

  console.log(`[Security Action] Password reset successfully for candidate: ${email}`);

  return res.json({ success: true, message: "Password updated successfully. You can now login." });
});

// 6. Candidate Profile Self-Registration (Email Sign Up)
app.post("/api/auth/register-email", (req, res) => {
  const { name, email, mobileNumber, password } = req.body;
  if (!name || !email || !mobileNumber || !password) {
    return res.status(400).json({ error: "All registration fields are required." });
  }

  // Check unique constraints
  const duplicateEmail = Object.values(users).some(u => u.email.toLowerCase() === email.toLowerCase());
  if (duplicateEmail) {
    return res.status(400).json({ error: "An account with this email already exists." });
  }

  const duplicateMobile = Object.values(users).some(u => u.mobileNumber === mobileNumber);
  if (duplicateMobile) {
    return res.status(400).json({ error: "An account with this mobile number already exists." });
  }

  const id = `user-${Date.now()}`;
  const salt = generateSalt();
  
  const freshProfile = JSON.parse(JSON.stringify(seedUser.profile));
  freshProfile.name = name;

  const newUser: User = {
    id,
    name,
    mobileNumber,
    email,
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt),
    profile: freshProfile
  };

  users[id] = newUser;
  console.log(`[Security Action] New candidate registered: ${name} (${email})`);

  return res.json({ success: true, message: "Registration successful. Please login now!" });
});

// 7. Get Current User Session Info (Protected Route)
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No session active." });
  }

  const token = authHeader.split(" ")[1];
  const session = sessions[token];
  if (!session) {
    return res.status(401).json({ error: "Session has expired or is invalid." });
  }

  // Update last active time
  session.lastActive = Date.now();

  const user = users[session.userId];
  if (!user) {
    return res.status(401).json({ error: "User not found." });
  }

  const activeSessions = Object.values(sessions).filter(s => s.userId === user.id);

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email,
      profile: user.profile
    },
    sessions: activeSessions
  });
});

// 8. Update User Profile State (Synchronizes physically back to database)
app.post("/api/auth/update-profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized update request." });
  }

  const token = authHeader.split(" ")[1];
  const session = sessions[token];
  if (!session) {
    return res.status(401).json({ error: "Session expired." });
  }

  const user = users[session.userId];
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const { profile } = req.body;
  if (profile) {
    user.profile = { ...user.profile, ...profile };
    // Synchronize direct properties
    if (profile.name) {
      user.name = profile.name;
    }
  }

  return res.json({ success: true, user: { id: user.id, name: user.name, mobileNumber: user.mobileNumber, email: user.email, profile: user.profile } });
});

// 9. Verify / Keep Session Alive (Prevents automatic logout during activity)
app.post("/api/auth/keep-alive", (req, res) => {
  const { sessionToken } = req.body;
  const session = sessions[sessionToken];
  if (!session) {
    return res.status(401).json({ error: "Session expired." });
  }
  session.lastActive = Date.now();
  return res.json({ success: true });
});

// 10. Terminate a Specific Session (Device Management)
app.post("/api/auth/terminate-session", (req, res) => {
  const authHeader = req.headers.authorization;
  const { targetSessionId } = req.body;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const token = authHeader.split(" ")[1];
  const session = sessions[token];
  if (!session) {
    return res.status(401).json({ error: "Session expired." });
  }

  const target = sessions[targetSessionId];
  if (target && target.userId === session.userId) {
    delete sessions[targetSessionId];
  }

  const activeSessions = Object.values(sessions).filter(s => s.userId === session.userId);
  return res.json({ success: true, sessions: activeSessions });
});

// 11. Logout current session
app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    delete sessions[token];
  }
  return res.json({ success: true });
});

// 12. Logout all sessions (Security Panic Trigger)
app.post("/api/auth/logout-all", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const token = authHeader.split(" ")[1];
  const session = sessions[token];
  if (session) {
    const userId = session.userId;
    // Delete all sessions for this userId
    for (const key of Object.keys(sessions)) {
      if (sessions[key].userId === userId) {
        delete sessions[key];
      }
    }
  }
  return res.json({ success: true });
});

// AI AP Police Constable Doubt Solver & Mentor API
app.post("/api/ai/doubt-solver", async (req, res) => {
  try {
    const { question, topic, language = "English", context } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return high-quality pre-computed smart response if API key is not yet set
      return res.json({
        answer: `[AP Police Mentor Guidance (${language})]\n\nRegarding: "${question}"\n\n📌 Exam Key Insight for AP Police Constable:\n- For Prelims & Mains, focus on accuracy and speed (200 questions in 180 minutes = ~54 seconds per question).\n- Arithmetic: Always look for percentage and ratio shortcuts rather than long manual calculations.\n- AP General Studies: Key focus areas include AP Reorganisation Act 2014, Andhra Movement (Potti Sreeramulu, 1953 Kurnool capital), and Articles 14-32 of Indian Constitution.\n- PET Benchmark: Maintain steady pacing for the 1600m run (target under 8 mins for qualification, sub-7:00 for high merit score in AR/APSP posts).\n\nTip: Consistent daily revision of formulas and AP Current Affairs guarantees clearing the cutoff!`,
        model: "offline-mentor-guide",
      });
    }

    const systemInstruction = `You are an expert tutor, mentor, and retired Andhra Pradesh Police Sub-Inspector guide specializing in the AP Police Constable Exam (SLPRB - State Level Police Recruitment Board).
The exam tests:
1. Arithmetic & Quantitative Aptitude (Number systems, Ratios, Percentages, Profit/Loss, SI/CI, Time & Work, Mensuration)
2. Reasoning & Mental Ability (Coding-decoding, Syllogisms, Analogies, Blood Relations, Series)
3. General Studies (Indian History & AP Movement, Polity, Geography, Economy, General Science, Current Affairs)
4. English Language & Grammar
5. Physical Efficiency Test (PET: 1600m run, Long Jump, 100m run).

The candidate's chosen language is ${language} (if Telugu, you can use Telugu script or English with clear Telugu keywords when helpful).
Provide a clear, accurate, step-by-step answer with shortcuts, exam tips, and memory tricks where relevant. Keep it encouraging and disciplined.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Candidate Doubt: ${question}\nTopic Area: ${topic || "General"}\nContext: ${context || "AP Police Constable Exam Preparation"}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      answer: response.text || "No response generated. Please try again.",
      model: "gemini-3.8-flash",
    });
  } catch (error: any) {
    console.error("AI Doubt Solver Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate tutor response",
      fallbackAnswer: "Make sure to memorize key formulas in Arithmetic and revise the 1953 Andhra State movement landmarks. For 1600m running, do interval training 4 days a week.",
    });
  }
});

// API health endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "AP Police Constable Exam Prep",
    timestamp: new Date().toISOString(),
  });
});

// Initial lazy init of Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AP Police Constable Exam Prep Server running on port ${PORT}`);
  });
}

startServer();
