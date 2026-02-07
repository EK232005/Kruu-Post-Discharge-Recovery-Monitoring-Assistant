import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Download, Search, ClipboardList } from 'lucide-react';
import { getAuditByPatient } from '../../api/api';
import type { AuditLogEntry } from '../../api/types';

// Mock all audit entries for now
const mockAuditLog: AuditLogEntry[] = [
    {
        id: 'L001',
        timestamp: '2026-02-07T16:30:00Z',
        userId: 'nurse_priya',
        role: 'nurse',
        action: 'call',
        alert_id: 'A001',
        patient_id: 'P001',
        note: 'Called patient. Confirmed increased pain. Advised rest and medication.',
        previous_state: 'open'
    },
    {
        id: 'L002',
        timestamp: '2026-02-07T14:15:00Z',
        userId: 'nurse_rahul',
        role: 'nurse',
        action: 'message',
        patient_id: 'P002',
        note: 'Sent medication reminder SMS',
    },
    {
        id: 'L003',
        timestamp: '2026-02-06T10:00:00Z',
        userId: 'nurse_priya',
        role: 'nurse',
        action: 'escalate',
        alert_id: 'A003',
        patient_id: 'P003',
        note: 'Escalated to Dr. Sharma - high pain with fever',
        previous_state: 'open'
    },
    {
        id: 'L004',
        timestamp: '2026-02-05T09:30:00Z',
        userId: 'system',
        role: 'admin',
        action: 'consent_granted',
        patient_id: 'P001',
        note: 'Voice recording consent granted'
    }
];

export default function AuditTrailPage() {
    const { patientId } = useParams();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

    useEffect(() => {
        // Load audit log - use mock data for now
        if (patientId) {
            getAuditByPatient(patientId).then(setAuditLog);
        } else {
            setAuditLog(mockAuditLog);
        }
    }, [patientId]);

    const filteredLogs = auditLog.filter(log =>
        log.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionStyle = (action: string) => {
        switch (action) {
            case 'call':
                return { bg: 'var(--primary-light)', color: 'var(--primary)' };
            case 'escalate':
                return { bg: 'var(--alert-red-bg)', color: '#ef4444' };
            case 'dismiss':
                return { bg: 'var(--bg-secondary)', color: 'var(--text-muted)' };
            case 'consent_granted':
                return { bg: 'var(--alert-green-bg)', color: '#16a34a' };
            case 'consent_revoked':
                return { bg: 'var(--alert-yellow-bg)', color: '#b45309' };
            default:
                return { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
        }
    };

    const handleExport = () => {
        const csvContent = [
            [t('audit.timestamp'), t('audit.user'), 'Role', t('audit.action'), 'Alert ID', 'Patient ID', t('audit.note')],
            ...filteredLogs.map(log => [
                formatDate(log.timestamp),
                log.userId,
                log.role,
                log.action,
                log.alert_id || '',
                log.patient_id,
                log.note
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

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
                    <h1 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ClipboardList size={24} aria-hidden="true" />
                        {t('audit.title')}
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {t('audit.subtitle')}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleExport}>
                    <Download size={18} aria-hidden="true" />
                    {t('audit.exportCsv')}
                </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
                <Search
                    size={20}
                    style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }}
                    aria-hidden="true"
                />
                <input
                    type="text"
                    className="form-input"
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '48px' }}
                    aria-label="Search audit log"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-3" style={{ marginBottom: '24px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)' }}>
                        {auditLog.length}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Actions</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a' }}>
                        {new Set(auditLog.map(l => l.patient_id)).size}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Patients Reviewed</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>
                        {new Set(auditLog.map(l => l.userId)).size}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Active Users</p>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="table" role="table">
                    <thead>
                        <tr>
                            <th scope="col">{t('audit.timestamp')}</th>
                            <th scope="col">{t('audit.user')}</th>
                            <th scope="col">{t('audit.action')}</th>
                            <th scope="col">Patient</th>
                            <th scope="col">{t('audit.note')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => {
                            const actionStyle = getActionStyle(log.action);
                            return (
                                <tr key={log.id}>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {formatDate(log.timestamp)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                                                {log.userId.split('_').map(n => n[0].toUpperCase()).join('')}
                                            </div>
                                            {log.userId}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            background: actionStyle.bg,
                                            color: actionStyle.color,
                                            borderRadius: '4px',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            textTransform: 'capitalize'
                                        }}>
                                            {log.action.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>{log.patient_id}</td>
                                    <td style={{ maxWidth: '300px' }}>{log.note}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredLogs.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px',
                        color: 'var(--text-muted)'
                    }}>
                        <ClipboardList size={48} style={{ marginBottom: '16px', opacity: 0.5 }} aria-hidden="true" />
                        <p>{t('common.noData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
