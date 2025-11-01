import React from 'react'
import type { CapacitorRecommendation } from '../utils/calculations'

interface RecommendedCapacitorProps {
  data: CapacitorRecommendation
}

interface ResultItemProps {
  label: string
  value: number
  unit: string
  highlight?: boolean
}

const ResultItem: React.FC<ResultItemProps> = ({ label, value, unit, highlight = false }) => {
  return (
    <div className={`
      p-4 sm:p-5 rounded-xl transition-all duration-300 hover:shadow-xl relative overflow-hidden
      ${highlight
        ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-400 shadow-xl shadow-emerald-200/50'
        : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-cyan-300 shadow-md'
      }
    `}>
      {highlight && (
        <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1 shadow-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <div className="text-sm font-semibold text-gray-700 mb-1.5">{label}</div>
      <div className={`text-xl sm:text-2xl font-bold flex items-baseline ${highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600' : 'text-gray-800'}`}>
        <span>{value.toLocaleString()}</span>
        <span className={`text-sm font-bold ml-2 ${highlight ? 'text-emerald-600' : 'text-gray-500'}`}>
          {unit}
        </span>
      </div>
    </div>
  )
}

export const RecommendedCapacitor: React.FC<RecommendedCapacitorProps> = ({ data }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-200/50 p-4 sm:p-6 mb-6 sm:mb-8 hover:shadow-emerald-200/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-2 sm:p-2.5 mr-3 shadow-lg shadow-emerald-500/50">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Capacitor ที่แนะนำ</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">ค่าที่คำนวณได้และแนะนำสำหรับมอเตอร์ของคุณ</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <ResultItem 
          label="ความจุ"
          value={data.capacitance}
          unit="µF"
        />
        
        <ResultItem 
          label="แรงดันขั้นต่ำ"
          value={data.minVoltage}
          unit="V"
        />
        
        <ResultItem 
          label="แรงดันที่แนะนำ"
          value={data.recommendedVoltage}
          unit="V"
          highlight={true}
        />
      </div>
      
      <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-xl border-l-4 border-amber-500 shadow-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1.5 shadow-md">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-amber-900 font-bold mb-2">คำแนะนำสำคัญ</h4>
            <p className="text-amber-800 text-sm leading-relaxed font-medium">
              ควรเลือก Capacitor ที่มีแรงดันสูงกว่าค่าขั้นต่ำ เพื่อความปลอดภัย
              และอายุการใช้งานที่ยาวนาน โดยเฉพาะในสภาพแวดล้อมที่มีความร้อนสูง
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}