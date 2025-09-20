'use client'

interface TagChipProps {
  tag: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'secondary' | 'outline'
  onClick?: () => void
  className?: string
}

export default function TagChip({ 
  tag, 
  size = 'sm', 
  variant = 'default',
  onClick,
  className = ''
}: TagChipProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    primary: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    secondary: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
  }

  const baseClasses = 'inline-flex items-center rounded-full font-medium transition-colors'
  const clickableClasses = onClick ? 'cursor-pointer' : ''

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {tag}
    </span>
  )
}
