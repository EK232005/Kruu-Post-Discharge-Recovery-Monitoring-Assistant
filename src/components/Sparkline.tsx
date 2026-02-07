import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
    data: { day: number; value: number; expected?: number }[];
    color?: string;
    showExpected?: boolean;
}

export default function Sparkline({
    data,
    color = 'var(--primary)',
    showExpected = false
}: SparklineProps) {
    return (
        <div
            style={{ width: '100%', height: '40px' }}
            role="img"
            aria-label="7-day recovery trend sparkline"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    {showExpected && (
                        <Line
                            type="monotone"
                            dataKey="expected"
                            stroke="var(--text-muted)"
                            strokeDasharray="3 3"
                            strokeWidth={1}
                            dot={false}
                            isAnimationActive={false}
                        />
                    )}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
