import { useState } from 'react'
import { MotorInputForm } from './components/MotorInputForm'
import { RecommendedCapacitor } from './components/RecommendedCapacitor'
import { CalculationResults } from './components/CalculationResults'
import { UserCapacitorInput } from './components/UserCapacitorInput'
import { ComparisonTable } from './components/ComparisonTable'
import { 
  calculateRecommendedCapacitor,
  calculatePerformanceParameters,
  compareCapacitors
} from './utils/calculations'
import type { 
  CapacitorRecommendation,
  CalculationResults as CalculationResultsType,
  ComparisonResults
} from './utils/calculations'
import { 
  validateMotorInputs,
  validateCapacitorInputs,
  parseMotorData,
  parseCapacitorData,
  hasErrors
} from './utils/validation'
import type { 
  MotorInputData,
  CapacitorInputData,
  ValidationError
} from './utils/validation'

interface AppResults {
  recommended: CapacitorRecommendation
  calculations: CalculationResultsType
  comparison?: ComparisonResults
}

function App() {
  // Motor input state
  const [motorData, setMotorData] = useState<MotorInputData>({
    resistance: '',
    voltage: '',
    frequency: '50'
  })
  
  // User capacitor input state
  const [userCapacitor, setUserCapacitor] = useState<CapacitorInputData>({
    capacitance: '',
    voltage: ''
  })
  
  // Results state
  const [results, setResults] = useState<AppResults | null>(null)
  
  // Validation errors state
  const [motorErrors, setMotorErrors] = useState<ValidationError>({})
  const [capacitorErrors, setCapacitorErrors] = useState<ValidationError>({})
  
  // Loading states
  const [isCalculating, setIsCalculating] = useState(false)
  const [isComparing, setIsComparing] = useState(false)

  const handleCalculate = async () => {
    // Validate motor inputs
    const errors = validateMotorInputs(motorData)
    setMotorErrors(errors)
    
    if (hasErrors(errors)) {
      return
    }
    
    setIsCalculating(true)
    
    try {
      // Parse motor data
      const parsedMotorData = parseMotorData(motorData)
      
      // Calculate recommended capacitor
      const recommended = calculateRecommendedCapacitor(parsedMotorData)
      
      // Calculate performance parameters for recommended capacitor
      const calculations = calculatePerformanceParameters(parsedMotorData, recommended.capacitance)
      
      // Update results
      setResults({
        recommended,
        calculations,
        comparison: undefined // Reset comparison when recalculating
      })
      
      // Reset user capacitor comparison
      setUserCapacitor({ capacitance: '', voltage: '' })
      setCapacitorErrors({})
      
    } catch (error) {
      console.error('Calculation error:', error)
      alert('เกิดข้อผิดพลาดในการคำนวณ กรุณาตรวจสอบข้อมูลที่กรอก')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleCompare = async () => {
    if (!results) return
    
    // Validate capacitor inputs
    const errors = validateCapacitorInputs(userCapacitor)
    setCapacitorErrors(errors)
    
    if (hasErrors(errors)) {
      return
    }
    
    setIsComparing(true)
    
    try {
      // Parse capacitor data
      const parsedCapacitorData = parseCapacitorData(userCapacitor)
      const parsedMotorData = parseMotorData(motorData)
      
      // Compare capacitors
      const comparison = compareCapacitors(
        parsedMotorData,
        results.recommended,
        results.calculations,
        parsedCapacitorData
      )
      
      // Update results with comparison
      setResults({
        ...results,
        comparison
      })
      
    } catch (error) {
      console.error('Comparison error:', error)
      alert('เกิดข้อผิดพลาดในการเปรียบเทียบ กรุณาตรวจสอบข้อมูลที่กรอก')
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 shadow-2xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
          {/* Unified Card Layout */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 mx-auto max-w-sm sm:max-w-4xl">
            <div className="text-center">
              <div className="flex justify-center items-center mb-2 sm:mb-3">
                <div className="bg-white/20 rounded-lg p-1.5 sm:p-2 mr-2 sm:mr-3">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">
                  <span className="sm:hidden">Cap-Select</span>
                  <span className="hidden sm:inline">Cap-Select Calculator</span>
                </h1>
              </div>
              <p className="text-blue-100 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed mb-0 sm:mb-4">
                <span className="sm:hidden">คำนวณ Capacitor มอเตอร์ Single-Phase</span>
                <span className="hidden sm:inline">เครื่องมือคำนวณ Capacitor สำหรับมอเตอร์ Single-Phase อย่างแม่นยำ</span>
              </p>
              <div className="hidden sm:flex flex-wrap justify-center gap-2 lg:gap-3 text-xs lg:text-sm text-blue-200">
                <span className="bg-white/10 rounded-full px-3 py-1.5 flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  คำนวณแม่นยำ
                </span>
                <span className="bg-white/10 rounded-full px-3 py-1.5 flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  ประเมินความปลอดภัย
                </span>
                <span className="bg-white/10 rounded-full px-3 py-1.5 flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  เปรียบเทียบผลกระทบ
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 -mt-3 sm:-mt-4 relative z-10">
        {/* Motor Input Form */}
        <MotorInputForm
          data={motorData}
          onChange={setMotorData}
          onCalculate={handleCalculate}
          errors={motorErrors}
          isCalculating={isCalculating}
        />

        {/* Results Section */}
        {results && (
          <div className="space-y-3 sm:space-y-4">
            {/* Recommended Capacitor */}
            <div className="animate-slide-in-up">
              <RecommendedCapacitor data={results.recommended} />
            </div>

            {/* Calculation Results */}
            <div className="animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <CalculationResults data={results.calculations} />
            </div>

            {/* User Capacitor Input */}
            <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <UserCapacitorInput
                data={userCapacitor}
                onChange={setUserCapacitor}
                onCompare={handleCompare}
                errors={capacitorErrors}
                isComparing={isComparing}
                disabled={!results}
              />
            </div>

            {/* Comparison Table */}
            {results.comparison && (
              <div className="animate-scale-in">
                <ComparisonTable
                  recommended={results.recommended}
                  recommendedCalcs={results.calculations}
                  user={results.comparison}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-slate-800 to-gray-900 border-t border-purple-500/30 mt-8 sm:mt-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Footer */}
          <div className="block sm:hidden text-center">
            <div className="bg-slate-700/50 rounded-lg p-3 mb-3">
              <div className="flex justify-center items-center mb-2">
                <div className="bg-blue-500/20 rounded-lg p-1 mr-2">
                  <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-white text-sm font-semibold">Cap-Select</span>
              </div>
              <p className="text-slate-300 text-xs mb-2">
                คำนวณ Capacitor มอเตอร์แม่นยำ
              </p>
              <div className="text-xs text-slate-400">
                v1.0.0 • ฟรี • มาตรฐานไทย 50Hz
              </div>
            </div>
            <p className="text-slate-500 text-xs">
              © 2024 Cap-Select Calculator
            </p>
          </div>

          {/* Desktop Footer */}
          <div className="hidden sm:block text-center">
            <div className="flex justify-center items-center mb-3">
              <div className="bg-blue-500/20 rounded-lg p-1.5 mr-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white font-semibold">Cap-Select Calculator</span>
            </div>
            <p className="text-slate-400 text-sm mb-3">
              เครื่องมือคำนวณ Capacitor สำหรับมอเตอร์ Single-Phase อย่างแม่นยำและปลอดภัย
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 mb-3">
              <span className="bg-slate-700/50 rounded px-2 py-1">v1.0.0</span>
              <span className="bg-slate-700/50 rounded px-2 py-1">ระบบคำนวณแม่นยำ</span>
              <span className="bg-slate-700/50 rounded px-2 py-1">ประเมินความปลอดภัย</span>
              <span className="bg-slate-700/50 rounded px-2 py-1">รองรับมาตรฐานไทย 50Hz</span>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <p className="text-slate-500 text-xs">
                © 2024 Cap-Select Calculator. ใช้งานได้ฟรี เพื่อความปลอดภัยในการใช้งานมอเตอร์
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
