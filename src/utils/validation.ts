export interface ValidationError {
  [key: string]: string
}

export interface MotorInputData {
  resistance: string
  voltage: string
  frequency: string
}

export interface CapacitorInputData {
  capacitance: string
  voltage: string
}

export const validateMotorInputs = (data: MotorInputData): ValidationError => {
  const errors: ValidationError = {}
  
  // Validate resistance
  if (!data.resistance || data.resistance.trim() === '') {
    errors.resistance = "กรุณากรอกความต้านทาน"
  } else {
    const resistance = parseFloat(data.resistance)
    if (isNaN(resistance) || resistance <= 0) {
      errors.resistance = "กรุณากรอกความต้านทาน (มากกว่า 0)"
    } else if (resistance > 1000) {
      errors.resistance = "ความต้านทานสูงผิดปกติ (ตรวจสอบหน่วย)"
    }
  }
  
  // Validate voltage
  if (!data.voltage || data.voltage.trim() === '') {
    errors.voltage = "กรุณากรอกแรงดันไฟ"
  } else {
    const voltage = parseFloat(data.voltage)
    if (isNaN(voltage) || voltage <= 0) {
      errors.voltage = "กรุณากรอกแรงดันไฟ (มากกว่า 0)"
    } else if (voltage > 500) {
      errors.voltage = "แรงดันสูงผิดปกติสำหรับมอเตอร์บ้าน"
    }
  }
  
  // Validate frequency (should always be 50 Hz for Thailand)
  if (!data.frequency || data.frequency.trim() === '') {
    errors.frequency = "กรุณากรอกความถี่"
  } else {
    const frequency = parseFloat(data.frequency)
    if (isNaN(frequency) || frequency <= 0) {
      errors.frequency = "กรุณากรอกความถี่ (มากกว่า 0)"
    } else if (frequency !== 50) {
      errors.frequency = "ความถี่มาตรฐานในประเทศไทยคือ 50 Hz"
    }
  }
  
  return errors
}

export const validateCapacitorInputs = (data: CapacitorInputData): ValidationError => {
  const errors: ValidationError = {}
  
  // Validate capacitance
  if (!data.capacitance || data.capacitance.trim() === '') {
    errors.capacitance = "กรุณากรอกความจุ"
  } else {
    const capacitance = parseFloat(data.capacitance)
    if (isNaN(capacitance) || capacitance <= 0) {
      errors.capacitance = "กรุณากรอกความจุ (มากกว่า 0)"
    } else if (capacitance > 100) {
      errors.capacitance = "ความจุสูงผิดปกติสำหรับมอเตอร์บ้าน"
    }
  }
  
  // Validate voltage
  if (!data.voltage || data.voltage.trim() === '') {
    errors.voltage = "กรุณากรอกแรงดัน"
  } else {
    const voltage = parseFloat(data.voltage)
    if (isNaN(voltage) || voltage <= 0) {
      errors.voltage = "กรุณากรอกแรงดัน (มากกว่า 0)"
    } else if (voltage > 1000) {
      errors.voltage = "แรงดันสูงผิดปกติ"
    }
  }
  
  return errors
}

export const hasErrors = (errors: ValidationError): boolean => {
  return Object.keys(errors).length > 0
}

export const parseMotorData = (data: MotorInputData) => {
  return {
    resistance: parseFloat(data.resistance),
    voltage: parseFloat(data.voltage),
    frequency: parseFloat(data.frequency)
  }
}

export const parseCapacitorData = (data: CapacitorInputData) => {
  return {
    capacitance: parseFloat(data.capacitance),
    voltage: parseFloat(data.voltage)
  }
}