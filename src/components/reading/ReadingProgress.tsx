interface ReadingProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export default function ReadingProgress({
    percentage,
    size = 60,
    strokeWidth = 4,
    color = 'text-primary'
}: ReadingProgressProps) {
    const safePercentage = isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (safePercentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-gray-100"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`${color} transition-all duration-500 ease-out`}
                />
            </svg>
            <span className="absolute text-xs font-bold text-gray-700">
                {Math.round(safePercentage)}%
            </span>
        </div>
    );
}
