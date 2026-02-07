import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Phone,
    MessageSquare,
    ArrowUpRight,
    User,
    Calendar,
    MapPin,
    FileText,
    Check
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { alerts } from '../../data/mockData';

// Extended recovery data for detail view
const patientRecoveryData = [
    { day: 1, expectedPain: 7, actualPain: 7, expectedSteps: 500, actualSteps: 520 },
    { day: 2, expectedPain: 6, actualPain: 6, expectedSteps: 800, actualSteps: 850 },
    { day: 3, expectedPain: 5, actualPain: 5, expectedSteps: 1200, actualSteps: 1100 },
    { day: 4, expectedPain: 4, actualPain: 6, expectedSteps: 1500, actualSteps: 600 },
];

export default function PatientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showActionPanel, setShowActionPanel] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');
    const [notes, setNotes] = useState('');
    const [actionComplete, setActionComplete] = useState(false);

    const alert = alerts.find(a => a.patientId === id) || alerts[0];

    const actions = [
        { id: 'call', label: 'Call Patient', description: 'Direct phone consultation' },
        { id: 'prescription', label: 'Remote Prescription', description: 'Send medication to pharmacy' },
        { id: 'schedule', label: 'Schedule Visit', description: 'Book clinic appointment' },
        { id: 'escalate', label: 'Escalate to Physician', description: 'Urgent medical review' },
        { id: 'dismiss', label: 'False Alarm', description: 'Mark as reviewed, no action needed' },
    ];

    const assessmentQuestions = [
        'Have you noticed any fever or chills?',
        'Is there any redness or swelling around the surgical site?',
        'Are you able to bear weight on your leg?',
        'Have you been taking your medications as prescribed?',
        'On a scale of 1-10, how would you rate your pain right now?',
    ];

    const handleSubmitAction = () => {
        setActionComplete(true);
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    if (actionComplete) {
        return (
            <div className="animate-fadeIn" style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--alert-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                }}>
                    <Check size={40} color="white" />
                </div>
                <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Action Logged</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Alert has been marked as reviewed and action recorded.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <button className="btn-icon" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '24px' }}>Patient Details</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Alert ID: {alert.id}
                    </p>
                </div>
                <div className={`alert-badge ${alert.severity}`}>
                    <span className={`alert-dot ${alert.severity}`} />
                    {alert.severity.toUpperCase()}
                </div>
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
                {/* Left Column - Charts */}
                <div>
                    {/* Alert Reason Card */}
                    <div className="card" style={{
                        marginBottom: '20px',
                        background: alert.severity === 'red' ? 'var(--alert-red-bg)' : 'var(--alert-yellow-bg)',
                        border: `1px solid ${alert.severity === 'red' ? 'var(--alert-red)' : 'var(--alert-yellow)'}`
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                            ⚠️ Alert Reason
                        </h3>
                        <p style={{ marginBottom: '16px' }}>{alert.reason}</p>

                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                            Contributing Signals:
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {alert.contributingSignals.map((signal, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '8px 12px',
                                        background: 'rgba(255, 255, 255, 0.6)',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <span>{signal.signal}</span>
                                    <span style={{
                                        fontWeight: '600',
                                        color: signal.weight > 0.3 ? 'var(--alert-red)' : 'var(--text-secondary)'
                                    }}>
                                        {Math.round(signal.weight * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                            🔍 Likely Causes
                        </h3>
                        <div style={{
                            padding: '16px',
                            background: 'var(--bg-primary)',
                            borderRadius: '8px',
                            fontSize: '15px',
                            lineHeight: 1.6
                        }}>
                            {alert.severity === 'red'
                                ? "Based on the combination of increased pain, elevated temperature, and reduced mobility, this pattern suggests a possible infection or inadequate pain management. Recommend immediate assessment."
                                : "Activity levels are below baseline. This could indicate pain-related reluctance to move, or may require motivational support. Consider follow-up call."}
                        </div>
                    </div>

                    {/* Pain Chart */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <div className="chart-header">
                            <h3 className="chart-title">Pain Trend</h3>
                            <div className="chart-legend">
                                <span className="legend-item">
                                    <span className="legend-dot" style={{ background: 'var(--text-muted)' }} />
                                    Expected
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot" style={{ background: 'var(--primary)' }} />
                                    Actual
                                </span>
                            </div>
                        </div>
                        <div style={{ height: '200px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={patientRecoveryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <ReferenceLine y={5} stroke="var(--alert-yellow)" strokeDasharray="5 5" />
                                    <Line
                                        type="monotone"
                                        dataKey="expectedPain"
                                        stroke="var(--text-muted)"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="actualPain"
                                        stroke="var(--primary)"
                                        strokeWidth={3}
                                        dot={{ fill: 'var(--primary)', r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Steps Chart */}
                    <div className="card">
                        <div className="chart-header">
                            <h3 className="chart-title">Activity Level</h3>
                        </div>
                        <div style={{ height: '200px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={patientRecoveryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 2000]} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="expectedSteps"
                                        stroke="var(--text-muted)"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="actualSteps"
                                        stroke="var(--alert-green)"
                                        strokeWidth={3}
                                        dot={{ fill: 'var(--alert-green)', r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column - Patient Info & Actions */}
                <div>
                    {/* Patient Profile */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                            <div className="avatar lg">
                                {alert.patientName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{alert.patientName}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{alert.patientAge} years old</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FileText size={18} color="var(--text-muted)" />
                                <span>{alert.surgeryType}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={18} color="var(--text-muted)" />
                                <span>Day {alert.daysPostDischarge} post-discharge</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={18} color="var(--text-muted)" />
                                <span>Mumbai, Maharashtra</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Phone size={18} color="var(--text-muted)" />
                                <span>+91 98765 43210</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button className="btn btn-primary" onClick={() => setShowActionPanel(true)}>
                                <Phone size={18} />
                                Call Patient
                            </button>
                            <button className="btn btn-secondary">
                                <MessageSquare size={18} />
                                Send Message
                            </button>
                            <button
                                className="btn btn-secondary"
                                style={{ borderColor: 'var(--alert-red)', color: 'var(--alert-red)' }}
                            >
                                <ArrowUpRight size={18} />
                                Escalate to Physician
                            </button>
                        </div>
                    </div>

                    {/* Review Panel */}
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => setShowActionPanel(true)}
                    >
                        Start Review
                    </button>
                </div>
            </div>

            {/* Action Panel Modal */}
            {showActionPanel && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '24px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        padding: '24px'
                    }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Review & Take Action</h2>

                        {/* Assessment Questions */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                                Scripted Assessment Questions
                            </h3>
                            <div style={{
                                background: 'var(--bg-primary)',
                                borderRadius: '8px',
                                padding: '16px'
                            }}>
                                {assessmentQuestions.map((q, i) => (
                                    <p key={i} style={{
                                        marginBottom: i < assessmentQuestions.length - 1 ? '12px' : 0,
                                        paddingBottom: i < assessmentQuestions.length - 1 ? '12px' : 0,
                                        borderBottom: i < assessmentQuestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                                        fontSize: '14px'
                                    }}>
                                        {i + 1}. {q}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="form-group">
                            <label className="form-label">Findings & Notes</label>
                            <textarea
                                className="form-input"
                                style={{ height: '100px', resize: 'none', paddingTop: '12px' }}
                                placeholder="Document your assessment findings..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        {/* Action Selection */}
                        <div style={{ marginBottom: '24px' }}>
                            <label className="form-label">Select Action</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {actions.map((action) => (
                                    <div
                                        key={action.id}
                                        onClick={() => setSelectedAction(action.id)}
                                        style={{
                                            padding: '12px 16px',
                                            border: `2px solid ${selectedAction === action.id ? 'var(--primary)' : 'var(--border-color)'}`,
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            background: selectedAction === action.id ? 'var(--primary-light)' : 'white'
                                        }}
                                    >
                                        <p style={{ fontWeight: '500' }}>{action.label}</p>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{action.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => setShowActionPanel(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={handleSubmitAction}
                                disabled={!selectedAction}
                            >
                                Submit Action
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
