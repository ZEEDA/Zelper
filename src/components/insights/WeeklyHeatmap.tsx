interface WeeklyHeatmapProps {
    data: number[]; // Array of 7 numbers (0-1 intensity or raw count)
    labels?: string[]; // Mon, Tue...
    colorStart?: string; // Hex or CSS var
    colorEnd?: string;
}

export default function WeeklyHeatmap({
    data,
    labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
}: WeeklyHeatmapProps) {
    const max = Math.max(...data, 1); // Avoid division by zero

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-6">Weekly Activity</h3>

            <div className="flex justify-between items-end h-32 gap-2">
                {data.map((value, index) => {
                    const heightPercent = Math.max(10, (value / max) * 100);

                    return (
                        <div key={index} className="flex flex-col items-center flex-1 gap-2 group">
                            <div className="w-full relative flex-1 flex items-end bg-gray-50 rounded-lg overflow-hidden">
                                <div
                                    className="w-full bg-primary transition-all duration-1000 ease-out opacity-80 group-hover:opacity-100"
                                    style={{ height: `${heightPercent}%` }}
                                ></div>
                                {/* Tooltip */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                                    {value} units
                                </div>
                            </div>
                            <span className="text-xs font-bold text-gray-400">{labels[index]}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
