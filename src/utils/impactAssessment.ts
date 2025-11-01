export interface ImpactResult {
  text: string
  color: string
}

export const getCapacitanceImpact = (diff: number): ImpactResult => {
  if (Math.abs(diff) < 10) {
    return { text: "✅ เหมาะสม", color: "green" }
  } else if (diff < -30) {
    return { 
      text: "❌ น้อยเกินไป - สตาร์ทยาก มอเตอร์ร้อน", 
      color: "red" 
    }
  } else if (diff < -10) {
    return { 
      text: "⚠️ น้อยกว่าที่แนะนำ - สตาร์ทอาจช้า", 
      color: "orange" 
    }
  } else if (diff > 50) {
    return { 
      text: "❌ มากเกินไป - กระแสสูง มอเตอร์ร้อนจัด", 
      color: "red" 
    }
  } else if (diff > 10) {
    return { 
      text: "⚠️ มากกว่าที่แนะนำ - มอเตอร์อาจร้อน", 
      color: "orange" 
    }
  }
  return { text: "✅ เหมาะสม", color: "green" }
}

export const getVoltageImpact = (safetyFactor: number): ImpactResult => {
  if (safetyFactor >= 1.5) {
    return { text: "✅ ปลอดภัย", color: "green" }
  } else if (safetyFactor >= 1.3) {
    return { text: "🟡 ใช้ได้ แต่ safety margin น้อย", color: "yellow" }
  } else if (safetyFactor >= 1.0) {
    return { text: "⚠️ เสี่ยง - ไม่แนะนำใช้งานนาน", color: "orange" }
  } else {
    return { text: "❌ อันตราย! Capacitor อาจระเบิด", color: "red" }
  }
}

export const getCurrentImpact = (diff: number): ImpactResult => {
  if (Math.abs(diff) < 20) {
    return { text: "✅ ปกติ", color: "green" }
  } else if (diff < -40) {
    return { text: "❌ กระแสต่ำเกินไป - แรงบิดไม่พอ", color: "red" }
  } else if (diff > 50) {
    return { text: "❌ กระแสสูงเกินไป - มอเตอร์ร้อนจัด", color: "red" }
  } else {
    return { text: "⚠️ กระแสไม่เหมาะสม", color: "orange" }
  }
}

export const getPhaseImpact = (theta: number): ImpactResult => {
  if (theta >= 88 && theta <= 90) {
    return { text: "✅ มุมเฟสเหมาะสม", color: "green" }
  } else if (theta >= 85 && theta < 88) {
    return { text: "⚠️ มุมเฟสต่ำไป - ประสิทธิภาพลดลง", color: "orange" }
  } else {
    return { text: "❌ มุมเฟสไม่เหมาะสม", color: "red" }
  }
}

export const getPowerLossImpact = (diff: number): ImpactResult => {
  if (Math.abs(diff) < 20) {
    return { text: "✅ ปกติ", color: "green" }
  } else if (diff > 100) {
    return { 
      text: "❌ ความร้อนสูงเกินไป - อันตราย!", 
      color: "red" 
    }
  } else if (diff > 50) {
    return { 
      text: "⚠️ ความร้อนสูง - มอเตอร์อาจเสียหาย", 
      color: "orange" 
    }
  } else {
    return { text: "🟡 อุณหภูมิสูงกว่าปกติ", color: "yellow" }
  }
}

// Helper function to get Tailwind CSS classes based on color
export const getColorClasses = (color: string): string => {
  switch (color) {
    case 'green':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'yellow':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'orange':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'red':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// Summary assessment based on multiple factors
export const getOverallAssessment = (
  capacitanceDiff: number,
  safetyFactor: number,
  currentDiff: number
): ImpactResult => {
  const capacitanceImpact = getCapacitanceImpact(capacitanceDiff)
  const voltageImpact = getVoltageImpact(safetyFactor)
  const currentImpact = getCurrentImpact(currentDiff)
  
  // If any critical issue (red), overall is dangerous
  if (
    capacitanceImpact.color === 'red' || 
    voltageImpact.color === 'red' || 
    currentImpact.color === 'red'
  ) {
    return { text: "❌ ไม่แนะนำให้ใช้ - มีปัญหาร้อนแรง", color: "red" }
  }
  
  // If any warning (orange), overall needs attention
  if (
    capacitanceImpact.color === 'orange' || 
    voltageImpact.color === 'orange' || 
    currentImpact.color === 'orange'
  ) {
    return { text: "⚠️ ควรปรับปรุง - ใช้ได้แต่ไม่เหมาะสมที่สุด", color: "orange" }
  }
  
  // If any caution (yellow), overall is acceptable
  if (
    capacitanceImpact.color === 'yellow' || 
    voltageImpact.color === 'yellow' || 
    currentImpact.color === 'yellow'
  ) {
    return { text: "🟡 ใช้ได้ - แต่ควรระวัง", color: "yellow" }
  }
  
  // All green - excellent
  return { text: "✅ เหมาะสมมาก - แนะนำให้ใช้", color: "green" }
}