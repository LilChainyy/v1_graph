'use client'

import { useMyImportantFilter } from '@/hooks/useMyImportantFilter'

interface MyImportantFilterProps {
  eventIds: string[]
  className?: string
}

export default function MyImportantFilter({ eventIds, className = '' }: MyImportantFilterProps) {
  const { 
    isEnabled, 
    loading, 
    error, 
    toggleFilter 
  } = useMyImportantFilter({ eventIds })

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={toggleFilter}
          disabled={loading}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
        />
        <span className={`text-sm font-medium ${loading ? 'text-gray-400' : 'text-gray-700'}`}>
          Show events I voted Yes
        </span>
      </label>
      
      {loading && (
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <div className="animate-spin w-3 h-3 border border-gray-300 border-t-blue-600 rounded-full"></div>
          <span>Loading...</span>
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}
