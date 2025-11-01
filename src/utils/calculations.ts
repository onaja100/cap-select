export interface MotorData {
  resistance: number
  voltage: number
  frequency: number
}

export interface CapacitorRecommendation {
  capacitance: number // µF
  minVoltage: number // V
  recommendedVoltage: number // V
}

export interface CalculationResults {
  Xc: number // Ω
  Z: number // Ω
  I: number // A
  theta: number // degrees
  powerLoss: number // W
}

export interface UserCapacitor {
  capacitance: number // µF
  voltage: number // V
}

export interface ComparisonResults extends CalculationResults {
  capacitance: number // µF (user's capacitor)
  voltage: number // V (user's capacitor)
  capacitanceDiff: number // %
  currentDiff: number // %
  powerLossDiff: number // %
  XcDiff: number // %
  thetaDiff: number // degrees
  safetyFactor: number
  voltageStatus: string
}

// Constants
export const FREQUENCY = 50 // Hz (Thailand)
export const PI = Math.PI

// Safe calculation wrapper
export const safeCalculate = (fn: () => number, fallback: number = 0): number => {
  try {
    const result = fn()
    return isNaN(result) || !isFinite(result) ? fallback : result
  } catch (error) {
    console.error('Calculation error:', error)
    return fallback
  }
}

// 1. Calculate Recommended Capacitor
export const calculateRecommendedCapacitor = (motorData: MotorData): CapacitorRecommendation => {
  const { resistance: R, voltage: V_rms } = motorData
  
  // Step 1: Calculate ideal Capacitive Reactance
  // For θ ≈ 89-90°, Xc should be 60-100 times larger than R
  const idealXc = R * 60 // Ω
  
  // Step 2: Calculate capacitance (C)
  // From Xc = 1 / (2πfC), solve for C
  const C_farad = safeCalculate(() => 1 / (2 * PI * FREQUENCY * idealXc))
  const C_microFarad = C_farad * 1000000 // Convert to µF
  
  // Step 3: Calculate voltage requirements
  const V_peak = V_rms * Math.sqrt(2) // Peak voltage
  const V_capacitor_min = V_peak * 1.5 // Minimum voltage rating (safety factor 1.5)
  
  // Common standard voltages
  let standardVoltage = 450 // Default for 220V
  if (V_rms >= 350) {
    standardVoltage = 630 // For 380V systems
  }
  
  return {
    capacitance: Math.round(C_microFarad * 10) / 10, // Round to 1 decimal
    minVoltage: Math.round(V_capacitor_min),
    recommendedVoltage: standardVoltage
  }
}

// 2. Calculate Performance Parameters
export const calculatePerformanceParameters = (
  motorData: MotorData, 
  capacitance_uF: number
): CalculationResults => {
  const { resistance: R, voltage: V } = motorData
  const C_farad = capacitance_uF / 1000000 // Convert µF to Farad
  
  // Capacitive Reactance
  const Xc = safeCalculate(() => 1 / (2 * PI * FREQUENCY * C_farad))
  
  // Impedance
  const Z = safeCalculate(() => Math.sqrt(R * R + Xc * Xc))
  
  // Current
  const I = safeCalculate(() => V / Z)
  
  // Phase Angle
  const theta_radians = safeCalculate(() => Math.atan(Xc / R))
  const theta_degrees = theta_radians * (180 / PI)
  
  // Power Loss
  const powerLoss = safeCalculate(() => I * I * R)
  
  return {
    Xc: Math.round(Xc * 10) / 10,
    Z: Math.round(Z * 10) / 10,
    I: Math.round(I * 1000) / 1000, // 3 decimal places
    theta: Math.round(theta_degrees * 10) / 10,
    powerLoss: Math.round(powerLoss * 100) / 100 // 2 decimal places
  }
}

// 3. Compare User's Capacitor with Recommended
export const compareCapacitors = (
  motorData: MotorData,
  recommended: CapacitorRecommendation,
  recommendedCalcs: CalculationResults,
  userCapacitor: UserCapacitor
): ComparisonResults => {
  // Calculate user's capacitor performance
  const userCalcs = calculatePerformanceParameters(motorData, userCapacitor.capacitance)
  
  // Calculate differences in percentages
  const capacitanceDiff = ((userCapacitor.capacitance - recommended.capacitance) / recommended.capacitance) * 100
  const currentDiff = ((userCalcs.I - recommendedCalcs.I) / recommendedCalcs.I) * 100
  const powerLossDiff = ((userCalcs.powerLoss - recommendedCalcs.powerLoss) / recommendedCalcs.powerLoss) * 100
  const XcDiff = ((userCalcs.Xc - recommendedCalcs.Xc) / recommendedCalcs.Xc) * 100
  const thetaDiff = userCalcs.theta - recommendedCalcs.theta
  
  // Calculate safety factor for voltage
  const V_peak_actual = motorData.voltage * 1.1 * Math.sqrt(2)
  const safetyFactor = userCapacitor.voltage / V_peak_actual
  
  // Determine voltage status
  let voltageStatus: string
  if (safetyFactor < 1.0) {
    voltageStatus = "อันตราย! Capacitor อาจระเบิด"
  } else if (safetyFactor < 1.3) {
    voltageStatus = "เสี่ยง - ไม่แนะนำ"
  } else if (safetyFactor < 1.5) {
    voltageStatus = "ใช้ได้ แต่ safety margin น้อย"
  } else {
    voltageStatus = "ปลอดภัย"
  }
  
  return {
    ...userCalcs,
    capacitance: userCapacitor.capacitance,
    voltage: userCapacitor.voltage,
    capacitanceDiff: Math.round(capacitanceDiff * 10) / 10,
    currentDiff: Math.round(currentDiff * 10) / 10,
    powerLossDiff: Math.round(powerLossDiff * 10) / 10,
    XcDiff: Math.round(XcDiff * 10) / 10,
    thetaDiff: Math.round(thetaDiff * 100) / 100,
    safetyFactor: Math.round(safetyFactor * 100) / 100,
    voltageStatus
  }
}