import { useState } from 'react'
import { MotorInputForm } from './components/MotorInputForm'
import { RecommendedCapacitor } from './components/RecommendedCapacitor'
import { CalculationResults } from './components/CalculationResults'
import { UserCapacitorInput } from './components/UserCapacitorInput'
import { ComparisonTable } from './components/ComparisonTable'
import { AccordionSection } from './components/AccordionSection'
import { TabPanel } from './components/TabPanel'
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

  // Tab state for tablet view
  const [activeTab, setActiveTab] = useState<string>('results')

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

      // Switch to comparison tab on tablet
      setActiveTab('comparison')

    } catch (error) {
      console.error('Comparison error:', error)
      alert('เกิดข้อผิดพลาดในการเปรียบเทียบ กรุณาตรวจสอบข้อมูลที่กรอก')
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Compact Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg flex-shrink-0">
        <div className="px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="bg-white/20 rounded-lg p-1.5 lg:p-2">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-white">
                Cap-Select Calculator
              </h1>
              <p className="hidden lg:block text-xs text-blue-100">
                คำนวณ Capacitor มอเตอร์ Single-Phase
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Grid Layout */}
      <main className="flex-1 overflow-hidden p-2 lg:p-4">

        {/* Mobile Layout - Accordion */}
        <div className="lg:hidden h-full overflow-y-auto space-y-2">
          {/* Step 1: Motor Input */}
          <AccordionSection
            title="ขั้นตอนที่ 1: ข้อมูลมอเตอร์"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            defaultOpen={true}
          >
            <MotorInputForm
              data={motorData}
              onChange={setMotorData}
              onCalculate={handleCalculate}
              errors={motorErrors}
              isCalculating={isCalculating}
            />
          </AccordionSection>

          {/* Step 2: Results */}
          {results && (
            <AccordionSection
              title="ขั้นตอนที่ 2: ผลการคำนวณ"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              badge="✓"
              defaultOpen={true}
            >
              <div className="space-y-3">
                <RecommendedCapacitor data={results.recommended} />
                <CalculationResults data={results.calculations} />
              </div>
            </AccordionSection>
          )}

          {/* Step 3: Comparison */}
          {results && (
            <AccordionSection
              title="ขั้นตอนที่ 3: เปรียบเทียบ"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              badge={results.comparison ? "✓" : ""}
              defaultOpen={false}
            >
              <div className="space-y-3">
                <UserCapacitorInput
                  data={userCapacitor}
                  onChange={setUserCapacitor}
                  onCompare={handleCompare}
                  errors={capacitorErrors}
                  isComparing={isComparing}
                  disabled={!results}
                />
                {results.comparison && (
                  <ComparisonTable
                    recommended={results.recommended}
                    recommendedCalcs={results.calculations}
                    user={results.comparison}
                  />
                )}
              </div>
            </AccordionSection>
          )}
        </div>

        {/* Tablet Layout - 2 Columns */}
        <div className="hidden lg:grid xl:hidden h-full grid-cols-[350px_1fr] gap-4 overflow-hidden">
          {/* Left Column - Inputs */}
          <div className="flex flex-col gap-3 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ข้อมูลมอเตอร์
              </h3>
              <MotorInputForm
                data={motorData}
                onChange={setMotorData}
                onCalculate={handleCalculate}
                errors={motorErrors}
                isCalculating={isCalculating}
              />
            </div>

            {results && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Capacitor ที่คุณมี
                </h3>
                <UserCapacitorInput
                  data={userCapacitor}
                  onChange={setUserCapacitor}
                  onCompare={handleCompare}
                  errors={capacitorErrors}
                  isComparing={isComparing}
                  disabled={!results}
                />
              </div>
            )}
          </div>

          {/* Right Column - Results with Tabs */}
          <div className="overflow-y-auto">
            {results ? (
              <TabPanel
                tabs={[
                  {
                    id: 'results',
                    label: 'ผลการคำนวณ',
                    icon: '✓'
                  },
                  {
                    id: 'comparison',
                    label: 'เปรียบเทียบ',
                    icon: '📊',
                    badge: results.comparison ? '✓' : ''
                  }
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              >
                {activeTab === 'results' && (
                  <div className="space-y-4">
                    <RecommendedCapacitor data={results.recommended} />
                    <CalculationResults data={results.calculations} />
                  </div>
                )}
                {activeTab === 'comparison' && results.comparison && (
                  <ComparisonTable
                    recommended={results.recommended}
                    recommendedCalcs={results.calculations}
                    user={results.comparison}
                  />
                )}
                {activeTab === 'comparison' && !results.comparison && (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>กรุณากรอกข้อมูล Capacitor ที่คุณมีเพื่อเปรียบเทียบ</p>
                  </div>
                )}
              </TabPanel>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-lg">กรุณากรอกข้อมูลมอเตอร์และกดคำนวณ</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout - 3 Columns */}
        <div className="hidden xl:grid h-full gap-4 overflow-hidden"
             style={{
               gridTemplateColumns: results?.comparison
                 ? '350px 1fr 420px'
                 : '350px 1fr'
             }}>

          {/* Left Column - Inputs */}
          <div className="flex flex-col gap-3 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ข้อมูลมอเตอร์
              </h3>
              <MotorInputForm
                data={motorData}
                onChange={setMotorData}
                onCalculate={handleCalculate}
                errors={motorErrors}
                isCalculating={isCalculating}
              />
            </div>

            {results && (
              <div className="bg-white rounded-lg shadow-lg p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Capacitor ที่คุณมี
                </h3>
                <UserCapacitorInput
                  data={userCapacitor}
                  onChange={setUserCapacitor}
                  onCompare={handleCompare}
                  errors={capacitorErrors}
                  isComparing={isComparing}
                  disabled={!results}
                />
              </div>
            )}
          </div>

          {/* Middle Column - Results */}
          <div className="overflow-y-auto">
            {results ? (
              <div className="space-y-4">
                <RecommendedCapacitor data={results.recommended} />
                <CalculationResults data={results.calculations} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <svg className="w-32 h-32 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-xl font-medium mb-2">เริ่มต้นการคำนวณ</p>
                  <p className="text-gray-500">กรุณากรอกข้อมูลมอเตอร์ทางซ้ายและกดคำนวณ</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Comparison (conditional) */}
          {results?.comparison && (
            <div className="overflow-y-auto bg-white rounded-lg shadow-lg p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                ผลการเปรียบเทียบ
              </h3>
              <ComparisonTable
                recommended={results.recommended}
                recommendedCalcs={results.calculations}
                user={results.comparison}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
