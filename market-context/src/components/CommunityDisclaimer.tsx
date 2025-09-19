'use client'

interface CommunityDisclaimerProps {
  className?: string
}

export default function CommunityDisclaimer({ className = '' }: CommunityDisclaimerProps) {
  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-sm text-blue-800">
          <p className="font-medium">Community votes are opinions, not investment advice.</p>
          <p className="text-blue-600 mt-1">
            These votes represent community sentiment for educational purposes only. 
            Always consult with a qualified financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
