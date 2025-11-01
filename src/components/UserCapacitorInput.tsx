import React from 'react'
import { InputField } from './InputField'
import type { CapacitorInputData, ValidationError } from '../utils/validation'

interface UserCapacitorInputProps {
  data: CapacitorInputData
  onChange: (data: CapacitorInputData) => void
  onCompare: () => void
  errors: ValidationError
  isComparing?: boolean
  disabled?: boolean
}

export const UserCapacitorInput: React.FC<UserCapacitorInputProps> = ({
  data,
  onChange,
  onCompare,
  errors,
  isComparing = false,
  disabled = false
}) => {
  const handleInputChange = (field: keyof CapacitorInputData) => (value: string) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!disabled) {
      onCompare()
    }
  }

  return (
    <div className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-200/50 p-4 sm:p-6 mb-6 sm:mb-8 hover:shadow-orange-200/50 hover:shadow-2xl transition-all duration-300 ${disabled ? 'opacity-60' : ''}`}>
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-xl p-2 sm:p-2.5 mr-3 shadow-lg shadow-orange-500/50">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">ตรวจสอบ Capacitor ที่คุณมี</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">เปรียบเทียบ Capacitor ที่มีอยู่กับค่าที่แนะนำ</p>
        </div>
      </div>
      
      {disabled && (
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-600 font-medium">
              กรุณาคำนวณค่าที่แนะนำก่อน จึงจะสามารถเปรียบเทียบได้
            </p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <InputField
            label="ความจุ"
            value={data.capacitance}
            onChange={handleInputChange('capacitance')}
            unit="µF"
            placeholder="เช่น 3.0"
            error={errors.capacitance}
            type="number"
            disabled={disabled}
          />
          
          <InputField
            label="แรงดัน"
            value={data.voltage}
            onChange={handleInputChange('voltage')}
            unit="V"
            placeholder="เช่น 450"
            error={errors.voltage}
            type="number"
            disabled={disabled}
          />
        </div>
        
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isComparing || disabled}
            className={`
              relative px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300/50 shadow-xl hover:shadow-2xl
              ${isComparing || disabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 shadow-orange-500/50'
              }
            `}
          >
            {isComparing && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isComparing ? 'กำลังเปรียบเทียบ...' : (
              <>
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                เปรียบเทียบผลลัพธ์
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-xl border-l-4 border-orange-500 shadow-md">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-orange-900 font-bold">
              <strong>หมายเหตุ:</strong>
            </p>
            <p className="text-sm text-orange-800 mt-1 font-medium">
              กรอกข้อมูล Capacitor ที่คุณมีอยู่ เพื่อดูความแตกต่างและผลกระทบต่อประสิทธิภาพมอเตอร์
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}