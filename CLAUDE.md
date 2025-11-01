# Cap-Select Application

## Project Overview
**Cap-Select** เป็น web application สำหรับคำนวณและเลือก Capacitor ที่เหมาะสมสำหรับมอเตอร์ Single-Phase (เช่น พัดลม) โดยช่วยให้ผู้ใช้สามารถ:
- คำนวณค่า Capacitor ที่เหมาะสมจากข้อมูลมอเตอร์
- เปรียบเทียบ Capacitor ที่มีอยู่กับค่าที่แนะนำ
- เข้าใจผลกระทบของการเลือก Capacitor ที่ไม่เหมาะสม

---

## Technical Stack
- **Framework:** React (via Vite)
- **Language:** JavaScript/TypeScript
- **Styling:** Tailwind CSS (recommended) หรือ CSS modules
- **Math Library:** ไม่จำเป็นต้องใช้ library เพิ่มเติม (ใช้ Math.sqrt, Math.atan)

---

## Features & User Flow

### Phase 1: Input Section
ผู้ใช้กรอกข้อมูลพื้นฐาน:
1. **ความต้านทานขดลวด Start (R)** - หน่วย: Ω (Ohms)
2. **แรงดันไฟ (V)** - หน่วย: V (Volts)
3. **ความถี่ (f)** - หน่วย: Hz (ค่า default = 50 Hz สำหรับไทย)

### Phase 2: Recommended Capacitor Display
แสดงผลค่าที่แนะนำ:
- **ความจุ (Capacitance)** - หน่วย: µF
- **แรงดันขั้นต่ำ** - หน่วย: V
- **แรงดันที่แนะนำ** - หน่วย: V (450V สำหรับไฟบ้าน 220V)

### Phase 3: Calculation Results with Tooltips
แสดงการคำนวณพร้อม hint tooltip:

| พารามิเตอร์ | สูตร | Tooltip Hint |
|------------|------|--------------|
| **Capacitive Reactance (Xc)** | `1 / (2πfC)` | "ความต้านทานของ Capacitor ต่อกระแส AC - ยิ่งต่ำยิ่งให้กระแสไหลผ่านได้ง่าย" |
| **Impedance (Z)** | `√(R² + Xc²)` | "ความต้านทานรวมของวงจร - ยิ่งต่ำยิ่งมีกระแสมาก" |
| **Current (I)** | `V / Z` | "กระแสที่ไหลผ่านขดลวด Start - ต้องอยู่ในช่วงที่เหมาะสม ไม่มากหรือน้อยเกินไป" |
| **Phase Angle (θ)** | `arctan(Xc / R)` | "มุมความต่างเฟสระหว่างกระแสและแรงดัน - ควรใกล้ 90° เพื่อแรงบิดสูงสุด" |
| **Power Loss (P)** | `I² × R` | "กำลังสูญเสียเป็นความร้อนในขดลวด - ยิ่งสูงยิ่งมอเตอร์ร้อน" |

### Phase 4: User's Capacitor Input
ช่องให้ผู้ใช้กรอกข้อมูล Capacitor ที่มีอยู่:
- **ความจุที่มี** - หน่วย: µF
- **แรงดัน** - หน่วย: V

### Phase 5: Comparison Results
แสดงตารางเปรียบเทียบและผลกระทบ

---

## Calculation Formulas

### Constants
```javascript
const FREQUENCY = 50; // Hz (ไทย)
const PI = Math.PI;
```

### 1. Calculate Recommended Capacitor

#### ขั้นตอนที่ 1: คำนวณ Capacitive Reactance ที่เหมาะสม
เพื่อให้มุมเฟส θ ≈ 90° จะต้องมี Xc >> R

สูตรประมาณ (rule of thumb):
```javascript
// เพื่อให้ θ ≈ 89-90°, Xc ควรมากกว่า R อย่างน้อย 60-100 เท่า
const idealXc = R * 60; // Ω
```

#### ขั้นตอนที่ 2: คำนวณค่าความจุ (C)
จากสูตร: Xc = 1 / (2πfC)

แก้หา C:
```javascript
C = 1 / (2 * PI * FREQUENCY * idealXc)
// แปลงเป็น µF
C_microFarad = C * 1000000
```

