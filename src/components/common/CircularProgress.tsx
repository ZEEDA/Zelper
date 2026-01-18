interface CircularProgressProps {
    value: number; // 0-100
    max?: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    subLabel?: string;
}

export default function CircularProgress({
    value,
    max = 100,
    size = 120,
    strokeWidth = 10,
    color = 'text-primary',
    label,
    subLabel
}: CircularProgressProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

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
                    className={`${color} transition-all duration-1000 ease-out`}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-gray-900">
                    {label || `${Math.round(percentage)}%`}
                </span>
                {subLabel && (
                    <span className="text-xs font-medium text-gray-500 uppercase mt-1">
                        {subLabel}
                    </span>
                )}
            </div>
        </div>
    );
}
