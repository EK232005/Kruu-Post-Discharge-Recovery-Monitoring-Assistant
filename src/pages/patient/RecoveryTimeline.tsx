import { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
    Area,
    AreaChart
} from 'recharts';
import { Download, TrendingUp, Footprints, Thermometer } from 'lucide-react';
import { recoveryData, currentPatient } from '../../data/mockData';

// Extended data for the timeline
const fullRecoveryData = [
    { day: 1, expectedPain: 7, actualPain: 7, expectedSteps: 500, actualSteps: 520, temp: 98.4 },
    { day: 2, expectedPain: 6, actualPain: 6, expectedSteps: 800, actualSteps: 850, temp: 98.6 },
    { day: 3, expectedPain: 5, actualPain: 5, expectedSteps: 1200, actualSteps: 1100, temp: 99.1 },
    { day: 4, expectedPain: 4, actualPain: 6, expectedSteps: 1500, actualSteps: 600, temp: 99.8 },
    { day: 5, expectedPain: 4, actualPain: null, expectedSteps: 2000, actualSteps: null, temp: null },
    { day: 6, expectedPain: 3, actualPain: null, expectedSteps: 2500, actualSteps: null, temp: null },
    { day: 7, expectedPain: 3, actualPain: null, expectedSteps: 3000, actualSteps: null, temp: null },
];

export default function RecoveryTimeline() {
    const [activeFilter, setActiveFilter] = useState<'pain' | 'steps' | 'temp'>('pain');

    const filters = [
        { id: 'pain' as const, label: 'Pain', icon: TrendingUp, color: 'var(--primary)' },
        { id: 'steps' as const, label: 'Activity', icon: Footprints, color: 'var(--alert-green)' },
        { id: 'temp' as const, label: 'Temperature', icon: Thermometer, color: 'var(--alert-yellow)' },
    ];

    const getChartConfig = () => {
        switch (activeFilter) {
            case 'pain':
                return {
                    expectedKey: 'expectedPain',
                    actualKey: 'actualPain',
                    domain: [0, 10],
                    yLabel: 'Pain Score',
                    color: 'var(--primary)',
                };
            case 'steps':
                return {
                    expectedKey: 'expectedSteps',
                    actualKey: 'actualSteps',
                    domain: [0, 4000],
                    yLabel: 'Steps',
                    color: 'var(--alert-green)',
                };
            case 'temp':
                return {
                    expectedKey: null,
                    actualKey: 'temp',
                    domain: [96, 102],
                    yLabel: '°F',
                    color: 'var(--alert-yellow)',
                };
        }
    };

    const config = getChartConfig();

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{ fontSize: '24px' }}>Recovery Timeline</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Track your progress over time
                    </p>
                </div>
                <button className="btn btn-secondary btn-sm">
                    <Download size={18} />
                    Export
                </button>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                overflowX: 'auto',
                paddingBottom: '4px'
            }}>
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        className={`btn ${activeFilter === filter.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        onClick={() => setActiveFilter(filter.id)}
                        style={{
                            minWidth: 'fit-content',
                            ...(activeFilter === filter.id ? {} : { borderColor: 'var(--border-color)' })
                        }}
                    >
                        <filter.icon size={16} />
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Main Chart */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <div className="chart-header">
                    <h3 className="chart-title">
                        {activeFilter === 'pain' ? 'Pain Level' : activeFilter === 'steps' ? 'Daily Steps' : 'Body Temperature'}
                    </h3>
                    <div className="chart-legend">
                        {activeFilter !== 'temp' && (
                            <span className="legend-item">
                                <span className="legend-dot" style={{ background: 'var(--text-muted)', opacity: 0.5 }} />
                                Expected
                            </span>
                        )}
                        <span className="legend-item">
                            <span className="legend-dot" style={{ background: config.color }} />
                            Actual
                        </span>
                    </div>
                </div>

                <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {activeFilter === 'temp' ? (
                            <AreaChart data={fullRecoveryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    label={{ value: 'Day', position: 'bottom', offset: -5 }}
                                />
                                <YAxis
                                    domain={config.domain}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <ReferenceLine y={99} stroke="var(--alert-yellow)" strokeDasharray="5 5" label="Normal" />
                                <ReferenceLine y={100.4} stroke="var(--alert-red)" strokeDasharray="5 5" label="Fever" />
                                <Area
                                    type="monotone"
                                    dataKey="temp"
                                    stroke={config.color}
                                    fill={config.color}
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                    dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                                    name="Temperature"
                                    connectNulls={false}
                                />
                            </AreaChart>
                        ) : (
                            <LineChart data={fullRecoveryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    label={{ value: 'Day', position: 'bottom', offset: -5 }}
                                />
                                <YAxis
                                    domain={config.domain}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px'
                                    }}
                                />
                                {config.expectedKey && (
                                    <Line
                                        type="monotone"
                                        dataKey={config.expectedKey}
                                        stroke="var(--text-muted)"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                        name="Expected"
                                    />
                                )}
                                <Line
                                    type="monotone"
                                    dataKey={config.actualKey}
                                    stroke={config.color}
                                    strokeWidth={3}
                                    dot={{ fill: config.color, strokeWidth: 2, r: 5 }}
                                    activeDot={{ r: 8 }}
                                    name="Actual"
                                    connectNulls={false}
                                />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-2">
                <div className="card">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                        Today's {activeFilter === 'pain' ? 'Pain' : activeFilter === 'steps' ? 'Steps' : 'Temp'}
                    </p>
                    <p style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: activeFilter === 'pain' ? 'var(--primary)' : activeFilter === 'steps' ? 'var(--alert-green)' : 'var(--alert-yellow)'
                    }}>
                        {activeFilter === 'pain' ? '6/10' : activeFilter === 'steps' ? '600' : '99.8°F'}
                    </p>
                    <p style={{
                        fontSize: '13px',
                        color: activeFilter === 'pain' || activeFilter === 'temp' ? 'var(--alert-yellow)' : 'var(--alert-red)',
                        marginTop: '4px'
                    }}>
                        {activeFilter === 'pain' ? '+2 from expected' : activeFilter === 'steps' ? '-60% from goal' : 'Slightly elevated'}
                    </p>
                </div>

                <div className="card">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                        Recovery Status
                    </p>
                    <p style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: 'var(--alert-yellow)'
                    }}>
                        Day {currentPatient.daysPostDischarge}
                    </p>
                    <p style={{
                        fontSize: '13px',
                        color: 'var(--alert-yellow)',
                        marginTop: '4px'
                    }}>
                        Needs attention
                    </p>
                </div>
            </div>

            {/* Events Timeline */}
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '24px 0 16px' }}>Recent Events</h2>
            <div className="card">
                {[
                    { day: 4, event: 'Pain spike detected', type: 'alert' },
                    { day: 4, event: 'Activity significantly reduced', type: 'alert' },
                    { day: 3, event: 'Medication taken on time', type: 'success' },
                    { day: 2, event: 'Recovery on track', type: 'success' },
                ].map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '16px',
                            padding: '12px 0',
                            borderBottom: index < 3 ? '1px solid var(--border-color)' : 'none'
                        }}
                    >
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            marginTop: '6px',
                            background: item.type === 'alert' ? 'var(--alert-yellow)' : 'var(--alert-green)'
                        }} />
                        <div>
                            <p style={{ fontWeight: '500' }}>{item.event}</p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Day {item.day}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