#### ขั้นตอนที่ 3: คำนวณแรงดันที่ต้องใช้

**Peak Voltage:**
```javascript
V_peak = V_rms * Math.sqrt(2)
// เช่น 220V → 311.1V
```

**Peak Voltage with Tolerance (+10%):**
```javascript
V_peak_max = V_rms * 1.1 * Math.sqrt(2)
// เช่น 220V → 342.2V
```

**Minimum Voltage Rating:**
```javascript
V_capacitor_min = V_peak * 1.5
// Safety factor 1.5
```

**Recommended Voltage Rating:**
```javascript
V_capacitor_recommended = V_peak_max * 1.5
// Safety factor 1.5 with tolerance
```

**Common Standard Voltage:**
- 220V AC → แนะนำ **450V** capacitor
- 380V AC → แนะนำ **630V** capacitor

### 2. Calculate Performance Parameters

#### Capacitive Reactance:
```javascript
Xc = 1 / (2 * PI * FREQUENCY * C)
// C ต้องเป็น Farad (ถ้าใส่ µF ต้องหารด้วย 1,000,000)
```

#### Impedance:
```javascript
Z = Math.sqrt(R * R + Xc * Xc)
```

#### Current:
```javascript
I = V / Z
```

#### Phase Angle:
```javascript
theta_radians = Math.atan(Xc / R)
theta_degrees = theta_radians * (180 / PI)
```

#### Power Loss:
```javascript
P_loss = I * I * R
```

### 3. Comparison Calculations

เมื่อผู้ใช้กรอก Capacitor ที่มี ให้คำนวณใหม่ทั้งหมดด้วยค่าที่ผู้ใช้กรอก:

```javascript
// User's capacitor
C_user = userInputCapacitance / 1000000 // แปลงเป็น Farad
V_user = userInputVoltage

// คำนวณใหม่
Xc_user = 1 / (2 * PI * FREQUENCY * C_user)
Z_user = Math.sqrt(R * R + Xc_user * Xc_user)
I_user = V / Z_user
theta_user = Math.atan(Xc_user / R) * (180 / PI)
P_loss_user = I_user * I_user * R

// คำนวณความแตกต่าง
diff_capacitance = ((C_user - C_recommended) / C_recommended) * 100 // %
diff_current = ((I_user - I_recommended) / I_recommended) * 100 // %
diff_power_loss = ((P_loss_user - P_loss_recommended) / P_loss_recommended) * 100 // %
```

### 4. Safety Check for Voltage

```javascript
// Peak voltage ที่เกิดขึ้นจริง
V_peak_actual = V_rms * 1.1 * Math.sqrt(2)

// Safety Factor
safety_factor = V_user / V_peak_actual

// ประเมินความปลอดภัย
if (safety_factor < 1.0) {
  status = "อันตราย! Capacitor อาจระเบิด"
  color = "red"
} else if (safety_factor < 1.3) {
  status = "เสี่ยง - ไม่แนะนำ"
  color = "orange"
} else if (safety_factor < 1.5) {
  status = "ใช้ได้ แต่ safety margin น้อย"
  color = "yellow"
} else {
  status = "ปลอดภัย"
  color = "green"
}
```

---

## UI/UX Design Guidelines

### Layout Structure

