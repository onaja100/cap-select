import React, { useState } from 'react'

interface CalculationItemProps {
  label: string
  value: number | string
  unit: string
  tooltip: string
}

export const CalculationItem: React.FC<CalculationItemProps> = ({
  label,
  value,
  unit,
  tooltip
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  return (
    <div className="relative group">
      <div className="bg-gradient-to-br from-white via-purple-50/30 to-fuchsia-50/30 border-2 border-purple-200/50 rounded-xl p-4 sm:p-5 hover:shadow-xl transition-all duration-300 cursor-help backdrop-blur-sm hover:border-purple-400/70 hover:shadow-purple-200/50">
        <div
          className="h-full"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <span className="text-xs sm:text-sm font-bold text-gray-800 leading-tight pr-2">{label}</span>
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-full p-1 sm:p-1.5 group-hover:from-purple-500 group-hover:to-fuchsia-600 transition-all duration-300 shadow-md">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-fuchsia-700">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white ml-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shadow-md">
              {unit}
            </span>
          </div>
        </div>
      </div>
      
      {showTooltip && (
        <div className="absolute z-20 w-72 p-4 mt-2 text-sm text-white bg-gradient-to-br from-purple-900 via-violet-900 to-fuchsia-900 backdrop-blur-md rounded-xl shadow-2xl border-2 border-purple-500/50 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <p className="leading-relaxed font-medium">{tooltip}</p>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-purple-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}