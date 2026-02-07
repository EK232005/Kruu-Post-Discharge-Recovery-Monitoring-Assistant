import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ClipboardList,
    Camera,
    Pill,
    Phone,
    ChevronRight,
    CheckCircle,
    AlertTriangle,
    Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { currentPatient, recoveryData, dailyTips, upcomingCheckups } from '../../data/mockData';

export default function PatientDashboard() {
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const hasLoggedToday = false; // Mock - would check actual data

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTipIndex((prev) => (prev + 1) % dailyTips.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const getStatusColor = () => {
        switch (currentPatient.status) {
            case 'green': return 'var(--alert-green)';
            case 'yellow': return 'var(--alert-yellow)';
            case 'red': return 'var(--alert-red)';
        }
    };

    const getStatusText = () => {
        switch (currentPatient.status) {
            case 'green': return 'On Track';
            case 'yellow': return 'Needs Attention';
            case 'red': return 'Alert';
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Welcome back,</p>
                <h1 style={{ fontSize: '28px', fontWeight: '700' }}>{currentPatient.name}</h1>
            </div>

            {/* Recovery Progress Card */}
            <div className="recovery-card" style={{ marginBottom: '20px' }}>
                <div className="recovery-card-header">
                    <div className="days-counter">
                        <div className="number">{currentPatient.daysPostDischarge}</div>
                        <div className="label">Days Post-Surgery</div>
                    </div>
                    <div className="status-badge-large" style={{
                        background: currentPatient.status === 'green' ? 'rgba(82, 196, 26, 0.3)' :
                            currentPatient.status === 'yellow' ? 'rgba(250, 173, 20, 0.3)' : 'rgba(255, 77, 79, 0.3)'
                    }}>
                        {currentPatient.status === 'green' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                        {getStatusText()}
                    </div>
                </div>

                {/* Mini Recovery Chart */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    height: '120px'
                }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={recoveryData}>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                            />
                            <YAxis hide domain={[0, 10]} />
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#1F2937'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expected"
                                stroke="rgba(255,255,255,0.5)"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                dot={false}
                                name="Expected"
                            />
                            <Line
                                type="monotone"
                                dataKey="actual"
                                stroke="white"
                                strokeWidth={3}
                                dot={{ fill: 'white', strokeWidth: 2 }}
                                name="Actual"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '24px',
                    marginTop: '12px',
                    fontSize: '12px',
                    opacity: 0.8
                }}>
                    <span>— — — Expected</span>
                    <span>——— Your Progress</span>
                </div>
            </div>

            {/* Data Reminder Banner */}
            {!hasLoggedToday && (
                <Link to="/log-data" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'var(--alert-yellow-bg)',
                        border: '1px solid var(--alert-yellow)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'var(--alert-yellow)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <ClipboardList size={20} />
                            </div>
                            <div>
                                <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Log Today's Data</p>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Tap to record your daily check-in</p>
                            </div>
                        </div>
                        <ChevronRight size={20} color="var(--alert-yellow)" />
                    </div>
                </Link>
            )}

            {/* Quick Actions */}
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Quick Actions</h2>
            <div className="quick-actions" style={{ marginBottom: '24px' }}>
                <Link to="/log-data" className="quick-action-btn">
                    <div className="icon">
                        <ClipboardList size={24} />
                    </div>
                    <span>Log Data</span>
                </Link>
                <button className="quick-action-btn">
                    <div className="icon" style={{ background: 'var(--alert-green-bg)', color: 'var(--alert-green)' }}>
                        <Camera size={24} />
                    </div>
                    <span>Wound Photo</span>
                </button>
                <button className="quick-action-btn">
                    <div className="icon" style={{ background: 'var(--alert-yellow-bg)', color: 'var(--alert-yellow)' }}>
                        <Pill size={24} />
                    </div>
                    <span>Medications</span>
                </button>
                <button className="quick-action-btn">
                    <div className="icon" style={{ background: 'var(--alert-red-bg)', color: 'var(--alert-red)' }}>
                        <Phone size={24} />
                    </div>
                    <span>Contact Nurse</span>
                </button>
            </div>

            {/* Upcoming Checkups */}
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Upcoming Checkups</h2>
            <div style={{ marginBottom: '24px' }}>
                {upcomingCheckups.map((checkup) => (
                    <div key={checkup.id} className="card" style={{
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '60px',
                            borderRadius: '10px',
                            background: 'var(--primary-light)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)'
                        }}>
                            <Calendar size={18} />
                            <span style={{ fontSize: '14px', fontWeight: '700' }}>
                                {checkup.date.getDate()}
                            </span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '600' }}>{checkup.type}</p>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                {checkup.doctor}
                            </p>
                        </div>
                        <ChevronRight size={20} color="var(--text-muted)" />
                    </div>
                ))}
            </div>

            {/* Daily Tips Carousel */}
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recovery Tips</h2>
            <div className="card" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                marginBottom: '24px'
            }}>
                <p style={{ fontSize: '15px', lineHeight: 1.6 }}>
                    💡 {dailyTips[currentTipIndex].tip}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                    {dailyTips.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: index === currentTipIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                                transition: 'background 0.3s'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