```
┌─────────────────────────────────────────┐
│         Cap-Select Calculator           │
│  คำนวณ Capacitor สำหรับมอเตอร์          │
├─────────────────────────────────────────┤
│                                         │
│  📋 ข้อมูลมอเตอร์                        │
│  ┌─────────────────────────────────┐   │
│  │ ความต้านทาน Start [____] Ω     │   │
│  │ แรงดันไฟ         [____] V       │   │
│  │ ความถี่           [50__] Hz     │   │
│  │          [คำนวณ]                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ✅ Capacitor ที่แนะนำ                  │
│  ┌─────────────────────────────────┐   │
│  │ ความจุ:    2.5 µF               │   │
│  │ แรงดันขั้นต่ำ: 467 V            │   │
│  │ แนะนำ:     450 V                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📊 ผลการคำนวณ (hover เพื่อดูคำอธิบาย)  │
│  ┌─────────────────────────────────┐   │
│  │ Xc = 1,273.2 Ω          [ℹ️]    │   │
│  │ Z  = 1,273.4 Ω          [ℹ️]    │   │
│  │ I  = 0.173 A            [ℹ️]    │   │
│  │ θ  = 89.1°              [ℹ️]    │   │
│  │ P  = 0.60 W             [ℹ️]    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🔍 ตรวจสอบ Capacitor ที่คุณมี         │
│  ┌─────────────────────────────────┐   │
│  │ ความจุ    [____] µF             │   │
│  │ แรงดัน    [____] V              │   │
│  │          [เปรียบเทียบ]          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📈 ตารางเปรียบเทียบ                    │
│  ┌─────────────────────────────────┐   │
│  │ [Table Component]               │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Color Scheme

```javascript
const colors = {
  safe: '#10b981',      // green-500
  warning: '#f59e0b',   // amber-500
  danger: '#ef4444',    // red-500
  info: '#3b82f6',      // blue-500
  neutral: '#6b7280'    // gray-500
}
```

### Status Indicators

**Current Level:**
- 🟢 60-120% ของค่าแนะนำ → "ปกติ"
- 🟡 40-60% หรือ 120-150% → "ควรปรับ"
- 🔴 <40% หรือ >150% → "อันตราย"

**Voltage Safety:**
- 🟢 Safety Factor ≥ 1.5 → "ปลอดภัย"
- 🟡 Safety Factor 1.3-1.5 → "ใช้ได้"
- 🟠 Safety Factor 1.0-1.3 → "เสี่ยง"
- 🔴 Safety Factor <1.0 → "อันตราย!"

---

## Component Structure

### 1. App.jsx
Main component ที่ประกอบด้วย:

```jsx
function App() {
  const [motorData, setMotorData] = useState({
    resistance: '',
    voltage: '',
    frequency: 50
  })
  
  const [userCapacitor, setUserCapacitor] = useState({
    capacitance: '',
    voltage: ''
  })
  
  const [results, setResults] = useState(null)
  
  return (
    <div className="app-container">
      <Header />
      <MotorInputForm 
        data={motorData} 
        onChange={setMotorData}
        onCalculate={handleCalculate}
      />
      {results && (
        <>
          <RecommendedCapacitor data={results.recommended} />
          <CalculationResults data={results.calculations} />
          <UserCapacitorInput 
            data={userCapacitor}
            onChange={setUserCapacitor}
            onCompare={handleCompare}
          />
          {results.comparison && (
            <ComparisonTable 
              recommended={results.recommended}
              user={results.comparison}
            />
          )}
        </>
      )}
    </div>
  )
}
```

### 2. MotorInputForm.jsx
Form สำหรับรับข้อมูลมอเตอร์

```jsx
function MotorInputForm({ data, onChange, onCalculate }) {
  return (
    <div className="input-section">
      <h2>📋 ข้อมูลมอเตอร์</h2>
      <InputField
        label="ความต้านทานขดลวด Start"
        value={data.resistance}
        onChange={(v) => onChange({...data, resistance: v})}
        unit="Ω"
        placeholder="เช่น 20"
      />
      <InputField
        label="แรงดันไฟ"
        value={data.voltage}
        onChange={(v) => onChange({...data, voltage: v})}
        unit="V"
        placeholder="เช่น 220"
      />
      <InputField
        label="ความถี่"
        value={data.frequency}
        onChange={(v) => onChange({...data, frequency: v})}
        unit="Hz"
        disabled
      />
      <button onClick={onCalculate}>คำนวณ</button>
    </div>
  )
}
```

### 3. RecommendedCapacitor.jsx
แสดงค่า Capacitor ที่แนะนำ

```jsx
function RecommendedCapacitor({ data }) {
  return (
    <div className="recommended-section">
      <h2>✅ Capacitor ที่แนะนำ</h2>
      <div className="recommendation-card">
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
    </div>
  )
}
```

### 4. CalculationResults.jsx
แสดงผลการคำนวณพร้อม tooltip

```jsx
function CalculationResults({ data }) {
  return (
    <div className="calculations-section">
      <h2>📊 ผลการคำนวณ</h2>
      <div className="calculations-grid">
        <CalculationItem
          label="Capacitive Reactance (Xc)"
          value={data.Xc}
          unit="Ω"
          tooltip="ความต้านทานของ Capacitor ต่อกระแส AC - ยิ่งต่ำยิ่งให้กระแสไหลผ่านได้ง่าย"
        />
        <CalculationItem
          label="Impedance (Z)"
          value={data.Z}
          unit="Ω"
          tooltip="ความต้านทานรวมของวงจร - ยิ่งต่ำยิ่งมีกระแสมาก"
        />
        <CalculationItem
          label="Current (I)"
          value={data.I}
          unit="A"
          tooltip="กระแสที่ไหลผ่านขดลวด Start - ต้องอยู่ในช่วงที่เหมาะสม ไม่มากหรือน้อยเกินไป"
        />
        <CalculationItem
          label="Phase Angle (θ)"
          value={data.theta}
          unit="°"
          tooltip="มุมความต่างเฟสระหว่างกระแสและแรงดัน - ควรใกล้ 90° เพื่อแรงบิดสูงสุด"
        />
        <CalculationItem
          label="Power Loss (P)"
          value={data.powerLoss}
          unit="W"
          tooltip="กำลังสูญเสียเป็นความร้อนในขดลวด - ยิ่งสูงยิ่งมอเตอร์ร้อน"
        />
      </div>
    </div>
  )
}
```

### 5. CalculationItem.jsx with Tooltip
Component สำหรับแสดงค่าคำนวณพร้อม tooltip

```jsx
function CalculationItem({ label, value, unit, tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  return (
    <div 
      className="calculation-item"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)} // สำหรับ mobile
    >
      <span className="label">{label}</span>
      <span className="value">{value} {unit}</span>
      <span className="info-icon">ℹ️</span>
      {showTooltip && (
        <div className="tooltip">
          {tooltip}
        </div>
      )}
    </div>
  )
}
```

### 6. UserCapacitorInput.jsx
Form สำหรับกรอก Capacitor ที่ผู้ใช้มี

```jsx
function UserCapacitorInput({ data, onChange, onCompare }) {
  return (
    <div className="user-input-section">
      <h2>🔍 ตรวจสอบ Capacitor ที่คุณมี</h2>
      <InputField
        label="ความจุ"
        value={data.capacitance}
        onChange={(v) => onChange({...data, capacitance: v})}
        unit="µF"
        placeholder="เช่น 3.0"
      />
      <InputField
        label="แรงดัน"
        value={data.voltage}
        onChange={(v) => onChange({...data, voltage: v})}
        unit="V"
        placeholder="เช่น 450"
      />
      <button onClick={onCompare}>เปรียบเทียบ</button>
    </div>
  )
}
```

### 7. ComparisonTable.jsx
ตารางเปรียบเทียบผลลัพธ์

```jsx
function ComparisonTable({ recommended, user }) {
  return (
    <div className="comparison-section">
      <h2>📈 ตารางเปรียบเทียบ</h2>
      
      {/* Voltage Safety Check */}
      <SafetyAlert 
        safetyFactor={user.safetyFactor}
        status={user.voltageStatus}
      />
      
      {/* Comparison Table */}
      <table className="comparison-table">
        <thead>
          <tr>
            <th>พารามิเตอร์</th>
            <th>ค่าที่แนะนำ</th>
            <th>ค่าที่คุณมี</th>
            <th>ความแตกต่าง</th>
            <th>ผลกระทบ</th>
          </tr>
        </thead>
        <tbody>
          <ComparisonRow
            label="ความจุ (C)"
            recommended={`${recommended.capacitance} µF`}
            user={`${user.capacitance} µF`}
            diff={`${user.capacitanceDiff > 0 ? '+' : ''}${user.capacitanceDiff.toFixed(1)}%`}
            impact={getCapacitanceImpact(user.capacitanceDiff)}
          />
          <ComparisonRow
            label="แรงดัน (V)"
            recommended={`${recommended.voltage} V`}
            user={`${user.voltage} V`}
            diff={`SF: ${user.safetyFactor.toFixed(2)}`}
            impact={getVoltageImpact(user.safetyFactor)}
          />
          <ComparisonRow
            label="กระแส (I)"
            recommended={`${recommended.current.toFixed(3)} A`}
            user={`${user.current.toFixed(3)} A`}
            diff={`${user.currentDiff > 0 ? '+' : ''}${user.currentDiff.toFixed(1)}%`}
            impact={getCurrentImpact(user.currentDiff)}
          />
          <ComparisonRow
            label="Xc"
            recommended={`${recommended.Xc.toFixed(1)} Ω`}
            user={`${user.Xc.toFixed(1)} Ω`}
            diff={`${user.XcDiff > 0 ? '+' : ''}${user.XcDiff.toFixed(1)}%`}
            impact=""
          />
          <ComparisonRow
            label="มุมเฟส (θ)"
            recommended={`${recommended.theta.toFixed(1)}°`}
            user={`${user.theta.toFixed(1)}°`}
            diff={`${user.thetaDiff > 0 ? '+' : ''}${user.thetaDiff.toFixed(2)}°`}
            impact={getPhaseImpact(user.theta)}
          />
          <ComparisonRow
            label="กำลังสูญเสีย (P)"
            recommended={`${recommended.powerLoss.toFixed(2)} W`}
            user={`${user.powerLoss.toFixed(2)} W`}
            impact={`${user.powerLossDiff > 0 ? '+' : ''}${user.powerLossDiff.toFixed(1)}%`}
            impact={getPowerLossImpact(user.powerLossDiff)}
          />
        </tbody>
      </table>
      
      {/* Summary */}
      <SummaryCard 
        capacitanceDiff={user.capacitanceDiff}
        safetyFactor={user.safetyFactor}
        currentDiff={user.currentDiff}
      />
    </div>
  )
}
```

### 8. Impact Assessment Functions

```javascript
function getCapacitanceImpact(diff) {
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
}

