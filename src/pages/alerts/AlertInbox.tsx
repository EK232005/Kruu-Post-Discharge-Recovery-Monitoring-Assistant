import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Filter, Globe } from 'lucide-react';
import AlertCard from '../../components/AlertCard';
import { getAlerts, getPatientById, postAlertAction } from '../../api/api';
import type { Alert, Patient } from '../../api/types';

export default function AlertInbox() {
    const { t, i18n } = useTranslation();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [patients, setPatients] = useState<Map<string, Patient>>(new Map());
    const [loading, setLoading] = useState(true);
    const [showTriageModal, setShowTriageModal] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [selectedAction, setSelectedAction] = useState('');
    const [notes, setNotes] = useState('');
    const [checkedQuestions, setCheckedQuestions] = useState<boolean[]>([false, false, false, false, false]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const alertData = await getAlerts();
        setAlerts(alertData);

        // Load patient data for each alert
        const patientMap = new Map<string, Patient>();
        for (const alert of alertData) {
            if (!patientMap.has(alert.patient_id)) {
                const patient = await getPatientById(alert.patient_id);
                if (patient) patientMap.set(alert.patient_id, patient);
            }
        }
        setPatients(patientMap);
        setLoading(false);
    };

    const handleAction = (alert: Alert, action: 'call' | 'message' | 'escalate' | 'dismiss') => {
        setSelectedAlert(alert);
        setSelectedAction(action);
        setShowTriageModal(true);
    };

    const handleSubmitAction = async () => {
        if (!selectedAlert || !selectedAction) return;

        await postAlertAction(selectedAlert.alert_id, {
            action: selectedAction as 'call' | 'message' | 'escalate' | 'dismiss',
            userId: 'nurse_user',
            note: notes
        });

        setShowTriageModal(false);
        setSelectedAction('');
        setNotes('');
        setCheckedQuestions([false, false, false, false, false]);
        await loadData(); // Refresh
    };

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
    };

    const triageQuestions = [
        t('triage.script.q1'),
        t('triage.script.q2'),
        t('triage.script.q3'),
        t('triage.script.q4'),
        t('triage.script.q5')
    ];

    // Count by severity
    const redCount = alerts.filter(a => a.severity === 'red' && a.status === 'open').length;
    const yellowCount = alerts.filter(a => a.severity === 'yellow' && a.status === 'open').length;
    const greenCount = alerts.filter(a => a.severity === 'green' && a.status === 'open').length;

    if (loading) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={24} aria-hidden="true" />
                        {t('alerts.title')}
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {t('alerts.subtitle')}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={toggleLanguage}
                        aria-label="Toggle language between English and Hindi"
                    >
                        <Globe size={16} aria-hidden="true" />
                        {i18n.language === 'en' ? 'हिंदी' : 'English'}
                    </button>
                    <button className="btn btn-secondary btn-sm">
                        <Filter size={16} aria-hidden="true" />
                        {t('common.filter')}
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-3" style={{ marginBottom: '24px' }}>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                        <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '24px' }}>{redCount}</span>
                    </div>
                    <div className="kpi-label">{t('alerts.severity.red')}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                        <span style={{ color: '#b45309', fontWeight: 700, fontSize: '24px' }}>{yellowCount}</span>
                    </div>
                    <div className="kpi-label">{t('alerts.severity.yellow')}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(22, 163, 74, 0.1)' }}>
                        <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '24px' }}>{greenCount}</span>
                    </div>
                    <div className="kpi-label">{t('alerts.severity.green')}</div>
                </div>
            </div>

            {/* Alert List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {alerts.filter(a => a.status === 'open').map((alert) => {
                    const patient = patients.get(alert.patient_id);
                    return (
                        <AlertCard
                            key={alert.alert_id}
                            alert={alert}
                            patientName={patient?.name || 'Unknown'}
                            patientAge={patient?.age || 0}
                            surgeryType={patient?.surgery_type || 'Unknown'}
                            onAction={(action) => handleAction(alert, action)}
                        />
                    );
                })}

                {alerts.filter(a => a.status === 'open').length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px',
                        color: 'var(--text-muted)'
                    }}>
                        <Bell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} aria-hidden="true" />
                        <p>{t('alerts.noAlerts')}</p>
                    </div>
                )}
            </div>

            {/* Triage Modal */}
            {showTriageModal && selectedAlert && (
                <div
                    style={{
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
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="triage-title"
                >
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        padding: '24px'
                    }}>
                        <h2 id="triage-title" style={{ fontSize: '20px', marginBottom: '20px' }}>
                            {t('triage.title')}
                        </h2>

                        {/* Assessment Checklist */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                                {t('triage.script.title')}
                            </h3>
                            <div style={{
                                background: 'var(--bg-primary)',
                                borderRadius: '8px',
                                padding: '16px'
                            }}>
                                {triageQuestions.map((q, i) => (
                                    <label
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            marginBottom: i < triageQuestions.length - 1 ? '12px' : 0,
                                            paddingBottom: i < triageQuestions.length - 1 ? '12px' : 0,
                                            borderBottom: i < triageQuestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checkedQuestions[i]}
                                            onChange={(e) => {
                                                const updated = [...checkedQuestions];
                                                updated[i] = e.target.checked;
                                                setCheckedQuestions(updated);
                                            }}
                                            style={{ marginTop: '3px' }}
                                        />
                                        <span style={{ fontSize: '14px' }}>{q}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="form-group">
                            <label className="form-label">{t('triage.notes')}</label>
                            <textarea
                                className="form-input"
                                style={{ height: '100px', resize: 'none', paddingTop: '12px' }}
                                placeholder={t('triage.notesPlaceholder')}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        {/* Action Selection */}
                        <div style={{ marginBottom: '24px' }}>
                            <label className="form-label">{t('triage.selectAction')}</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[
                                    { id: 'call', label: t('triage.actionOptions.call'), desc: t('triage.actionOptions.callDesc') },
                                    { id: 'message', label: t('triage.actionOptions.prescription'), desc: t('triage.actionOptions.prescriptionDesc') },
                                    { id: 'escalate', label: t('triage.actionOptions.escalate'), desc: t('triage.actionOptions.escalateDesc') },
                                    { id: 'dismiss', label: t('triage.actionOptions.dismiss'), desc: t('triage.actionOptions.dismissDesc') }
                                ].map((action) => (
                                    <div
                                        key={action.id}
                                        onClick={() => setSelectedAction(action.id)}
                                        onKeyDown={(e) => e.key === 'Enter' && setSelectedAction(action.id)}
                                        tabIndex={0}
                                        role="radio"
                                        aria-checked={selectedAction === action.id}
                                        style={{
                                            padding: '12px 16px',
                                            border: `2px solid ${selectedAction === action.id ? 'var(--primary)' : 'var(--border-color)'}`,
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            background: selectedAction === action.id ? 'var(--primary-light)' : 'white'
                                        }}
                                    >
                                        <p style={{ fontWeight: 500 }}>{action.label}</p>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{action.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => setShowTriageModal(false)}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={handleSubmitAction}
                                disabled={!selectedAction}
                            >
                                {t('common.submit')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
