'use client';

interface MetricRowProps {
  label: string;
  value: string;
  isPositive: boolean;
  tagType?: 'direct' | 'indirect';
}

export default function MetricRow({ label, value, isPositive, tagType }: MetricRowProps) {
  const getTagColor = () => {
    if (tagType === 'direct') {
      return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
    } else if (tagType === 'indirect') {
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
    return '';
  };

  const getTagText = () => {
    if (tagType === 'direct') return 'Direct';
    if (tagType === 'indirect') return 'Indirect';
    return '';
  };

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
        {tagType && (
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getTagColor()}`}>
            {getTagText()}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <span className={`text-xs ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPositive ? '↗' : '↘'}
        </span>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
