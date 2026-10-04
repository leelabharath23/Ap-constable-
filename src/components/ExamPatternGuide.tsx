import React from 'react';
import { Shield, BookOpen, Activity, Award, CheckCircle2, Info, FileText } from 'lucide-react';
import { UserProfile } from '../types';

interface ExamPatternGuideProps {
  userProfile: UserProfile;
}

export const ExamPatternGuide: React.FC<ExamPatternGuideProps> = ({ userProfile }) => {
  const isTelugu = userProfile.language === 'Telugu';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Andhra Pradesh State Level Police Recruitment Board (AP SLPRB)</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">
          {isTelugu ? 'పోలీస్ కానిస్టేబుల్ పరీక్షా సరళి & ఎంపిక ప్రక్రియ' : 'Official AP Police Constable Exam Pattern & Selection Structure'}
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {isTelugu
            ? 'ప్రిలిమ్స్ (PWT), శారీరక సామర్థ్య పరీక్ష (PET/PMT) మరియు మెయిన్స్ (FWT) పరీక్షల వివరాలు, మార్కుల కేటాయింపు మరియు అర్హత ప్రమాణాలు.'
            : 'Detailed official guide covering Prelims (Preliminary Written Test), Physical Efficiency & Measurement Test (PET/PMT), and Final Written Test (Mains).'}
        </p>
      </div>

      {/* Official Exam Pattern Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-display flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Exam Pattern by Stage</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                <th className="p-3.5 rounded-tl-lg">Stage</th>
                <th className="p-3.5">Papers / Subjects</th>
                <th className="p-3.5">Questions</th>
                <th className="p-3.5">Marks</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5 rounded-tr-lg">Format / Scoring</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/70 transition">
                <td className="p-3.5 font-bold text-blue-700">
                  Stage 1: Prelims (PWT)
                </td>
                <td className="p-3.5">
                  General Studies, English, Arithmetic, Reasoning & Mental Ability
                </td>
                <td className="p-3.5 font-mono font-bold text-slate-900">200</td>
                <td className="p-3.5 font-mono font-bold text-slate-900">200 Marks</td>
                <td className="p-3.5 font-semibold text-slate-800">3 Hours (180 mins)</td>
                <td className="p-3.5 text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold text-slate-700">
                    Screening / Qualifying
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/70 transition">
                <td className="p-3.5 font-bold text-indigo-700">
                  Stage 2: PMT & PET
                </td>
                <td className="p-3.5">
                  Physical Measurement (Height, Chest) + 1600m Run, Long Jump & 100m Sprint
                </td>
                <td className="p-3.5 font-mono">3 Field Events</td>
                <td className="p-3.5 font-semibold text-slate-900">
                  Qualifying (Civil) <br />
                  <span className="text-blue-600 font-bold">100 Marks (AR/APSP)</span>
                </td>
                <td className="p-3.5 text-slate-800">Field Test Day</td>
                <td className="p-3.5 text-slate-600">
                  RFID Chip Timed Track
                </td>
              </tr>

              <tr className="hover:bg-slate-50/70 transition">
                <td className="p-3.5 font-bold text-emerald-700">
                  Stage 3: Mains (FWT)
                </td>
                <td className="p-3.5">
                  General Studies, English, Arithmetic, Reasoning & Mental Ability
                </td>
                <td className="p-3.5 font-mono font-bold text-slate-900">200</td>
                <td className="p-3.5 font-semibold text-slate-900">
                  <span className="text-emerald-700 font-bold">200 Marks</span> (Civil Post)<br />
                  <span className="text-blue-600 font-bold">100 Marks</span> (AR & APSP Posts)
                </td>
                <td className="p-3.5 font-semibold text-slate-800">3 Hours (180 mins)</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    Final Merit Decider
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Crucial Civil vs AR/APSP Scoring Rule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Post Code 21: Police Constable (Civil) (Men & Women)</span>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              • <strong>Final Selection Basis:</strong> Strictly based on the candidate’s score in the Final Written Test (Mains) out of <strong>200 Marks</strong>.
            </p>
            <p>
              • <strong>PET Role:</strong> The 1600m run (under 8:00 mins for men, 10:30 mins for women) and Long Jump are strictly <strong>qualifying in nature</strong>. Marks scored in PET do NOT get added to the Civil merit list.
            </p>
            <p className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 text-emerald-900 font-semibold">
              Formula: Merit = FWT Written Marks (Out of 200)
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>Post Code 22 & 23: Constable AR & APSP</span>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              • <strong>Final Selection Basis:</strong> Combined merit of Final Written Test (scaled to 100 marks) + PET Physical Efficiency Score (100 marks) = <strong>200 Marks Total</strong>.
            </p>
            <p>
              • <strong>PET Role:</strong> <strong>Crucial differentiator!</strong> Every second saved on the 1600m track and every centimeter in the long jump pit adds direct points to your total merit ranking.
            </p>
            <p className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200 text-blue-900 font-semibold">
              Formula: Merit = (FWT Marks / 2) + PET Score (Total 200)
            </p>
          </div>
        </div>
      </div>

      {/* Qualifying Cutoffs Table by Community */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center space-x-2">
          <Info className="w-4 h-4" />
          <span>Minimum Qualifying Marks (AP SLPRB Rule)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-600 font-semibold">OC (Open Competition)</span>
            <div className="text-2xl font-black text-slate-900 font-mono">40%</div>
            <span className="text-slate-500">80 Marks out of 200</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-600 font-semibold">BC (Backward Classes)</span>
            <div className="text-2xl font-black text-slate-900 font-mono">35%</div>
            <span className="text-slate-500">70 Marks out of 200</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-600 font-semibold">SC / ST / Ex-Servicemen</span>
            <div className="text-2xl font-black text-slate-900 font-mono">30%</div>
            <span className="text-slate-500">60 Marks out of 200</span>
          </div>
        </div>
      </div>
    </div>
  );
};
