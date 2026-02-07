import { Link } from 'react-router-dom';
import {
    Phone,
    MessageSquare,
    ArrowUpRight,
    X,
    AlertTriangle,
    Clock
} from 'lucide-react';
import { alerts } from '../../data/mockData';

export default function TriageDashboard() {
    const sortedAlerts = [...alerts].sort((a, b) => {
        const priorityOrder = { red: 0, yellow: 1, green: 2 };
        return priorityOrder[a.severity] - priorityOrder[b.severity];
    });

    const redCount = alerts.filter(a => a.severity === 'red').length;
    const yellowCount = alerts.filter(a => a.severity === 'yellow').length;
    const greenCount = alerts.filter(a => a.severity === 'green').length;

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `${hours}h ago`;
        return `${minutes}m ago`;
    };

    const getPriorityLabel = (severity: string) => {
        switch (severity) {
            case 'red': return 'HIGH PRIORITY';
            case 'yellow': return 'MEDIUM PRIORITY';
            default: return 'ROUTINE';
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Triage Dashboard</h1>
                <p className="page-subtitle">Review and action patient alerts</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-3" style={{ marginBottom: '24px' }}>
                <div className="kpi-card">
                    <div className="kpi-icon red">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="kpi-value" style={{ color: 'var(--alert-red)' }}>{redCount}</div>
                    <div className="kpi-label">Critical Alerts</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon yellow">
                        <Clock size={24} />
                    </div>
                    <div className="kpi-value" style={{ color: 'var(--alert-yellow)' }}>{yellowCount}</div>
                    <div className="kpi-label">Review Within 4h</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon green">
                        <Clock size={24} />
                    </div>
                    <div className="kpi-value" style={{ color: 'var(--alert-green)' }}>{greenCount}</div>
                    <div className="kpi-label">Routine Monitoring</div>
                </div>
            </div>

            {/* Alert Queue */}
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                Patient Queue ({alerts.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sortedAlerts.map((alert) => (
                    <Link
                        to={`/patient/${alert.patientId}`}
                        key={alert.id}
                        style={{ textDecoration: 'none' }}
                    >
                        <div className={`patient-card priority-${alert.severity}`}>
                            <div className="patient-card-header">
                                <div className="patient-info">
                                    <div className={`alert-badge ${alert.severity}`} style={{ marginBottom: '8px' }}>
                                        <span className={`alert-dot ${alert.severity}`} />
                                        {getPriorityLabel(alert.severity)}
                                    </div>
                                    <h3>{alert.patientName}, {alert.patientAge}</h3>
                                    <p className="patient-meta">
                                        {alert.surgeryType} • Day {alert.daysPostDischarge} post-discharge
                                    </p>
                                </div>
                                <p style={{
                                    fontSize: '13px',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Clock size={14} />
                                    {formatTime(alert.createdAt)}
                                </p>
                            </div>

                            <div className="patient-alert-reason">
                                <AlertTriangle size={18} color="var(--alert-yellow)" />
                                <span style={{ flex: 1 }}>{alert.reason}</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px'
                            }}>
                                <p className="confidence-score">
                                    Confidence: <strong style={{ color: 'var(--text-primary)' }}>{alert.confidence}%</strong>
                                </p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {alert.contributingSignals.slice(0, 2).map((signal, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                padding: '4px 8px',
                                                background: 'var(--bg-primary)',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                color: 'var(--text-secondary)'
                                            }}
                                        >
                                            {signal.signal}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="patient-card-actions">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={(e) => { e.preventDefault(); }}
                                >
                                    <Phone size={16} />
                                    Call
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={(e) => { e.preventDefault(); }}
                                >
                                    <MessageSquare size={16} />
                                    Message
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={(e) => { e.preventDefault(); }}
                                    style={{ borderColor: 'var(--alert-red)', color: 'var(--alert-red)' }}
                                >
                                    <ArrowUpRight size={16} />
                                    Escalate
                                </button>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={(e) => { e.preventDefault(); }}
                                >
                                    <X size={16} />
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
