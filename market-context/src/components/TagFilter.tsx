'use client'

import { useState, useEffect } from 'react'
import { getAllTags } from '@/lib/eventTags'

interface TagFilterProps {
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
  className?: string
}

export default function TagFilter({ selectedTag, onTagSelect, className = '' }: TagFilterProps) {
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true)
        const allTags = await getAllTags()
        setTags(allTags.sort())
      } catch (error) {
        console.error('Error fetching tags:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  const handleTagSelect = (tag: string | null) => {
    onTagSelect(tag)
    setIsOpen(false)
  }

  const clearFilter = () => {
    handleTagSelect(null)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className="truncate">
          {selectedTag ? `Filter: ${selectedTag}` : 'All tags'}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading tags...</div>
          ) : (
            <>
              <button
                onClick={() => clearFilter()}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  !selectedTag ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                All tags
              </button>
              <div className="border-t border-gray-200"></div>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                    selectedTag === tag ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
