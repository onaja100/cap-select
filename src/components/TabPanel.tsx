import { ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  badge?: string
}

interface TabPanelProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  children: ReactNode
  className?: string
}

export function TabPanel({
  tabs,
  activeTab,
  onTabChange,
  children,
  className = ''
}: TabPanelProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
