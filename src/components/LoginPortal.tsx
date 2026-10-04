import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Phone, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginPortalProps {
  onLoginSuccess: (sessionToken: string, userData: { id: string; name: string; mobileNumber: string; email: string; profile: UserProfile }, sessions: any[]) => void;
}

type AuthMode = 'mobile' | 'otp-verify';

export const LoginPortal: React.FC<LoginPortalProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('mobile');
  
  // Mobile states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState<string[]>(Array(6).fill(''));
  const [otpTimer, setOtpTimer] = useState(45);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Security / Captcha states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo Sandbox Toast State (helps testers see generated OTP instantly)
  const [sandboxNotification, setSandboxNotification] = useState<{
    show: boolean;
    message: string;
    code: string;
  }>({ show: false, message: '', code: '' });

  // References for OTP inputs auto-focus
  const otpRefs = useRef<HTMLInputElement[]>([]);

  // OTP expiry timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'otp-verify' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, otpTimer]);

  // Resend OTP cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Helper to show a sandbox demo bubble
  const triggerSandboxNotify = (message: string, code: string) => {
    setSandboxNotification({
      show: true,
      message,
      code
    });
    // Auto-dismiss sandbox notification after 15 seconds
    setTimeout(() => {
      setSandboxNotification(prev => ({ ...prev, show: false }));
    }, 15000);
  };

  // 1. Send Mobile OTP API Call
  const handleSendMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!/^\d{10}$/.test(mobileNumber)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch OTP.');
      }

      setOtpTimer(data.expiresInSec || 45);
      setResendCooldown(data.cooldownInSec || 30);
      setOtpCode(Array(6).fill(''));
      setMode('otp-verify');
      setSuccessMsg('A 6-digit OTP has been sent to +91 ' + mobileNumber);
      
      // Focus first OTP block after DOM updates
      setTimeout(() => {
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      }, 100);

      // Trigger Sandbox Notification in development
      triggerSandboxNotify(
        `SMS GATEWAY (SANDBOX): Authentication verification OTP for +91 ${mobileNumber}`,
        data.demoOtp
      );

    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Mobile OTP API Call
  const handleVerifyMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const otpString = otpCode.join('');
    if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      setErrorMsg('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber,
          otp: otpString,
          userAgent: navigator.userAgent,
          ip: '192.168.1.45' // Simulated client IP for security audits
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed.');
      }

      setSandboxNotification(prev => ({ ...prev, show: false }));
      onLoginSuccess(data.sessionToken, data.user, data.sessions);

    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for 6 individual OTP input navigation
  const handleOtpInputChange = (index: number, val: string) => {
    // Only accept numbers
    if (val && !/^\d$/.test(val)) return;

    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto focus next input
    if (val !== '' && index < 5) {
      if (otpRefs.current[index + 1]) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace key handles deleting and moving back
    if (e.key === 'Backspace') {
      if (otpCode[index] === '' && index > 0) {
        const newOtp = [...otpCode];
        newOtp[index - 1] = '';
        setOtpCode(newOtp);
        if (otpRefs.current[index - 1]) {
          otpRefs.current[index - 1].focus();
        }
      } else {
        const newOtp = [...otpCode];
        newOtp[index] = '';
        setOtpCode(newOtp);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Decorative Blueprint Background Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Dynamic Sandbox Gateway Notification Banner */}
      {sandboxNotification.show && (
        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-950 border-2 border-amber-500/80 rounded-xl shadow-2xl p-4 text-xs z-50 animate-bounce">
          <div className="flex items-start space-x-3">
            <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <Phone className="w-4 h-4" />
            </span>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 tracking-wider uppercase">
                  SIMULATED SMS NOTIFICATION
                </span>
                <span className="text-[10px] text-slate-500 font-semibold font-mono">Sandbox Dev Mode</span>
              </div>
              <p className="text-slate-300 font-medium leading-relaxed">{sandboxNotification.message}</p>
              
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1.5">
                <span className="text-slate-500 font-semibold">Verification Token:</span>
                <span className="text-lg font-black font-mono tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/25">
                  {sandboxNotification.code}
                </span>
              </div>
              <p className="text-[10px] text-slate-400/80 italic pt-1">
                * Real OTP dispatch is simulated in this AI Studio preview. Use the code above to verify.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Authentication Box Card */}
      <div className="w-full max-w-md bg-slate-950 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Top Header Police Badge Design */}
        <div className="relative bg-gradient-to-r from-blue-900/90 via-slate-900 to-blue-900/90 border-b border-slate-800/80 py-8 px-6 text-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
          <div className="inline-flex items-center justify-center w-20 h-20 mb-3">
            <img src="/logo.svg" alt="APP Emblem" className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(59,130,246,0.35)]" />
          </div>
          <h1 className="text-xs font-extrabold uppercase tracking-[0.25em] text-blue-400">
            AP CONSTABLE
          </h1>
          <p className="text-lg font-black text-white tracking-wide mt-1">
            Secure Applicant Portal
          </p>
          <p className="text-[10px] text-slate-400/90 font-medium mt-1">
            Andhra Pradesh State Level Police Recruitment Board (SLPRB)
          </p>
        </div>

        {/* Action feedback notifications */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-950/80 border border-red-500/30 rounded-xl flex items-start space-x-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMsg}</span>
          </div>
        )}
        
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/80 border border-emerald-500/30 rounded-xl flex items-start space-x-2 text-xs text-emerald-200">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span className="font-medium leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Sub-Views Forms Switcher */}
        <div className="p-6 sm:p-8">

          {/* MODE: MOBILE NUMBER PORTAL ENTRY */}
          {mode === 'mobile' && (
            <form onSubmit={handleSendMobileOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-sm font-bold border-r border-slate-800 pr-2.5">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter number"
                    className="block w-full pl-16 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white font-mono text-sm tracking-wider placeholder-slate-600 outline-hidden transition"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-2 leading-relaxed">
                  Enter your registered or official mobile number to receive a 6-digit OTP passcode.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl cursor-pointer transition shadow-lg shadow-blue-900/30 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Dispatch...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
            </form>
          )}

          {/* MODE: OTP VERIFICATION SCREEN */}
          {mode === 'otp-verify' && (
            <form onSubmit={handleVerifyMobileOtp} className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Verify Mobile Number
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  We sent a 6-digit verification code to +91 <span className="font-mono font-bold text-slate-300">{mobileNumber}</span>
                </p>
              </div>

              {/* 6 Individual Digit Inputs */}
              <div className="flex justify-between gap-2.5 py-2">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { if (el) otpRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 bg-slate-900 border-2 border-slate-800 focus:border-blue-500 focus:ring-0 text-center text-xl font-extrabold font-mono text-blue-400 rounded-xl outline-hidden transition"
                  />
                ))}
              </div>

              {/* Countdown / Expiration feedback */}
              <div className="flex items-center justify-between text-xs font-semibold px-1">
                <span className="text-slate-500">
                  OTP expires in:{' '}
                  <span className={`font-mono ${otpTimer <= 15 ? 'text-rose-500 font-black' : 'text-slate-300 font-bold'}`}>
                    {formatTime(otpTimer)}
                  </span>
                </span>
                
                {otpTimer <= 0 && (
                  <span className="text-rose-400 font-bold uppercase text-[10px] tracking-wider flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Expired</span>
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || otpTimer <= 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl cursor-pointer transition shadow-lg shadow-emerald-950/20 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Security Token...</span>
                    </>
                  ) : (
                    <span>Verify OTP</span>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={async () => {
                      const response = await fetch('/api/auth/send-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mobileNumber }),
                      });
                      const data = await response.json();
                      if (response.ok) {
                        setOtpTimer(data.expiresInSec || 45);
                        setResendCooldown(data.cooldownInSec || 30);
                        setOtpCode(Array(6).fill(''));
                        setSuccessMsg('A fresh security OTP code has been dispatched.');
                        triggerSandboxNotify(`SMS GATEWAY (SANDBOX): Regenerated OTP for +91 ${mobileNumber}`, data.demoOtp);
                      } else {
                        setErrorMsg(data.error || 'Failed to resend OTP.');
                      }
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold disabled:text-slate-600 disabled:cursor-not-allowed cursor-pointer transition inline-flex items-center space-x-1.5"
                  >
                    <span>Didn't receive OTP? Resend OTP</span>
                    {resendCooldown > 0 && <span className="font-mono text-slate-500">({resendCooldown}s)</span>}
                  </button>
                </div>
                
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setSuccessMsg('');
                      setMode('mobile');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-300 underline cursor-pointer transition"
                  >
                    Change mobile number
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

        {/* Security Footnote */}
        <div className="bg-slate-950/80 border-t border-slate-900 py-4 px-6 flex items-center justify-center space-x-2">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            🔒 Your information is protected
          </span>
        </div>

      </div>

      {/* Footer Info Hints for Testers */}
      <div className="mt-6 max-w-sm text-center space-y-2">
        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
          💡 <span className="text-slate-400 font-bold">Quick Demo Sandbox Hint:</span><br />
          Try entering mobile number <span className="font-mono text-slate-400 font-bold px-1.5 py-0.5 bg-slate-800 rounded">9876543210</span> to log in as the default candidate profile, or enter any mobile number to automatically register a new account!
        </p>
      </div>

    </div>
  );
};
