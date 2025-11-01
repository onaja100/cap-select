import { useState, ReactNode } from 'react'

interface AccordionSectionProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  badge?: string
  className?: string
}

export function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
  badge,
  className = ''
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-blue-600">{icon}</span>}
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
          {badge && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
