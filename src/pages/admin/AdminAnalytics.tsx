import {
    Users,
    AlertTriangle,
    HeartPulse,
    IndianRupee,
    TrendingUp,
    Calendar
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { analyticsData } from '../../data/mockData';

export default function AdminAnalytics() {
    const formatCurrency = (value: number) => {
        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(1)}L`;
        }
        return `₹${value.toLocaleString()}`;
    };

    const kpiCards = [
        {
            title: 'Total Patients Monitored',
            value: analyticsData.totalPatients,
            icon: Users,
            color: 'purple',
            change: '+12%',
            positive: true
        },
        {
            title: 'Active Alerts',
            value: analyticsData.activeAlerts,
            icon: AlertTriangle,
            color: 'red',
            change: '-8%',
            positive: true
        },
        {
            title: 'Readmissions Avoided',
            value: analyticsData.readmissionsAvoided,
            icon: HeartPulse,
            color: 'green',
            change: '+15%',
            positive: true
        },
        {
            title: 'Cost Savings',
            value: formatCurrency(analyticsData.costSavings),
            icon: IndianRupee,
            color: 'yellow',
            change: '+22%',
            positive: true
        },
    ];

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
                    <h1 className="page-title">Analytics Dashboard</h1>
                    <p className="page-subtitle">System performance and outcomes overview</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="btn btn-secondary btn-sm">
                        <Calendar size={16} />
                        Last 30 Days
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-4" style={{ marginBottom: '24px' }}>
                {kpiCards.map((kpi, index) => (
                    <div key={index} className="kpi-card">
                        <div className={`kpi-icon ${kpi.color}`}>
                            <kpi.icon size={24} />
                        </div>
                        <div className="kpi-value">
                            {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                        </div>
                        <div className="kpi-label">{kpi.title}</div>
                        <div className={`kpi-change ${kpi.positive ? 'positive' : 'negative'}`}>
                            <TrendingUp size={14} />
                            {kpi.change} this month
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Alert Precision Over Time */}
                <div className="card">
                    <div className="chart-header">
                        <h3 className="chart-title">Alert Precision Over Time</h3>
                        <div style={{
                            padding: '4px 12px',
                            background: 'var(--alert-green-bg)',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--alert-green)'
                        }}>
                            85% Current
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analyticsData.alertPrecisionOverTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                />
                                <YAxis
                                    domain={[60, 100]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value) => [`${value}%`, 'Precision']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="precision"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 5 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts by Surgery Type */}
                <div className="card">
                    <div className="chart-header">
                        <h3 className="chart-title">Alerts by Surgery Type</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.alertsBySurgeryType} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="type"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    width={60}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar
                                    dataKey="alerts"
                                    fill="var(--primary)"
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-3">
                <div className="card">
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                        Detection Time Savings
                    </h3>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        marginBottom: '8px'
                    }}>
                        18h
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Average earlier detection vs standard follow-up
                    </p>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                        Alerts per Patient/Day
                    </h3>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        color: 'var(--alert-green)',
                        marginBottom: '8px'
                    }}>
                        0.18
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Well below target of 0.2 alerts/patient/day
                    </p>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                        Nurse Efficiency
                    </h3>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        color: 'var(--alert-yellow)',
                        marginBottom: '8px'
                    }}>
                        4.2m
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Average time per alert review (target: &lt;5min)
                    </p>
                </div>
            </div>
        </div>
    );
}
