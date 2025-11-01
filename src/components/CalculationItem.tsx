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
      <div className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/50 rounded-xl p-4 sm:p-5 hover:shadow-lg transition-all duration-300 cursor-help backdrop-blur-sm hover:border-blue-300/50 hover:bg-white">
        <div 
          className="h-full"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight pr-2">{label}</span>
            <div className="flex-shrink-0">
              <div className="bg-blue-100 rounded-full p-1 sm:p-1.5 group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            <span className="text-xs sm:text-sm font-medium text-blue-600 ml-2 bg-blue-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
              {unit}
            </span>
          </div>
        </div>
      </div>
      
      {showTooltip && (
        <div className="absolute z-20 w-72 p-4 mt-2 text-sm text-white bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <p className="leading-relaxed">{tooltip}</p>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900/95"></div>
          </div>
        </div>
      )}
    </div>
  )
}