function getVoltageImpact(safetyFactor) {
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

function getCurrentImpact(diff) {
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

function getPhaseImpact(theta) {
  if (theta >= 88 && theta <= 90) {
    return { text: "✅ มุมเฟสเหมาะสม", color: "green" }
  } else if (theta >= 85 && theta < 88) {
    return { text: "⚠️ มุมเฟสต่ำไป - ประสิทธิภาพลดลง", color: "orange" }
  } else {
    return { text: "❌ มุมเฟสไม่เหมาะสม", color: "red" }
  }
}

function getPowerLossImpact(diff) {
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
```

---

## Calculation Example

### ตัวอย่างข้อมูล Input:
- Resistance (R) = 20 Ω
- Voltage (V) = 220 V
- Frequency (f) = 50 Hz

### ผลการคำนวณที่ควรได้:

**Recommended Capacitor:**
```
Capacitance: 2.5 µF
Min Voltage: 467 V
Recommended Voltage: 450 V
```

**Calculations:**
```
Xc = 1,273.2 Ω
Z = 1,273.4 Ω
I = 0.173 A
θ = 89.1°
P = 0.60 W
V_peak = 311.1 V
V_peak_max = 342.2 V
Safety Factor (for 450V) = 1.32
```

### ตัวอย่างการเปรียบเทียบ:

**User Input: 5 µF, 450V**

**Results:**
```
Xc = 636.6 Ω (-50%)
Z = 636.9 Ω (-50%)
I = 0.345 A (+100%)
θ = 88.2° (-0.9°)
P = 2.38 W (+297%)
Safety Factor = 1.32 (ปลอดภัย)
```

**Impact:**
- Capacitance: ⚠️ มากเกินไป (+100%)
- Voltage: ✅ ปลอดภัย
- Current: ❌ กระแสสูงเกินไป (+100%)
- Power Loss: ❌ ความร้อนสูงเกินไป (+297%)

---

## Responsive Design

### Desktop (>768px)
- 2-column layout สำหรับ input forms
- Table แสดงแบบเต็ม
- Tooltip แสดงเมื่อ hover

### Mobile (<768px)
- 1-column layout
- Table scroll แนวนอนได้
- Tooltip แสดงเมื่อ tap
- ปุ่มใหญ่ขึ้น สำหรับ touch

---

## Validation Rules

### Input Validation:
```javascript
const validateInputs = (data) => {
  const errors = {}
  
  if (!data.resistance || data.resistance <= 0) {
    errors.resistance = "กรุณากรอกความต้านทาน (มากกว่า 0)"
  }
  
  if (!data.voltage || data.voltage <= 0) {
    errors.voltage = "กรุณากรอกแรงดันไฟ (มากกว่า 0)"
  }
  
  if (data.resistance > 1000) {
    errors.resistance = "ความต้านทานสูงผิดปกติ (ตรวจสอบหน่วย)"
  }
  
  if (data.voltage > 500) {
    errors.voltage = "แรงดันสูงผิดปกติสำหรับมอเตอร์บ้าน"
  }
  
  return errors
}
```

---

## Error Handling

### Common Errors:
1. **Division by zero** - ตรวจสอบก่อนคำนวณ
2. **Invalid numbers** - ใช้ parseFloat และตรวจสอบ isNaN
3. **Negative values** - แจ้งเตือนผู้ใช้

```javascript
const safeCalculate = (fn, fallback = 0) => {
  try {
    const result = fn()
    return isNaN(result) || !isFinite(result) ? fallback : result
  } catch (error) {
    console.error('Calculation error:', error)
    return fallback
  }
}
```

---

## Testing Scenarios

### Test Cases:

1. **Normal Case:**
   - R = 20 Ω, V = 220 V
   - Expected: C ≈ 2.5 µF, V ≥ 450 V

2. **High Resistance:**
   - R = 100 Ω, V = 220 V
   - Expected: C ≈ 0.5 µF

3. **380V System:**
   - R = 30 Ω, V = 380 V
   - Expected: V_recommended ≥ 630 V

4. **User Capacitor Too Large:**
   - Recommended: 2.5 µF
   - User: 5 µF
   - Expected: Warning about high current

5. **User Capacitor Too Small:**
   - Recommended: 2.5 µF
   - User: 1.5 µF
   - Expected: Warning about low starting torque

6. **Unsafe Voltage:**
   - V_line = 220V, User: 250V capacitor
   - Expected: Danger warning (Safety Factor < 1.0)

---

## Performance Optimization

### Tips:
1. **Memoization** - ใช้ `useMemo` สำหรับการคำนวณที่ซับซ้อน
2. **Debounce** - สำหรับ real-time calculation (ถ้ามี)
3. **Lazy Loading** - โหลด tooltip content เมื่อจำเป็น

```javascript
const calculatedResults = useMemo(() => {
  return performCalculations(motorData)
}, [motorData.resistance, motorData.voltage, motorData.frequency])
```

---

## Deployment Checklist

- [ ] ทดสอบบน Desktop (Chrome, Firefox, Safari)
- [ ] ทดสอบบน Mobile (iOS Safari, Chrome Mobile)
- [ ] ตรวจสอบ responsive design
- [ ] ทดสอบ tooltip บน touch device
- [ ] Validate all calculations
- [ ] Test edge cases
- [ ] Check accessibility (keyboard navigation)
- [ ] Optimize bundle size
- [ ] Add meta tags สำหรับ SEO

---

## Future Enhancements

### Phase 2 Features:
1. **บันทึกประวัติการคำนวณ** (LocalStorage)
2. **Export ผลลัพธ์เป็น PDF**
3. **สนับสนุนมอเตอร์ 3-Phase**
4. **Database ของ Capacitor ทั่วไป** (dropdown select)
5. **Multi-language support** (EN/TH)
6. **Visual charts** (กราฟแสดงความสัมพันธ์)
7. **Mobile app version** (React Native)

---

## Resources & References

### Formulas Source:
- ทฤษฎีจากการสนทนาก่อนหน้า
- Single-Phase Induction Motor Theory
- Capacitor Selection Guidelines

### Libraries:
- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com (optional)

---

## Contact & Support

สำหรับคำถามหรือข้อเสนอแนะ:
- Create issue ใน GitHub repository
- Email: [your-email]

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-26  
**Author:** [Your Name]

---

## Quick Start

```bash
# สร้างโปรเจค (ถ้ายังไม่ได้สร้าง)
npx create-vite@latest cap-select --template react
cd cap-select

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

แล้วเริ่มสร้าง components ตามโครงสร้างที่กำหนดไว้!

---

## License
MIT License - ใช้ได้อย่างเสรี
