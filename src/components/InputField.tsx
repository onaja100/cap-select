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
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
        {unit && <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 ml-2 font-bold">({unit})</span>}
      </label>
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border-2 rounded-xl shadow-md transition-all duration-300 font-medium
            focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-500
            group-hover:shadow-lg
            ${disabled
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white/90 backdrop-blur-sm hover:bg-white hover:border-cyan-300'
            }
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-cyan-200/50 hover:border-cyan-300'
            }
          `}
        />
        {unit && !disabled && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-white text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 rounded-lg shadow-md">
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
        <div className="mt-2 flex items-center bg-rose-50 border border-rose-200 rounded-lg p-2">
          <svg className="w-4 h-4 text-rose-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-rose-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}