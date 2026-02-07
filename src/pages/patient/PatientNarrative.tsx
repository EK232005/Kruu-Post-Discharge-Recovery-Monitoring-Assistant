import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft,
    Phone,
    MessageSquare,
    Check,
    TrendingUp,
    TrendingDown,
    Activity,
    Send,
    Globe
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart,
    Line
} from 'recharts';
import RecoveryStatusBadge from '../../components/RecoveryStatusBadge';
import ConsentBanner from '../../components/ConsentBanner';
import { getPatientById, getExplain, postAlertAction, postConsent, getAlerts } from '../../api/api';
import type { Alert, Patient, ExplainResponse } from '../../api/types';

export default function PatientNarrative() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [patient, setPatient] = useState<Patient | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [explain, setExplain] = useState<ExplainResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionComplete, setActionComplete] = useState(false);
    const [showSmsModal, setShowSmsModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        const patientData = await getPatientById(id || '');
        setPatient(patientData);

        // Get alerts for this patient (mock - in real app would filter by patient)
        const { getAlerts } = await import('../../api/api');
        const allAlerts = await getAlerts();
        const patientAlerts = allAlerts.filter(a => a.patient_id === id);
        setAlerts(patientAlerts);

        // Get explanation for first alert
        if (patientAlerts.length > 0) {
            const explainData = await getExplain(patientAlerts[0].alert_id);
            setExplain(explainData);
        }

        setLoading(false);
    };

    const handleRevokeConsent = async (type: 'voice' | 'photo') => {
        if (!patient) return;
        await postConsent({ patientId: patient.patient_id, type, consent: false });
        await loadData();
    };

    const handleCall = async () => {
        if (alerts.length > 0) {
            await postAlertAction(alerts[0].alert_id, {
                action: 'call',
                userId: 'nurse_user',
                note: 'Called patient for assessment'
            });
            setActionComplete(true);
            setTimeout(() => setActionComplete(false), 3000);
        }
    };

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
    };

    // Generate recovery chart data
    const recoveryData = patient?.baselines ? Array.from({ length: 7 }, (_, i) => {
        const day = i + 1;
        const painBaseline = patient.baselines.pain_mean;
        const painStd = patient.baselines.pain_std;
        const expectedPain = Math.max(1, painBaseline - (day * 0.3));

        return {
            day: `Day ${day}`,
            pain_actual: day <= patient.days_post_discharge ?
                (day === patient.days_post_discharge && alerts[0]?.metrics[0]?.value
                    ? alerts[0].metrics[0].value
                    : expectedPain + (Math.random() - 0.5) * 2)
                : undefined,
            pain_expected: expectedPain,
            pain_upper: expectedPain + painStd * 2,
            pain_lower: Math.max(0, expectedPain - painStd * 2),
            steps_actual: day <= patient.days_post_discharge ?
                patient.baselines.steps_expected[day - 1] * (0.7 + Math.random() * 0.4)
                : undefined,
            steps_expected: patient.baselines.steps_expected[day - 1] || 1000
        };
    }) : [];

    if (loading) {
        return <div style={{ padding: '24px', textAlign: 'center' }}>{t('common.loading')}</div>;
    }

    if (!patient) {
        return <div style={{ padding: '24px' }}>Patient not found</div>;
    }

    const latestAlert = alerts[0];
    const status = latestAlert?.severity === 'red' ? 'critical' :
        latestAlert?.severity === 'yellow' ? 'deviated' : 'on_track';

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        className="btn-icon"
                        onClick={() => navigate('/alerts')}
                        aria-label="Go back to alerts"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: 700 }}>{patient.name}</h1>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {patient.age}y • {patient.surgery_type} • {t('alerts.daysPostDischarge', { days: patient.days_post_discharge })}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={toggleLanguage}
                    >
                        <Globe size={16} />
                        {i18n.language === 'en' ? 'हिंदी' : 'EN'}
                    </button>
                    <RecoveryStatusBadge status={status} />
                    <span style={{
                        padding: '6px 12px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '16px',
                        fontSize: '13px',
                        fontWeight: 600
                    }}>
                        {t('patient.riskTier', { tier: patient.risk_tier })}
                    </span>
                </div>
            </div>

            {/* Consent Banner */}
            <ConsentBanner
                voiceConsent={patient.consent.voice}
                photoConsent={patient.consent.photo}
                onRevokeVoice={() => handleRevokeConsent('voice')}
                onRevokePhoto={() => handleRevokeConsent('photo')}
            />

            {/* Action Complete Toast */}
            {actionComplete && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: '#16a34a',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                    <Check size={18} />
                    Action logged successfully
                </div>
            )}

            {/* 3-Column Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr 1fr',
                gap: '20px',
                marginTop: '16px'
            }}>
                {/* Left: What Changed */}
                <div className="card">
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={18} color="var(--primary)" />
                        {t('patient.narrative.whatChanged')}
                    </h3>

                    {latestAlert?.metrics.map((metric, idx) => {
                        const delta = metric.baseline_mean
                            ? metric.value - metric.baseline_mean
                            : metric.expected ? metric.value - metric.expected : 0;
                        const zScore = metric.baseline_std
                            ? (metric.value - (metric.baseline_mean || 0)) / metric.baseline_std
                            : 0;
                        const isUp = delta > 0;

                        return (
                            <div
                                key={idx}
                                style={{
                                    padding: '12px',
                                    background: 'var(--bg-primary)',
                                    borderRadius: '8px',
                                    marginBottom: '12px',
                                    borderLeft: `3px solid ${Math.abs(zScore) > 2 ? '#ef4444' : '#f59e0b'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{metric.name.replace('_', ' ')}</span>
                                    {isUp ? <TrendingUp size={16} color="#ef4444" /> : <TrendingDown size={16} color="#16a34a" />}
                                </div>
                                <p style={{ fontSize: '24px', fontWeight: 700, color: Math.abs(zScore) > 2 ? '#ef4444' : 'var(--text-primary)' }}>
                                    {metric.value}
                                </p>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                    {metric.baseline_mean !== undefined && (
                                        <>Baseline: {metric.baseline_mean} • Δ {delta > 0 ? '+' : ''}{delta.toFixed(1)}</>
                                    )}
                                    {metric.expected !== undefined && !metric.baseline_mean && (
                                        <>Expected: {metric.expected} • {((metric.value / metric.expected) * 100).toFixed(0)}%</>
                                    )}
                                </p>
                                {metric.baseline_std && (
                                    <p style={{ fontSize: '12px', color: Math.abs(zScore) > 2 ? '#ef4444' : 'var(--text-muted)', marginTop: '4px' }}>
                                        z-score: {zScore.toFixed(2)}σ
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    {/* Timeline */}
                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginTop: '16px', marginBottom: '8px' }}>
                        Recent Events
                    </h4>
                    <div style={{ fontSize: '13px' }}>
                        {alerts.slice(0, 3).map((alert, idx) => (
                            <div key={idx} style={{
                                padding: '8px 0',
                                borderBottom: idx < 2 ? '1px solid var(--border-color)' : 'none'
                            }}>
                                <span style={{
                                    color: alert.severity === 'red' ? '#ef4444' : '#f59e0b',
                                    fontWeight: 500
                                }}>
                                    {new Date(alert.timestamp).toLocaleDateString()}
                                </span>
                                <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>
                                    {alert.reason.split(';')[0]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Why + Chart */}
                <div>
                    {/* Recovery Chart */}
                    <div className="card" style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={18} color="var(--primary)" />
                            {t('patient.timeline.title')}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            Expected band vs actual • Pain score
                        </p>
                        <div style={{ height: '200px' }} role="img" aria-label={t('accessibility.recoveryChart')}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={recoveryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                    <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="pain_upper"
                                        stroke="none"
                                        fill="rgba(107, 92, 231, 0.1)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pain_lower"
                                        stroke="none"
                                        fill="white"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="pain_expected"
                                        stroke="var(--text-muted)"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                        name="Expected"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="pain_actual"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        dot={{ fill: '#ef4444', r: 4 }}
                                        name="Actual"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Why - Top 3 Causes */}
                    <div className="card">
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                            {t('patient.causes.title')}
                        </h3>

                        {explain?.factors.map((factor, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '12px',
                                    background: idx === 0 ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-primary)',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    borderLeft: `3px solid ${idx === 0 ? '#ef4444' : idx === 1 ? '#f59e0b' : 'var(--border-color)'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                        #{idx + 1} {factor.feature.replace('_', ' ')}
                                    </span>
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: factor.contribution > 0.3 ? '#ef4444' : 'var(--text-secondary)'
                                    }}>
                                        {(factor.contribution * 100).toFixed(0)}% contribution
                                    </span>
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    {factor.evidence}
                                </p>
                            </div>
                        ))}

                        {!explain && (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                                No explanation available
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: What To Do */}
                <div className="card">
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                        {t('patient.playbook.title')}
                    </h3>

                    {/* Quick Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleCall}
                            aria-label={t('accessibility.callButton', { name: patient.name })}
                        >
                            <Phone size={18} />
                            {t('patient.playbook.callPatient')}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowSmsModal(true)}
                        >
                            <MessageSquare size={18} />
                            {t('patient.playbook.sms')}
                        </button>
                    </div>

                    {/* Triage Script */}
                    <div style={{ background: 'var(--bg-primary)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                            {t('patient.playbook.script')}
                        </h4>
                        <ol style={{ paddingLeft: '16px', fontSize: '13px', lineHeight: 1.6 }}>
                            <li style={{ marginBottom: '6px' }}>{t('triage.script.q1')}</li>
                            <li style={{ marginBottom: '6px' }}>{t('triage.script.q2')}</li>
                            <li style={{ marginBottom: '6px' }}>{t('triage.script.q5')}</li>
                        </ol>
                    </div>

                    {/* Suggested Actions */}
                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                        Recommended
                    </h4>
                    <ul style={{ paddingLeft: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {explain?.suggested_actions.map((action, idx) => (
                            <li key={idx} style={{ marginBottom: '6px' }}>{action}</li>
                        ))}
                    </ul>

                    {/* Patient Contact Info */}
                    <div style={{
                        marginTop: '20px',
                        padding: '12px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        fontSize: '13px'
                    }}>
                        <p><strong>Phone:</strong> {patient.phone}</p>
                        {patient.caregiver && (
                            <p style={{ marginTop: '4px' }}>
                                <strong>Caregiver:</strong> {patient.caregiver.name} ({patient.caregiver.relationship}) - {patient.caregiver.phone}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* SMS Modal */}
            {showSmsModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setShowSmsModal(false)}
                >
                    <div
                        className="card"
                        style={{ maxWidth: '500px', margin: '24px' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ marginBottom: '16px' }}>{t('patient.playbook.sms')}</h3>
                        <textarea
                            className="form-input"
                            style={{ height: '120px', marginBottom: '16px' }}
                            defaultValue={t('sms.alertTemplate', {
                                name: patient.name.split(' ')[0],
                                hospital: 'City Hospital'
                            })}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary" onClick={() => setShowSmsModal(false)} style={{ flex: 1 }}>
                                {t('common.cancel')}
                            </button>
                            <button className="btn btn-primary" onClick={() => setShowSmsModal(false)} style={{ flex: 1 }}>
                                <Send size={16} />
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
