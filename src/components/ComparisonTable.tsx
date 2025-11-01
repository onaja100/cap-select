import React from 'react'
import type { CapacitorRecommendation, CalculationResults, ComparisonResults } from '../utils/calculations'
import { 
  getCapacitanceImpact, 
  getVoltageImpact, 
  getCurrentImpact, 
  getPhaseImpact, 
  getPowerLossImpact,
  getOverallAssessment,
  getColorClasses
} from '../utils/impactAssessment'
import type { ImpactResult } from '../utils/impactAssessment'

interface ComparisonTableProps {
  recommended: CapacitorRecommendation
  recommendedCalcs: CalculationResults
  user: ComparisonResults
}

interface ComparisonRowProps {
  label: string
  recommended: string
  user: string
  diff: string
  impact: ImpactResult
}

interface SafetyAlertProps {
  safetyFactor: number
  status: string
}

interface SummaryCardProps {
  capacitanceDiff: number
  safetyFactor: number
  currentDiff: number
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ label, recommended, user, diff, impact }) => {
  return (
    <tr className="hover:bg-white/50 transition-colors duration-200">
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{label}</td>
      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{recommended}</td>
      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{user}</td>
      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{diff}</td>
      <td className="px-6 py-4">
        {impact.text && (
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getColorClasses(impact.color)}`}>
            {impact.text}
          </span>
        )}
      </td>
    </tr>
  )
}

const SafetyAlert: React.FC<SafetyAlertProps> = ({ safetyFactor, status }) => {
  const impact = getVoltageImpact(safetyFactor)
  
  return (
    <div className={`p-6 rounded-xl border-l-4 mb-8 shadow-sm ${getColorClasses(impact.color).replace('border-', 'border-l-')}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className={`rounded-full p-3 ${
            impact.color === 'red' ? 'bg-red-100' : 
            impact.color === 'orange' ? 'bg-orange-100' : 
            impact.color === 'yellow' ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            <svg className={`w-6 h-6 ${
              impact.color === 'red' ? 'text-red-600' : 
              impact.color === 'orange' ? 'text-orange-600' : 
              impact.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              {impact.color === 'red' ? (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              ) : impact.color === 'green' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              )}
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">การประเมินความปลอดภัยของแรงดัน</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm">Safety Factor:</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              impact.color === 'red' ? 'bg-red-100 text-red-800' : 
              impact.color === 'orange' ? 'bg-orange-100 text-orange-800' : 
              impact.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              {safetyFactor.toFixed(2)}
            </span>
          </div>
          <p className="text-sm mt-2 font-medium">{status}</p>
        </div>
      </div>
    </div>
  )
}

const SummaryCard: React.FC<SummaryCardProps> = ({ capacitanceDiff, safetyFactor, currentDiff }) => {
  const overall = getOverallAssessment(capacitanceDiff, safetyFactor, currentDiff)
  
  return (
    <div className={`p-8 rounded-2xl border-2 mt-8 shadow-lg ${getColorClasses(overall.color)}`}>
      <div className="flex items-start mb-6">
        <div className={`rounded-full p-3 mr-4 ${
          overall.color === 'red' ? 'bg-red-100' : 
          overall.color === 'orange' ? 'bg-orange-100' : 
          overall.color === 'yellow' ? 'bg-yellow-100' : 'bg-green-100'
        }`}>
          <svg className={`w-6 h-6 ${
            overall.color === 'red' ? 'text-red-600' : 
            overall.color === 'orange' ? 'text-orange-600' : 
            overall.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">สรุปการประเมิน</h3>
          <p className="text-lg font-semibold">{overall.text}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">ความจุ</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              capacitanceDiff > 0 ? 'bg-red-100 text-red-700' : 
              capacitanceDiff < -10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
            }`}>
              {capacitanceDiff > 0 ? '+' : ''}{capacitanceDiff.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">ความปลอดภัย</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              safetyFactor < 1.3 ? 'bg-red-100 text-red-700' : 
              safetyFactor < 1.5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
            }`}>
              SF {safetyFactor.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">กระแส</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              Math.abs(currentDiff) > 50 ? 'bg-red-100 text-red-700' : 
              Math.abs(currentDiff) > 20 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
            }`}>
              {currentDiff > 0 ? '+' : ''}{currentDiff.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  recommended, 
  recommendedCalcs, 
  user 
}) => {
  const rows = [
    {
      label: "ความจุ (C)",
      recommended: `${recommended.capacitance} µF`,
      user: `${user.capacitance} µF`,
      diff: `${user.capacitanceDiff > 0 ? '+' : ''}${user.capacitanceDiff.toFixed(1)}%`,
      impact: getCapacitanceImpact(user.capacitanceDiff)
    },
    {
      label: "แรงดัน (V)",
      recommended: `${recommended.recommendedVoltage} V`,
      user: `${user.voltage} V`,
      diff: `SF: ${user.safetyFactor.toFixed(2)}`,
      impact: getVoltageImpact(user.safetyFactor)
    },
    {
      label: "กระแส (I)",
      recommended: `${recommendedCalcs.I.toFixed(3)} A`,
      user: `${user.I.toFixed(3)} A`,
      diff: `${user.currentDiff > 0 ? '+' : ''}${user.currentDiff.toFixed(1)}%`,
      impact: getCurrentImpact(user.currentDiff)
    },
    {
      label: "Capacitive Reactance (Xc)",
      recommended: `${recommendedCalcs.Xc.toFixed(1)} Ω`,
      user: `${user.Xc.toFixed(1)} Ω`,
      diff: `${user.XcDiff > 0 ? '+' : ''}${user.XcDiff.toFixed(1)}%`,
      impact: { text: "", color: "gray" }
    },
    {
      label: "มุมเฟส (θ)",
      recommended: `${recommendedCalcs.theta.toFixed(1)}°`,
      user: `${user.theta.toFixed(1)}°`,
      diff: `${user.thetaDiff > 0 ? '+' : ''}${user.thetaDiff.toFixed(2)}°`,
      impact: getPhaseImpact(user.theta)
    },
    {
      label: "กำลังสูญเสีย (P)",
      recommended: `${recommendedCalcs.powerLoss.toFixed(2)} W`,
      user: `${user.powerLoss.toFixed(2)} W`,
      diff: `${user.powerLossDiff > 0 ? '+' : ''}${user.powerLossDiff.toFixed(1)}%`,
      impact: getPowerLossImpact(user.powerLossDiff)
    }
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg p-2 sm:p-2.5 mr-3 shadow-lg">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">ตารางเปรียบเทียบ</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">เปรียบเทียบค่าที่แนะนำกับ Capacitor ที่คุณมี</p>
        </div>
      </div>
      
      <SafetyAlert 
        safetyFactor={user.safetyFactor}
        status={user.voltageStatus}
      />
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  พารามิเตอร์
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  ค่าที่แนะนำ
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  ค่าที่คุณมี
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  ความแตกต่าง
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  ผลกระทบ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/40 backdrop-blur-sm divide-y divide-gray-200/50">
              {rows.map((row, index) => (
                <ComparisonRow
                  key={index}
                  label={row.label}
                  recommended={row.recommended}
                  user={row.user}
                  diff={row.diff}
                  impact={row.impact}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {rows.map((row, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 shadow-sm">
            <div className="font-semibold text-gray-900 mb-3 text-lg">{row.label}</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ค่าที่แนะนำ:</span>
                <span className="font-medium text-gray-900">{row.recommended}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ค่าที่คุณมี:</span>
                <span className="font-medium text-gray-900">{row.user}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ความแตกต่าง:</span>
                <span className="font-medium text-gray-900">{row.diff}</span>
              </div>
              {row.impact.text && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getColorClasses(row.impact.color)}`}>
                    {row.impact.text}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <SummaryCard 
        capacitanceDiff={user.capacitanceDiff}
        safetyFactor={user.safetyFactor}
        currentDiff={user.currentDiff}
      />
    </div>
  )
}