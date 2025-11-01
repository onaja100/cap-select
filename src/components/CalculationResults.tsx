import React from 'react'
import { CalculationItem } from './CalculationItem'
import type { CalculationResults as CalculationResultsType } from '../utils/calculations'

interface CalculationResultsProps {
  data: CalculationResultsType
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({ data }) => {
  const calculationItems = [
    {
      label: "Capacitive Reactance (Xc)",
      value: data.Xc,
      unit: "Ω",
      tooltip: "ความต้านทานของ Capacitor ต่อกระแส AC - ยิ่งต่ำยิ่งให้กระแสไหลผ่านได้ง่าย"
    },
    {
      label: "Impedance (Z)",
      value: data.Z,
      unit: "Ω",
      tooltip: "ความต้านทานรวมของวงจร - ยิ่งต่ำยิ่งมีกระแสมาก"
    },
    {
      label: "Current (I)",
      value: data.I,
      unit: "A",
      tooltip: "กระแสที่ไหลผ่านขดลวด Start - ต้องอยู่ในช่วงที่เหมาะสม ไม่มากหรือน้อยเกินไป"
    },
    {
      label: "Phase Angle (θ)",
      value: data.theta,
      unit: "°",
      tooltip: "มุมความต่างเฟสระหว่างกระแสและแรงดัน - ควรใกล้ 90° เพื่อแรงบิดสูงสุด"
    },
    {
      label: "Power Loss (P)",
      value: data.powerLoss,
      unit: "W",
      tooltip: "กำลังสูญเสียเป็นความร้อนในขดลวด - ยิ่งสูงยิ่งมอเตอร์ร้อน"
    }
  ]

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-purple-200/50 p-4 sm:p-6 mb-6 sm:mb-8 hover:shadow-purple-200/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-purple-500 via-violet-600 to-fuchsia-600 rounded-xl p-2 sm:p-2.5 mr-3 shadow-lg shadow-purple-500/50">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">ผลการคำนวณ</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            ค่าพารามิเตอร์ต่างๆ ของวงจร 
            <span className="hidden sm:inline"> - วางเมาส์เพื่อดูคำอธิบาย</span>
            <span className="sm:hidden"> - แตะเพื่อดูคำอธิบาย</span>
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {calculationItems.map((item, index) => (
          <CalculationItem
            key={index}
            label={item.label}
            value={item.value}
            unit={item.unit}
            tooltip={item.tooltip}
          />
        ))}
      </div>
      
      <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-purple-50 via-violet-50 to-fuchsia-50 rounded-xl border-l-4 border-purple-500 shadow-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-purple-400 to-violet-500 rounded-full p-1.5 shadow-md">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-purple-900 font-bold mb-2">วิธีการตีความผลลัพธ์</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 border border-purple-300/50 shadow-sm">
                <div className="font-bold text-purple-700 mb-1">มุมเฟส (θ)</div>
                <div className="text-purple-600 font-medium">ควรใกล้ 90° เพื่อประสิทธิภาพสูงสุด</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 border border-violet-300/50 shadow-sm">
                <div className="font-bold text-violet-700 mb-1">กระแส (I)</div>
                <div className="text-violet-600 font-medium">ต้องอยู่ในช่วงที่เหมาะสมกับมอเตอร์</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5 border border-fuchsia-300/50 shadow-sm">
                <div className="font-bold text-fuchsia-700 mb-1">Power Loss</div>
                <div className="text-fuchsia-600 font-medium">ยิ่งต่ำยิ่งดี เพื่อลดความร้อน</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}