import React from 'react'

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  unit?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  type?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  unit,
  placeholder,
  disabled = false,
  error,
  type = 'text'
}) => {
  return (
    <div className="mb-3 sm:mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {unit && <span className="text-blue-600 ml-2 font-medium">({unit})</span>}
      </label>
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-300 font-medium
            focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
            group-hover:shadow-md
            ${disabled 
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' 
              : 'bg-white/80 backdrop-blur-sm hover:bg-white'
            }
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        />
        {unit && !disabled && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded-lg">
              {unit}
            </span>
          </div>
        )}
        {disabled && unit && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm font-medium bg-gray-100 px-2 py-1 rounded-lg">
              {unit}
            </span>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-center">
          <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}