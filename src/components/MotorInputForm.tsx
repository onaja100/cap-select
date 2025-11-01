import React from 'react'
import { InputField } from './InputField'
import type { MotorInputData, ValidationError } from '../utils/validation'

interface MotorInputFormProps {
  data: MotorInputData
  onChange: (data: MotorInputData) => void
  onCalculate: () => void
  errors: ValidationError
  isCalculating?: boolean
}

export const MotorInputForm: React.FC<MotorInputFormProps> = ({
  data,
  onChange,
  onCalculate,
  errors,
  isCalculating = false
}) => {
  const handleInputChange = (field: keyof MotorInputData) => (value: string) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCalculate()
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-2 sm:p-2.5 mr-3 shadow-lg">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">ข้อมูลมอเตอร์</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">กรอกข้อมูลพื้นฐานของมอเตอร์ Single-Phase</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <InputField
            label="ความต้านทานขดลวด Start"
            value={data.resistance}
            onChange={handleInputChange('resistance')}
            unit="Ω"
            placeholder="เช่น 20"
            error={errors.resistance}
            type="number"
          />
          
          <InputField
            label="แรงดันไฟ"
            value={data.voltage}
            onChange={handleInputChange('voltage')}
            unit="V"
            placeholder="เช่น 220"
            error={errors.voltage}
            type="number"
          />
        </div>
        
        <InputField
          label="ความถี่"
          value={data.frequency}
          onChange={handleInputChange('frequency')}
          unit="Hz"
          disabled={true}
          error={errors.frequency}
          type="number"
        />
        
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isCalculating}
            className={`
              relative px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300/50 shadow-lg hover:shadow-xl
              ${isCalculating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }
            `}
          >
            {isCalculating && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isCalculating ? 'กำลังคำนวณ...' : (
              <>
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                คำนวณ Capacitor
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-blue-700 font-medium">
              <strong>ข้อมูลสำคัญ:</strong>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              ความถี่ไฟฟ้าในประเทศไทยเป็น 50 Hz ตามมาตรฐาน (ไม่สามารถแก้ไขได้)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}